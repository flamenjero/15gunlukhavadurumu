import type { ReactNode } from "react";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import ApiviceBanner, {
  type ApiviceBannerProps,
} from "@/components/ApiviceBanner";
import PlaceCalendar from "@/components/PlaceCalendar";
import { adsenseSlotFor } from "@/lib/site";
import WeatherCard, {
  TodayWeatherPanel,
  type DayForecast,
} from "@/components/WeatherCard";

export interface SeoAdLayoutProps {
  breadcrumb: ReactNode;
  title: string;
  description: string;
  locationName: string;
  today: DayForecast | null;
  days: DayForecast[];
  updatedAt: string;
  todaySubtitle?: string;
  apivice?: ApiviceBannerProps;
  adPrefix: string;
  afterToday?: ReactNode;
  lat?: number;
  lng?: number;
  planHref?: string;
  planPlace?: string;
  narrative?: ReactNode;
  districts?: { name: string; href: string }[];
}

export default function SeoAdLayout({
  breadcrumb,
  title,
  description,
  locationName,
  today,
  days,
  updatedAt,
  todaySubtitle,
  apivice,
  adPrefix,
  afterToday,
  lat,
  lng,
  planHref,
  planPlace,
  narrative,
  districts,
}: SeoAdLayoutProps) {
  const forecastDays = days;
  const skyscraperSlot = adsenseSlotFor("skyscraper");
  const leaderboardSlot = adsenseSlotFor("leaderboard");
  const bannerSlot = adsenseSlotFor("banner");

  return (
    <div className="flex-1 bg-[linear-gradient(180deg,#f0f9ff_0%,#f8fafc_42%,#ecfdf5_100%)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6">{breadcrumb}</div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-6">
          {skyscraperSlot ? (
            <aside className="hidden lg:col-span-2 lg:block">
              <div className="sticky top-24">
                <AdSlot
                  id={`${adPrefix}-left-sky`}
                  slot={skyscraperSlot}
                  size="skyscraper"
                />
              </div>
            </aside>
          ) : null}

          <main
            className={`flex flex-col gap-6 ${skyscraperSlot ? "lg:col-span-8" : "lg:col-span-12"}`}
          >
            <AdSlot
              id={`${adPrefix}-top-banner`}
              slot={leaderboardSlot}
              size="leaderboard"
            />

            <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-sky-700 via-sky-500 to-cyan-400 px-5 py-7 text-white shadow-lg shadow-sky-900/15 sm:px-8 sm:py-9">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-100">
                15 günlük tahmin
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-sky-50 sm:text-base">
                {description}
              </p>
            </header>

            {today ? (
              <TodayWeatherPanel
                locationName={locationName}
                day={today}
                updatedAt={updatedAt}
                subtitle={todaySubtitle}
              />
            ) : (
              <div className="rounded-3xl border border-dashed border-sky-200 bg-sky-50/80 px-5 py-8 text-sm text-sky-900/80">
                Bu konum için Open-Meteo verisine şu an ulaşılamıyor. Lütfen kısa
                süre sonra yeniden deneyin.
              </div>
            )}

            <AdSlot
              id={`${adPrefix}-in-article`}
              slot={bannerSlot}
              size="banner"
            />

            {afterToday}

            <section aria-labelledby="forecast-heading" className="space-y-4">
              <h2
                id="forecast-heading"
                className="text-xl font-semibold tracking-tight text-slate-900"
              >
                15 günlük tahmin
              </h2>
              {forecastDays.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {forecastDays.map((day) => (
                    <WeatherCard key={day.date} day={day} />
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-sm text-slate-600">
                  15 günlük tahmin listesi yüklenemedi.
                </p>
              )}
            </section>

            {narrative}

            {planHref && planPlace ? (
              <Link
                href={planHref}
                className="group block rounded-3xl border border-stone-200 bg-stone-50 px-6 py-7 transition hover:border-stone-400 hover:bg-white sm:px-8"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                  Tatil
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                  {planPlace} gezi planı
                </p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-600">
                  Tarih seçin. Aynı günlerin 2016–2025 ortalaması, çanta notuyla
                  birlikte durur.
                </p>
                <p className="mt-5 text-sm font-semibold text-stone-900">
                  Planı aç
                  <span className="ml-2 inline-block transition group-hover:translate-x-0.5">
                    →
                  </span>
                </p>
              </Link>
            ) : null}

            {lat != null && lng != null ? (
              <div className="rounded-3xl border border-stone-200 bg-stone-50 px-4 py-6 sm:px-6 sm:py-8">
                <PlaceCalendar placeName={locationName} lat={lat} lng={lng} />
              </div>
            ) : null}

            {districts && districts.length > 0 ? (
              <section aria-labelledby="district-list" className="space-y-3">
                <h2
                  id="district-list"
                  className="text-sm font-semibold uppercase tracking-[0.14em] text-stone-500"
                >
                  İlçeler
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {districts.map((district) => (
                    <li key={district.href}>
                      <Link
                        href={district.href}
                        className="inline-flex rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
                      >
                        {district.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <ApiviceBanner {...apivice} />

            <AdSlot
              id={`${adPrefix}-bottom-banner`}
              slot={leaderboardSlot}
              size="leaderboard"
            />
          </main>

          {skyscraperSlot ? (
            <aside className="hidden lg:col-span-2 lg:block">
              <div className="sticky top-24">
                <AdSlot
                  id={`${adPrefix}-right-sky`}
                  slot={skyscraperSlot}
                  size="skyscraper"
                />
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}
