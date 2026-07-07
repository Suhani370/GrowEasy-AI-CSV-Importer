import type { CrmRecord } from "@/types/csv";

interface ResultTableProps {
  records: CrmRecord[];
}

const columns: {
  key: keyof CrmRecord;
  label: string;
}[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "country_code", label: "Country Code" },
  {
    key: "mobile_without_country_code",
    label: "Mobile",
  },
  { key: "company", label: "Company" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "country", label: "Country" },
  { key: "crm_status", label: "CRM Status" },
  { key: "crm_note", label: "CRM Note" },
  { key: "data_source", label: "Data Source" },
];

export default function ResultTable({
  records,
}: ResultTableProps) {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          AI Extracted CRM Records
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Successfully normalized and validated CRM data.
        </p>
      </div>

      <div className="max-h-[500px] overflow-auto">
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-100">
            <tr>
              <th className="whitespace-nowrap border-b border-slate-200 px-5 py-3 font-semibold text-slate-700">
                #
              </th>

              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap border-b border-slate-200 px-5 py-3 font-semibold text-slate-700"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {records.map((record, index) => (
              <tr
                key={`${record.email}-${index}`}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="px-5 py-3 text-slate-400">
                  {index + 1}
                </td>

                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="max-w-xs whitespace-nowrap px-5 py-3 text-slate-700"
                  >
                    {record[column.key] || "—"}
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