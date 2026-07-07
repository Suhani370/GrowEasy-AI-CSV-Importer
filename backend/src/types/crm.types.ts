import { z } from "zod";

export const allowedCrmStatuses = [
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
  "SALE_DONE",
] as const;

export const allowedDataSources = [
  "leads_on_demand",
  "meridian_tower",
  "eden_park",
  "varah_swamy",
  "sarjapur_plots",
] as const;

export const crmRecordSchema = z.object({
  created_at: z.string(),
  name: z.string(),
  email: z.string(),
  country_code: z.string(),
  mobile_without_country_code: z.string(),
  company: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  lead_owner: z.string(),
  crm_status: z.string(),
  crm_note: z.string(),
  data_source: z.string(),
  possession_time: z.string(),
  description: z.string(),
});

export type CrmRecord = z.infer<typeof crmRecordSchema>;

export interface ImportResult {
  records: CrmRecord[];
  skippedRecords: Record<string, unknown>[];
  totalImported: number;
  totalSkipped: number;
}