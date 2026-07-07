import { CheckCircle2, Database, SkipForward } from "lucide-react";

interface ImportSummaryProps {
  totalImported: number;
  totalSkipped: number;
}

export default function ImportSummary({
  totalImported,
  totalSkipped,
}: ImportSummaryProps) {
  const totalProcessed = totalImported + totalSkipped;

  const cards = [
    {
      label: "Total Processed",
      value: totalProcessed,
      icon: Database,
    },
    {
      label: "Successfully Imported",
      value: totalImported,
      icon: CheckCircle2,
    },
    {
      label: "Skipped Records",
      value: totalSkipped,
      icon: SkipForward,
    },
  ];

  return (
    <section className="mt-8 grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-50 p-3">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  {card.label}
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}