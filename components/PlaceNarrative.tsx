import { fetchMonthlyClimate, istanbulToday } from "@/lib/tripClimate";
import { buildPlaceCharacter } from "@/lib/placeCharacter";
import type { DayForecast } from "@/components/WeatherCard";

const MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
] as const;

export default async function PlaceNarrative({
  placeName,
  lat,
  lng,
  elevation,
  days,
}: {
  placeName: string;
  lat: number;
  lng: number;
  elevation?: number | null;
  days: DayForecast[];
}) {
  const months = await fetchMonthlyClimate(lat, lng);
  const monthNumber = Number(istanbulToday().slice(5, 7));
  const month = months?.find((item) => item.month === monthNumber) ?? null;
  const paragraphs = buildPlaceCharacter({
    placeName,
    elevation,
    monthLabel: month?.label ?? MONTHS[monthNumber - 1] ?? "",
    monthClimate: month,
    days,
  });

  if (paragraphs.length === 0) return null;

  return (
    <section
      aria-labelledby="place-character"
      className="rounded-3xl border border-stone-200 bg-white px-6 py-7 sm:px-8"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
        Bu yer
      </p>
      <h2
        id="place-character"
        className="mt-2 text-2xl font-semibold tracking-tight text-stone-900"
      >
        Bu ayın hali
      </h2>
      <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-stone-700 sm:text-base">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
