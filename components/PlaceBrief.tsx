import type { DayForecast } from "@/components/WeatherCard";
import { buildPlaceBrief, toBriefDays } from "@/lib/placeBrief";
import { fetchMonthlyClimate } from "@/lib/tripClimate";

export interface PlaceBriefProps {
  placeName: string;
  monthLabel: string;
  days: DayForecast[];
  lat?: number;
  lng?: number;
  elevation?: number;
}

function istanbulMonth(now = new Date()): number {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Istanbul",
      month: "numeric",
    }).format(now),
  );
}

export default async function PlaceBrief({
  placeName,
  monthLabel,
  days,
  lat,
  lng,
  elevation,
}: PlaceBriefProps) {
  const climate =
    lat != null && lng != null ? await fetchMonthlyClimate(lat, lng) : null;
  const monthClimate =
    climate?.find((month) => month.month === istanbulMonth()) ?? null;
  const paragraphs = buildPlaceBrief({
    placeName,
    monthLabel,
    days: toBriefDays(days),
    elevation,
    monthClimate,
  });

  if (paragraphs.length === 0) return null;

  return (
    <section
      aria-labelledby="place-brief-heading"
      className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-4 sm:px-5"
    >
      <h2
        id="place-brief-heading"
        className="text-lg font-semibold tracking-tight text-slate-900"
      >
        {placeName} için bu dönemin özeti
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
