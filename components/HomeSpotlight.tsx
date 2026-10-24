import Link from "next/link";
import { fetchFifteenDayForecast } from "@/lib/open-meteo";

const SPOTLIGHTS = [
  {
    slug: "istanbul",
    name: "İstanbul",
    lat: 41.0136,
    lng: 28.955,
    tint: "from-sky-400 via-sky-500 to-blue-700",
  },
  {
    slug: "ankara",
    name: "Ankara",
    lat: 39.9208,
    lng: 32.8541,
    tint: "from-amber-300 via-orange-400 to-orange-600",
  },
  {
    slug: "izmir",
    name: "İzmir",
    lat: 38.4237,
    lng: 27.1428,
    tint: "from-cyan-300 via-sky-400 to-sky-700",
  },
  {
    slug: "antalya",
    name: "Antalya",
    lat: 36.8969,
    lng: 30.7133,
    tint: "from-orange-300 via-rose-400 to-rose-600",
  },
  {
    slug: "trabzon",
    name: "Trabzon",
    lat: 41.0027,
    lng: 39.7168,
    tint: "from-teal-300 via-cyan-500 to-sky-800",
  },
  {
    slug: "bursa",
    name: "Bursa",
    lat: 40.195,
    lng: 29.06,
    tint: "from-indigo-300 via-blue-500 to-indigo-800",
  },
] as const;

export default async function HomeSpotlight() {
  const cards = await Promise.all(
    SPOTLIGHTS.map(async (place) => {
      const forecast = await fetchFifteenDayForecast(place.lat, place.lng);
      return { place, today: forecast?.days[0] ?? null };
    }),
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
    </section>
  );
}
