
import { Card } from "@/components/common/Card";

const performance = [
  { day: "Mon", value: 45 },
  { day: "Tue", value: 60 },
  { day: "Wed", value: 55 },
  { day: "Thu", value: 72 },
  { day: "Fri", value: 68 },
  { day: "Sat", value: 82 },
  { day: "Sun", value: 78 },
];

export function PerformanceChart() {
  const average = Math.round(
    performance.reduce((sum, item) => sum + item.value, 0) /
      performance.length,
  );

  return (
    <Card className="overflow-hidden border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Weekly performance
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your accuracy over the last 7 days
          </p>
        </div>

        <div className="rounded-xl bg-indigo-50 px-3 py-2 text-right dark:bg-indigo-500/10">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Average
          </p>
          <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">
            {average}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8">
        <div className="relative h-48">
          {/* Grid */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
            {[100, 75, 50, 25, 0].map((value) => (
              <div key={value} className="flex items-center gap-3">
                <span className="w-7 text-right text-[10px] font-medium text-slate-400 dark:text-slate-600">
                  {value}
                </span>

                <div className="h-px flex-1 border-t border-dashed border-slate-200 dark:border-slate-800" />
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 ml-10 flex items-end gap-2 sm:gap-4">
            {performance.map((item) => (
              <div
                key={item.day}
                className="group flex h-full flex-1 flex-col items-center justify-end"
              >
                {/* Value */}
                <span className="mb-2 text-[10px] font-bold text-slate-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-slate-500">
                  {item.value}%
                </span>

                {/* Bar */}
                <div
                  className="relative w-full max-w-10 overflow-hidden rounded-t-xl bg-indigo-100 transition-all duration-300 group-hover:bg-indigo-200 dark:bg-indigo-500/10 dark:group-hover:bg-indigo-500/20"
                  style={{ height: `${item.value}%` }}
                >
                  <div className="absolute inset-x-0 bottom-0 h-full rounded-t-xl bg-indigo-500 transition-all duration-300 group-hover:bg-indigo-600 dark:bg-indigo-500 dark:group-hover:bg-indigo-400" />
                </div>

                {/* Day */}
                <span className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Accuracy
          </span>
        </div>

        <span className="text-xs text-slate-400 dark:text-slate-500">
          7 day overview
        </span>
      </div>
    </Card>
  );
}
