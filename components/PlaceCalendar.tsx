import MonthCalendar from "@/components/MonthCalendar";
import { CLIMATE_RANGE_LABEL, fetchMonthlyClimate } from "@/lib/tripClimate";

export default async function PlaceCalendar({
  placeName,
  lat,
  lng,
  heading = "h2",
}: {
  placeName: string;
  lat: number;
  lng: number;
  heading?: "h1" | "h2";
}) {
  const months = await fetchMonthlyClimate(lat, lng);
  if (!months) return null;

  const Title = heading;

  return (
    <section id="ay-takvimi" aria-labelledby="month-calendar-heading" className="space-y-6">
      <header className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
          Ay takvimi · {CLIMATE_RANGE_LABEL}
        </p>
        <Title
          id="month-calendar-heading"
          className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl"
        >
          {placeName}
        </Title>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          On iki ayın gündüz, gece ve yağışlı gün ortalaması. Tatil ayını
          seçerken yağış çizgisine bakın.
        </p>
      </header>
      <MonthCalendar months={months} />
    </section>
  );
}
