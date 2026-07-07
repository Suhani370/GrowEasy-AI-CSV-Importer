import type { Request, Response } from "express";
import { parseCsvBuffer } from "../services/csv.service.js";
import { extractCrmRecords } from "../services/ai.service.js";

export const importCsvWithAi = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
      return;
    }

    const records = parseCsvBuffer(req.file.buffer);

    if (records.length === 0) {
      res.status(400).json({
        success: false,
        message: "CSV contains no records",
      });
      return;
    }

    const result = await extractCrmRecords(records);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("AI import error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "AI extraction failed";

    res.status(500).json({
      success: false,
      message,
    });
  }
};