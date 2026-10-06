import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import TripPlanForm from "@/components/TripPlanForm";
import type { LocationPlace } from "@/lib/locationService";
import { absoluteUrl } from "@/lib/site";
import {
  CLIMATE_RANGE_LABEL,
  addIsoDays,
  buildTripOutlook,
  defaultTripDates,
  fetchMonthlyClimate,
  formatTripRange,
  istanbulToday,
  parseTripRange,
  type MonthClimate,
  type TripOutlook,
} from "@/lib/tripClimate";

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TripPlanScreen({
  place,
  placeTitle,
  forecastHref,
  searchParams,
  intro,
  popular,
  level = "district",
}: {
  place: LocationPlace | null;
  placeTitle: string;
  forecastHref: string | null;
  searchParams: Promise<{
    baslangic?: string | string[];
    bitis?: string | string[];
  }>;
  intro: string;
  popular?: Array<{ name: string; slug: string }>;
  level?: "hub" | "city" | "district";
}) {
  const query = await searchParams;
  const range = parseTripRange(query.baslangic, query.bitis);
  const defaults = defaultTripDates();
  const today = istanbulToday();
  const maxDate = addIsoDays(today, 540);
  const monthly =
    place != null ? await fetchMonthlyClimate(place.lat, place.lng) : null;
  const outlook =
    place != null && range.ok && !range.empty
      ? await buildTripOutlook(place.lat, place.lng, range.dates, placeTitle)
      : null;
  const pagePath = place
    ? `/gezi-plani/${place.citySlug}/${place.districtSlug}`
    : "/gezi-plani";

  return (
    <div className="relative flex-1">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: place
              ? `${placeTitle} tatil ve gezi hava durumu`
              : "Tatil ve gezi hava durumu",
            applicationCategory: "TravelApplication",
            operatingSystem: "Web",
            url: absoluteUrl(pagePath),
            inLanguage: "tr-TR",
            description: intro,
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq(placeTitle).map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_#7dd3fc_0%,_transparent_60%)] opacity-70"
      />
      <main className="relative mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-sky-700">
                Ana sayfa
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              {place ? (
                <Link href="/gezi-plani" className="hover:text-sky-700">
                  Gezi planı
                </Link>
              ) : (
                <span className="font-medium text-slate-800">Gezi planı</span>
              )}
            </li>
            {place && level !== "hub" ? (
              <>
                <li aria-hidden>/</li>
                {level === "district" ? (
                  <li>
                    <Link
                      href={`/gezi-plani/${place.citySlug}`}
                      className="hover:text-sky-700"
                    >
                      {place.cityName}
                    </Link>
                  </li>
                ) : (
                  <li className="font-medium text-slate-800">{place.cityName}</li>
                )}
                {level === "district" ? (
                  <>
                    <li aria-hidden>/</li>
                    <li className="font-medium text-slate-800">
                      {place.districtName}
                    </li>
                  </>
                ) : null}
              </>
            ) : null}
          </ol>
        </nav>

        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-700">
            Geçmiş yıllara göre
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {placeTitle
              ? `${placeTitle} tatil ve gezi hava durumu`
              : "Tatil ve gezi hava durumu"}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">{intro}</p>
        </header>

        <TripPlanForm
          place={
            place
              ? {
                  label: place.label,
                  cityName: place.cityName,
                  districtName: place.districtName,
                  citySlug: place.citySlug,
                  districtSlug: place.districtSlug,
                }
              : null
          }
          start={range.ok && !range.empty ? range.start : defaults.start}
          end={range.ok && !range.empty ? range.end : defaults.end}
          minDate={today}
          maxDate={maxDate}
        />

        {!range.ok ? (
          <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {range.message}
          </p>
        ) : null}

        {placeTitle && !place ? (
          <p className="rounded-2xl border border-dashed border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
            Bu adres için kayıtlı bir ilçe bulunamadı. Listeden yer seçerek
            yeniden arayın.
          </p>
        ) : null}

        {range.ok && !range.empty && place && !outlook ? (
          <p className="rounded-2xl border border-dashed border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
            Bu yer için geçmiş hava verisi şu an alınamadı. Kısa süre sonra
            yeniden deneyin.
          </p>
        ) : null}

        {outlook ? <TripResult outlook={outlook} placeTitle={placeTitle} /> : null}

        {monthly ? (
          <MonthTable months={monthly} placeTitle={placeTitle} />
        ) : null}

        {forecastHref ? (
          <p className="text-sm text-slate-600">
            Önümüzdeki günlerin ayrıntılı tahmini için{" "}
            <Link href={forecastHref} className="font-semibold text-sky-700 hover:text-sky-800">
              {placeTitle} 15 günlük hava durumu
            </Link>{" "}
            sayfasına bakın.
          </p>
        ) : null}

        {popular && popular.length > 0 ? (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Şehir şehir gezi havası
            </h2>
            <ul className="flex flex-wrap gap-2">
              {popular.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/gezi-plani/${city.slug}`}
                    className="inline-flex rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-sky-300 hover:text-sky-800"
                  >
                    {city.name} tatil hava durumu
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Sık sorulanlar</h2>
          <div className="space-y-3">
            {faq(placeTitle).map((item) => (
              <details
                key={item.question}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <summary className="cursor-pointer font-medium text-slate-900">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function TripResult({
  outlook,
  placeTitle,
}: {
  outlook: TripOutlook;
  placeTitle: string;
}) {
  return (
    <section aria-labelledby="trip-result" className="space-y-4">
      <h2 id="trip-result" className="text-xl font-semibold text-slate-900">
        {placeTitle} · {outlook.rangeLabel}
      </h2>
      <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
        {outlook.summary}
      </p>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3">
        <h3 className="text-sm font-semibold text-emerald-950">Yanınıza almanız iyi olur</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-950">
          {outlook.packing.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <ol className="space-y-3">
        {outlook.days.map((day) => (
          <li
            key={day.date}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900">{day.label}</p>
                <p className="text-sm text-slate-600">
                  Tipik görünüm: {day.condition}
                </p>
              </div>
              <p className="text-lg font-semibold text-slate-900">
                {day.low}° <span className="text-slate-400">/</span> {day.high}°
              </p>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {CLIMATE_RANGE_LABEL} aynı günlerinde yağış ihtimali %{day.rainChance}.{" "}
              {day.sampleYears} yılın ortalaması. {day.note}
            </p>
            {day.forecast ? (
              <p className="mt-2 rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-950">
                15 günlük tahmin: {day.forecast.condition}, {day.forecast.low}° /{" "}
                {day.forecast.high}°, yağış %{day.forecast.rainChance}. Bu tarih
                yakın olduğu için planı bu tahmine göre kurun.
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                Bu gün henüz 15 günlük tahminde yok; rakam geçmiş yıllardandır.
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

function MonthTable({
  months,
  placeTitle,
}: {
  months: MonthClimate[];
  placeTitle: string;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-900">
        {placeTitle} aylara göre tipik hava
      </h2>
      <p className="text-sm text-slate-600">
        {CLIMATE_RANGE_LABEL} günlük kayıtlarının ay ortalaması. Tatil ayı
        seçerken yağış sütununa bakın.
      </p>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <caption className="sr-only">
            {placeTitle} için {CLIMATE_RANGE_LABEL} aylık sıcaklık ve yağış ihtimali
          </caption>
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Ay</th>
              <th scope="col" className="px-4 py-3 font-medium">Gündüz</th>
              <th scope="col" className="px-4 py-3 font-medium">Gece</th>
              <th scope="col" className="px-4 py-3 font-medium">Yağışlı gün</th>
            </tr>
          </thead>
          <tbody>
            {months.map((month) => (
              <tr key={month.month} className="border-t border-slate-100">
                <th scope="row" className="px-4 py-2.5 font-medium text-slate-800">
                  {month.label}
                </th>
                <td className="px-4 py-2.5">{month.high}°</td>
                <td className="px-4 py-2.5">{month.low}°</td>
                <td className="px-4 py-2.5">%{month.rainChance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function faq(placeTitle: string) {
  const where = placeTitle || "seçtiğiniz yer";
  return [
    {
      question: `${where} için seçtiğim tarih kesin hava durumu mudur?`,
      answer:
        "Hayır. 15 günden uzak tarihlerde sayfa, 2016–2025 arasındaki aynı takvim günlerinin sıcaklık ve yağış ortalamasını gösterir. Yıllar birbirinden farklı geçebilir.",
    },
    {
      question: "Yakın bir tarih seçersem ne değişir?",
      answer:
        "Tarih önümüzdeki 15 günün içindeyse, geçmiş ortalama güncel Open-Meteo tahmininin yanında durur. O kısa aralıkta güncel tahmini esas alın.",
    },
    {
      question: "Konumum isteniyor mu?",
      answer:
        "Hayır. Yalnızca seçtiğiniz il veya ilçenin koordinatı kullanılır. Tarayıcı konumuna bakılmaz.",
    },
    {
      question: "Kaç gün seçebilirim?",
      answer: "Bir gezi planı en fazla 16 gün olabilir ve bugünden itibaren 18 ayı kapsar.",
    },
  ];
}

export function tripQueryIsIndexable(
  baslangic: string | string[] | undefined,
  bitis: string | string[] | undefined,
): boolean {
  return !firstParam(baslangic) && !firstParam(bitis);
}

export function tripRangeLabel(
  baslangic: string | string[] | undefined,
  bitis: string | string[] | undefined,
): string | null {
  const range = parseTripRange(baslangic, bitis);
  if (!range.ok || range.empty) return null;
  return formatTripRange(range.start, range.end);
}
