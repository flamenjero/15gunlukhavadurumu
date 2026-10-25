import Link from "next/link";
import { fetchFifteenDayForecast } from "@/lib/open-meteo";
import { buildTurkeyBrief } from "@/lib/turkeyBrief";

const SPOTLIGHTS = [
  {
    slug: "istanbul",
    name: "İstanbul",
    region: "Marmara",
    lat: 41.0136,
    lng: 28.955,
    tint: "from-sky-400 via-sky-500 to-blue-700",
  },
  {
    slug: "ankara",
    name: "Ankara",
    region: "İç Anadolu",
    lat: 39.9208,
    lng: 32.8541,
    tint: "from-amber-300 via-orange-400 to-orange-600",
  },
  {
    slug: "izmir",
    name: "İzmir",
    region: "Ege",
    lat: 38.4237,
    lng: 27.1428,
    tint: "from-cyan-300 via-sky-400 to-sky-700",
  },
  {
    slug: "antalya",
    name: "Antalya",
    region: "Akdeniz",
    lat: 36.8969,
    lng: 30.7133,
    tint: "from-orange-300 via-rose-400 to-rose-600",
  },
  {
    slug: "trabzon",
    name: "Trabzon",
    region: "Karadeniz",
    lat: 41.0027,
    lng: 39.7168,
    tint: "from-teal-300 via-cyan-500 to-sky-800",
  },
  {
    slug: "bursa",
    name: "Bursa",
    region: "Marmara",
    lat: 40.195,
    lng: 29.06,
    tint: "from-indigo-300 via-blue-500 to-indigo-800",
  },
] as const;

export default async function HomeSpotlight() {
  const cards = await Promise.all(
    SPOTLIGHTS.map(async (place) => {
      const forecast = await fetchFifteenDayForecast(place.lat, place.lng);
      const days = forecast?.days ?? [];
      return { place, today: days[0] ?? null, days };
    }),
  );
  const brief = buildTurkeyBrief(
    cards.map(({ place, today, days }) => ({
      name: place.name,
      region: place.region,
      today: today
        ? { high: today.high, precipitationChance: today.precipitationChance }
        : null,
      days: days.map((day) => ({
        date: day.date,
        high: day.high,
        precipitationChance: day.precipitationChance,
      })),
    })),
  );

  return (
    <section aria-labelledby="spotlight-cities" className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2
          id="spotlight-cities"
          className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl"
        >
          Bugün Türkiye’de
        </h2>
        <p className="text-sm text-slate-500">15 güne kadar</p>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map(({ place, today }) => (
          <li key={place.slug}>
            <Link
              href={`/${place.slug}`}
              className={`group flex min-h-40 flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br p-4 text-white shadow-lg shadow-sky-900/10 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl ${place.tint}`}
            >
              <span className="text-sm font-semibold tracking-wide text-white/90">
                {place.name}
              </span>
              <span>
                <span className="block text-4xl font-semibold tracking-tight sm:text-5xl">
                  {today ? `${today.high}°` : "—"}
                </span>
                <span className="mt-1 block text-sm text-white/90">
                  {today
                    ? `${today.condition} · gece ${today.low}°`
                    : "15 günlük tahmin"}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {brief ? (
        <div className="rounded-3xl border border-stone-200 bg-white px-6 py-7 sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
            Bugünün özeti
          </p>
          <div className="mt-3 max-w-3xl space-y-3 text-sm leading-relaxed text-stone-700 sm:text-base">
            {brief.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-5 text-sm text-stone-600">
            <Link href="/15-gunluk-tahmin-nasil-okunur" className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-800">
              15 günlük tahmin nasıl okunur
            </Link>
            <span className="mx-2 text-stone-300">/</span>
            <Link href="/tatil-haftasi-nasil-secilir" className="font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-800">
              Tatil haftası nasıl seçilir
            </Link>
          </p>
        </div>
      ) : null}
    </section>
  );
}
