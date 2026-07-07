import { parse } from "csv-parse/sync";

export type CsvRecord = Record<string, string>;

export const parseCsvBuffer = (buffer: Buffer): CsvRecord[] => {
  const csvText = buffer.toString("utf-8").replace(/^\uFEFF/, "");

  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as CsvRecord[];

  return records;
};