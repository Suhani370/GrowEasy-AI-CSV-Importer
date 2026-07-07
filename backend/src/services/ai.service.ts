import { GoogleGenAI, Type } from "@google/genai";
import { buildCrmExtractionPrompt } from "../prompts/crm.prompt.js";
import {
  allowedCrmStatuses,
  allowedDataSources,
  crmRecordSchema,
  type CrmRecord,
  type ImportResult,
} from "../types/crm.types.js";
import type { CsvRecord } from "./csv.service.js";

const BATCH_SIZE = 20;
const MAX_RETRIES = 2;

const getAiClient = (): GoogleGenAI => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return new GoogleGenAI({
    apiKey,
  });
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    records: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          created_at: { type: Type.STRING },
          name: { type: Type.STRING },
          email: { type: Type.STRING },
          country_code: { type: Type.STRING },
          mobile_without_country_code: { type: Type.STRING },
          company: { type: Type.STRING },
          city: { type: Type.STRING },
          state: { type: Type.STRING },
          country: { type: Type.STRING },
          lead_owner: { type: Type.STRING },
          crm_status: { type: Type.STRING },
          crm_note: { type: Type.STRING },
          data_source: { type: Type.STRING },
          possession_time: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: [
          "created_at",
          "name",
          "email",
          "country_code",
          "mobile_without_country_code",
          "company",
          "city",
          "state",
          "country",
          "lead_owner",
          "crm_status",
          "crm_note",
          "data_source",
          "possession_time",
          "description",
        ],
      },
    },
  },
  required: ["records"],
};

const normalizeRecord = (record: CrmRecord): CrmRecord => {
  const normalizedStatus = allowedCrmStatuses.includes(
    record.crm_status as (typeof allowedCrmStatuses)[number]
  )
    ? record.crm_status
    : "";

  const normalizedDataSource = allowedDataSources.includes(
    record.data_source as (typeof allowedDataSources)[number]
  )
    ? record.data_source
    : "";

  const normalizedDate =
    record.created_at &&
    !Number.isNaN(new Date(record.created_at).getTime())
      ? record.created_at
      : "";

  return {
    ...record,
    crm_status: normalizedStatus,
    data_source: normalizedDataSource,
    created_at: normalizedDate,
  };
};

const processBatch = async (
  batch: CsvRecord[],
  attempt = 0
): Promise<CrmRecord[]> => {
  try {
    const ai = getAiClient();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildCrmExtractionPrompt(batch),
      config: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.1,
      },
    });

    if (!response.text) {
      throw new Error("AI returned an empty response");
    }

    const parsed = JSON.parse(response.text) as {
      records: unknown[];
    };

    if (!Array.isArray(parsed.records)) {
      throw new Error("AI response does not contain records");
    }

    if (parsed.records.length !== batch.length) {
      throw new Error(
        `AI returned ${parsed.records.length} records for a batch of ${batch.length}`
      );
    }

    return parsed.records.map((record) => {
      const validatedRecord = crmRecordSchema.parse(record);

      return normalizeRecord(validatedRecord);
    });
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      console.warn(
        `AI batch attempt ${attempt + 1} failed. Retrying...`
      );

      return processBatch(batch, attempt + 1);
    }

    throw error;
  }
};

export const extractCrmRecords = async (
  records: CsvRecord[]
): Promise<ImportResult> => {
  const extractedRecords: CrmRecord[] = [];
  const skippedRecords: CsvRecord[] = [];

  for (
    let index = 0;
    index < records.length;
    index += BATCH_SIZE
  ) {
    const batch = records.slice(
      index,
      index + BATCH_SIZE
    );

    const aiRecords = await processBatch(batch);

    aiRecords.forEach((record, recordIndex) => {
      const hasEmail =
        record.email.trim().length > 0;

      const hasMobile =
        record.mobile_without_country_code.trim().length > 0;

      if (!hasEmail && !hasMobile) {
        skippedRecords.push(
          batch[recordIndex] ?? {}
        );

        return;
      }

      extractedRecords.push(record);
    });
  }

  return {
    records: extractedRecords,
    skippedRecords,
    totalImported: extractedRecords.length,
    totalSkipped: skippedRecords.length,
  };
};