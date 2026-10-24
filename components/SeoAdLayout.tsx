import type { ReactNode } from "react";
import AdSlot from "@/components/AdSlot";
import ApiviceBanner, {
  type ApiviceBannerProps,
} from "@/components/ApiviceBanner";
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
