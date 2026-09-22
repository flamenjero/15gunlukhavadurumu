import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ApiviceBanner from "@/components/ApiviceBanner";
import JsonLd from "@/components/JsonLd";
import LocationSearch from "@/components/LocationSearch";
import { listCitiesRemote } from "@/lib/locationService";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "15 Günlük Hava Durumu ve Mevsimsel Rehber",
  description:
    "Şehir ve ilçe bazında 15 günlük hava durumu, mevsimsel öneriler ve planlama rehberi.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "15 Günlük Hava Durumu ve Mevsimsel Rehber",
    description:
      "Şehir ve ilçe bazında 15 günlük hava durumu, mevsimsel öneriler ve planlama rehberi.",
    url: absoluteUrl("/"),
  },
};

const POPULAR_SLUGS = [
  "istanbul",
  "ankara",
  "izmir",
  "antalya",
  "bursa",
  "konya",
  "adana",
  "gaziantep",
  "trabzon",
  "kayseri",
  "ardahan",
  "diyarbakir",
];

export default async function HomePage() {
  const cities = await listCitiesRemote();
  const popular =
    cities.length > 0
      ? POPULAR_SLUGS.map((slug) => cities.find((c) => c.slug === slug)).filter(
          (c): c is NonNullable<typeof c> => Boolean(c),
        )
      : [];

  return (
    <div className="relative flex-1 overflow-hidden">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          inLanguage: "tr-TR",
          description:
            "Türkiye genelinde şehir ve ilçe bazlı 15 günlük hava durumu ile mevsimsel rehber.",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,_#7dd3fc_0%,_transparent_55%),radial-gradient(ellipse_at_80%_20%,_#86efac_0%,_transparent_40%)] opacity-70"
      />

      <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-16">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            15gunlukhavadurumu
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            15 Günlük Hava Durumu ve Mevsimsel Rehber
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Şehir veya ilçe adını yazın; 15 günlük tahmin ve mevsime uygun tarla
            önerilerine anında ulaşın.
          </p>
        </header>

        <LocationSearch />

        {popular.length > 0 ? (
          <section aria-labelledby="popular-cities" className="space-y-4">
            <h2
              id="popular-cities"
              className="text-center text-sm font-semibold uppercase tracking-[0.14em] text-slate-500"
            >
              Popüler şehirler
            </h2>
            <ul className="flex flex-wrap justify-center gap-2">
              {popular.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={city.href}
                    className="inline-flex rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <AdSlot id="home-top-ad" label="Ana sayfa reklam alanı" size="banner" />

        <ApiviceBanner />
      </main>
    </div>
  );
}
