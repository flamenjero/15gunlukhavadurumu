import ApiviceBanner, {
  type ApiviceBannerProps,
} from "@/components/ApiviceBanner";
import {
  evaluateConditions,
  rankTipsByCategory,
} from "@/lib/adviceEngine";
import { fetchWeatherContext } from "@/lib/open-meteo";
import { supabase } from "@/lib/supabaseClient";
import type { AgriculturalTip, Database } from "@/types/supabase";

/** Varsayılan: İstanbul merkez */
const DEFAULT_LAT = 41.0082;
const DEFAULT_LNG = 28.9784;

export interface AgriAdviceProps {
  locationName: string;
  monthLabel: string;
  summary?: string;
  apivice?: ApiviceBannerProps;
  lat?: number;
  lng?: number;
  /** Katalogdaki bilinen rakım — Open-Meteo yerine önceliklidir */
  elevation?: number;
}

type AgriculturalTipRow = Database["public"]["Tables"]["agricultural_tips"]["Row"];

async function fetchActiveTips(): Promise<AgriculturalTipRow[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("agricultural_tips")
      .select("*")
      .eq("is_active", true);

    if (error || !data) {
      console.error("agricultural_tips fetch failed:", error?.message);
      return [];
    }

    return data;
  } catch (err) {
    console.error("agricultural_tips fetch threw:", err);
    return [];
  }
}

function LeafIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 19c8 0 12-6 12-14-6 0-12 4-12 14Z"
      />
      <path strokeLinecap="round" d="M5 19c2-4 6-7 10-8" />
    </svg>
  );
}

function HiveIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 8h8M7 11h10M8 14h8M9 17h6"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4 5 8v2l7 4 7-4V8l-7-4Z"
      />
      <path strokeLinecap="round" d="M5 18h14" />
    </svg>
  );
}

function TipBody({
  tip,
  emptyMessage,
  tone,
}: {
  tip: AgriculturalTip | null;
  emptyMessage: string;
  tone: "green" | "amber";
}) {
  const titleClass = tone === "green" ? "text-green-950" : "text-amber-950";
  const bodyClass =
    tone === "green" ? "text-green-900/80" : "text-amber-900/80";
  const boxClass =
    tone === "green"
      ? "border-green-100 bg-white/70"
      : "border-amber-100 bg-white/70";

  if (!tip) {
    return (
      <div
        className={`flex min-h-[8rem] flex-1 items-center rounded-xl border border-dashed p-4 ${boxClass}`}
      >
        <p className={`text-sm leading-relaxed ${bodyClass}`}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`flex min-h-[8rem] flex-1 flex-col rounded-xl border p-4 ${boxClass}`}>
      <h4 className={`text-base font-semibold ${titleClass}`}>{tip.title}</h4>
      <p className={`mt-2 text-sm leading-relaxed ${bodyClass}`}>
        {tip.content}
      </p>
    </div>
  );
}

export default async function AgriAdvice({
  locationName,
  monthLabel,
  summary,
  apivice,
  lat = DEFAULT_LAT,
  lng = DEFAULT_LNG,
  elevation,
}: AgriAdviceProps) {
  const [weatherContext, tips] = await Promise.all([
    fetchWeatherContext(lat, lng, elevation),
    fetchActiveTips(),
  ]);

  const matched =
    weatherContext == null
      ? []
      : tips.filter((tip) =>
          evaluateConditions(tip.conditions, weatherContext),
        );

  const tarimTip = rankTipsByCategory(matched, "tarim")[0] ?? null;
  const aricilikTip = rankTipsByCategory(matched, "aricilik")[0] ?? null;

  const contextFailed = weatherContext == null;
  const tarimEmpty = contextFailed
    ? "Hava durumu verisine şu an ulaşılamıyor. Tarım uyarısı birazdan yenilenecek."
    : "Şu an için bölgenize özel güncel tarım uyarısı bulunmamaktadır.";
  const aricilikEmpty = contextFailed
    ? "Hava durumu verisine şu an ulaşılamıyor. Arıcılık uyarısı birazdan yenilenecek."
    : "Şu an için bölgenize özel güncel arıcılık uyarısı bulunmamaktadır.";

  return (
    <section aria-labelledby="agri-heading" className="space-y-4">
      <header>
        <p className="text-sm font-medium text-slate-500">
          Mevsimsel rehber · {monthLabel}
        </p>
        <h2
          id="agri-heading"
          className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl"
        >
          {locationName} için tarım ve arıcılık önerileri
        </h2>
        {summary ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            {summary}
          </p>
        ) : null}
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-stretch">
        <article className="flex min-h-[22rem] flex-col rounded-2xl border border-green-200 bg-green-50 p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-green-100 text-green-700 ring-1 ring-green-200">
              <LeafIcon />
            </span>
            <div>
              <h3 className="font-semibold text-green-950">
                Bitkisel üretim &amp; bahçe
              </h3>
              <p className="text-xs text-green-800/70">
                Rüzgar · don · ekim-dikim
              </p>
            </div>
          </div>
          <TipBody tip={tarimTip} emptyMessage={tarimEmpty} tone="green" />
        </article>

        <article className="flex min-h-[22rem] flex-col rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-800 ring-1 ring-amber-200">
              <HiveIcon />
            </span>
            <div>
              <h3 className="font-semibold text-amber-950">Arıcılık takvimi</h3>
              <p className="text-xs text-amber-800/70">
                Sıcaklık · nektar akışı
              </p>
            </div>
          </div>

          <TipBody
            tip={aricilikTip}
            emptyMessage={aricilikEmpty}
            tone="amber"
          />

          <div className="mt-auto pt-4">
            <ApiviceBanner {...apivice} />
          </div>
        </article>
      </div>
    </section>
  );
}
