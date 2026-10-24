import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ApiviceBanner from "@/components/ApiviceBanner";
import JsonLd from "@/components/JsonLd";
import HomeSpotlight from "@/components/HomeSpotlight";
import LocationSearch from "@/components/LocationSearch";
import { listCitiesRemote } from "@/lib/locationService";
import { SITE_NAME, SITE_URL, absoluteUrl, adsenseSlotFor } from "@/lib/site";

export const metadata: Metadata = {
  title: "15 Günlük Hava Durumu",
  description:
    "Şehir ve ilçe bazında 15 günlük hava durumu.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "15 Günlük Hava Durumu",
    description: "Şehir ve ilçe bazında 15 günlük hava durumu.",
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
  const featured = new Set([
    "istanbul",
    "ankara",
    "izmir",
    "antalya",
    "trabzon",
    "bursa",
  ]);
  const popular =
    cities.length > 0
      ? POPULAR_SLUGS.filter((slug) => !featured.has(slug))
          .map((slug) => cities.find((c) => c.slug === slug))
          .filter((c): c is NonNullable<typeof c> => Boolean(c))
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
            "Türkiye genelinde şehir ve ilçe bazlı 15 günlük hava durumu.",
        }}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-sky-700 via-sky-500 to-cyan-400 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 top-8 h-56 w-56 rounded-full bg-white/15 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-100">
            15 gün · il ve ilçe
          </p>
          <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">
            15 günlük
            <span className="block">hava durumu</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-sky-50 sm:text-lg">
            Şehri veya ilçeyi yaz. Önümüzdeki 15 günün gündüzünü, gecesini ve
            yağışını tek ekranda gör.
          </p>
        </div>
      </section>

      <main className="relative mx-auto -mt-14 flex w-full max-w-5xl flex-col gap-10 px-4 pb-16 sm:px-6">
        <div className="rounded-3xl border border-white/70 bg-white/95 p-3 shadow-2xl shadow-sky-900/10 backdrop-blur sm:p-4">
          <LocationSearch prominent />
        </div>

        <HomeSpotlight />

        {popular.length > 0 ? (
          <section aria-labelledby="popular-cities" className="space-y-4">
            <h2
              id="popular-cities"
              className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500"
            >
              Diğer şehirler
            </h2>
            <ul className="flex flex-wrap gap-2">
              {popular.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={city.href}
                    className="inline-flex rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <AdSlot
          id="home-top-ad"
          slot={adsenseSlotFor("banner")}
          size="banner"
        />

        <ApiviceBanner />
      </main>
    </div>
  );
}
