"use client";

import type { CsvRow } from "@/types/csv";

interface CsvPreviewTableProps {
  headers: string[];
  rows: CsvRow[];
}

export default function CsvPreviewTable({
  headers,
  rows,
}: CsvPreviewTableProps) {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            CSV Preview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review the uploaded data before confirming the import.
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {rows.length} rows
        </span>
      </div>

      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-max w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100">
            <tr>
              <th className="whitespace-nowrap border-b border-slate-200 px-5 py-3 font-semibold text-slate-700">
                #
              </th>

              {headers.map((header) => (
                <th
                  key={header}
                  className="whitespace-nowrap border-b border-slate-200 px-5 py-3 font-semibold text-slate-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="whitespace-nowrap px-5 py-3 text-slate-400">
                  {rowIndex + 1}
                </td>

                {headers.map((header) => (
                  <td
                    key={`${rowIndex}-${header}`}
                    className="max-w-xs whitespace-nowrap px-5 py-3 text-slate-700"
                  >
                    {row[header] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}