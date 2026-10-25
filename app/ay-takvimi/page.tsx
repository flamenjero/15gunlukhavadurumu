import type { Metadata } from "next";
import Link from "next/link";
import { listCitiesRemote } from "@/lib/locationService";
import { absoluteUrl } from "@/lib/site";

const title = "Ay takvimi";
const description =
  "Türkiye illerinde on iki ayın gündüz, gece ve yağışlı gün ortalaması. 2016–2025 kayıtları.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/ay-takvimi" },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/ay-takvimi"),
    locale: "tr_TR",
  },
};

const FEATURED = [
  { name: "İstanbul", slug: "istanbul" },
  { name: "Ankara", slug: "ankara" },
  { name: "İzmir", slug: "izmir" },
  { name: "Antalya", slug: "antalya" },
  { name: "Muğla", slug: "mugla" },
  { name: "Trabzon", slug: "trabzon" },
  { name: "Nevşehir", slug: "nevsehir" },
  { name: "Bursa", slug: "bursa" },
];

export default async function MonthCalendarHubPage() {
  const cities = await listCitiesRemote();
  const featured = FEATURED.map((city) => {
    const known = cities.find((item) => item.slug === city.slug);
    return known ? { name: known.name, slug: known.slug } : city;
  });

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
        Yıl boyu
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900 sm:text-6xl">
        Ay takvimi
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600">
        Bir il seçin. On iki ayın sıcaklık ve yağış düzeni, 2016–2025
        kayıtlarının ortalamasıyla durur.
      </p>
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {featured.map((city) => (
          <li key={city.slug}>
            <Link
              href={`/ay-takvimi/${city.slug}`}
              className="flex min-h-28 items-end rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-lg font-semibold tracking-tight text-stone-900 transition hover:border-stone-400 hover:bg-white"
            >
              {city.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
