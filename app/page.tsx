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

        <section aria-labelledby="guides" className="grid gap-4 md:grid-cols-2">
          <h2 id="guides" className="sr-only">
            Gezi planı ve ay takvimi
          </h2>
          <Link
            href="/gezi-plani"
            className="group rounded-3xl border border-stone-200 bg-stone-50 px-6 py-8 transition hover:border-stone-400 hover:bg-white sm:px-8"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
              Tatil
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">
              Gezi planı
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-600">
              Gideceğiniz günleri seçin. O yerde aynı günler son on yılda nasıl
              geçmiş, burada durur.
            </p>
            <p className="mt-6 text-sm font-semibold text-stone-900">
              Planı aç →
            </p>
          </Link>
          <Link
            href="/ay-takvimi"
            className="group rounded-3xl border border-stone-900 bg-stone-900 px-6 py-8 text-stone-50 transition hover:bg-stone-800 sm:px-8"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
              Yıl boyu
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              Ay takvimi
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-300">
              On iki ayın gündüzü, gecesi ve yağışlı gün oranı. İl seçin, yılı
              görün.
            </p>
            <p className="mt-6 text-sm font-semibold text-white">Takvimi aç →</p>
          </Link>
        </section>

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
