import type { MonthClimate } from "@/lib/tripClimate";

export default function MonthCalendar({ months }: { months: MonthClimate[] }) {
  return (
    <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {months.map((month) => (
        <li
          key={month.month}
          className="rounded-2xl border border-stone-200 bg-white px-4 py-4"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
            {month.label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">
            {month.high}°
          </p>
          <p className="mt-1 text-sm text-stone-500">gece {month.low}°</p>
          <div
            className="mt-4 h-px bg-stone-200"
            aria-hidden
          >
            <div
              className="h-px bg-stone-900"
              style={{ width: `${Math.min(100, Math.max(0, month.rainChance))}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-stone-500">
            yağışlı gün %{month.rainChance}
          </p>
        </li>
      ))}
    </ol>
  );
}
