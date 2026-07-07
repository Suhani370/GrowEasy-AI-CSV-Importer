export type CsvRow = Record<string, string>;

export interface CsvData {
  file: File;
  headers: string[];
  rows: CsvRow[];
}

export interface CrmRecord {
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: string;
  crm_note: string;
  data_source: string;
  possession_time: string;
  description: string;
}

export interface ImportResult {
  success: boolean;
  records: CrmRecord[];
  skippedRecords: CsvRow[];
  totalImported: number;
  totalSkipped: number;
}