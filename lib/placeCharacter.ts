import type { DayForecast } from "@/components/WeatherCard";
import { CLIMATE_RANGE_LABEL, type MonthClimate } from "@/lib/tripClimate";

export type PlaceKind = "coast" | "inland" | "plateau";

export interface PlaceCharacterInput {
  placeName: string;
  elevation?: number | null;
  monthLabel: string;
  monthClimate?: Pick<MonthClimate, "high" | "low" | "rainChance"> | null;
  days: DayForecast[];
}

function knownElevation(elevation?: number | null): number | null {
  if (elevation == null || !Number.isFinite(elevation) || elevation <= 0) return null;
  return elevation;
}

/** Rakım ve bu ayın gece-gündüz farkı. Aynı girdi her zaman aynı kümeyi verir. */
export function classifyPlace(
  elevation: number | null | undefined,
  month: { high: number; low: number } | null | undefined,
): PlaceKind {
  const elev = knownElevation(elevation);
  if (elev != null && elev >= 1100) return "plateau";
  const gap = month ? month.high - month.low : null;
  if ((elev == null || elev < 400) && (gap == null || gap <= 12)) return "coast";
  return "inland";
}

function dayPhrase(label: string): string {
  if (label === "Bugün" || label === "Yarın") return label.toLocaleLowerCase("tr-TR");
  return label;
}

function modeCondition(days: DayForecast[]): string {
  const counts = new Map<string, number>();
  for (const day of days) {
    counts.set(day.condition, (counts.get(day.condition) ?? 0) + 1);
  }
  let best = days[0]?.condition ?? "Değişken";
  let bestCount = -1;
  for (const day of days) {
    const count = counts.get(day.condition) ?? 0;
    if (count > bestCount) {
      best = day.condition;
      bestCount = count;
    }
  }
  return best.toLocaleLowerCase("tr-TR");
}

function forecastFacts(days: DayForecast[]) {
  const hottest = days.reduce((best, day) => (day.high > best.high ? day : best));
  const coolest = days.reduce((best, day) => (day.low < best.low ? day : best));
  const rainy = days.filter((day) => day.precipitationChance >= 40).length;
  return { hottest, coolest, rainy, mode: modeCondition(days) };
}

function coastForecast(days: DayForecast[]): string {
  const { hottest, coolest, rainy, mode } = forecastFacts(days);
  return `Önümüzdeki 15 günde en sıcak öğle ${dayPhrase(hottest.label)}, ${hottest.high}°. En serin gece ${dayPhrase(coolest.label)}, ${coolest.low}°. Yağış ihtimali %40’ı geçen ${rainy} gün var. Günlerin çoğu ${mode}.`;
}

function inlandForecast(days: DayForecast[]): string {
  const { hottest, coolest, rainy, mode } = forecastFacts(days);
  return `Bu 15 günün en sıcak gündüzü ${dayPhrase(hottest.label)}, ${hottest.high}°. En soğuk gecesi ${dayPhrase(coolest.label)}, ${coolest.low}°. Yağışlı gün sayısı ${rainy}. Sık beklenen hal ${mode}.`;
}

function plateauForecast(days: DayForecast[]): string {
  const { hottest, coolest, rainy, mode } = forecastFacts(days);
  return `On beş günün en ılık gündüzü ${dayPhrase(hottest.label)} ${hottest.high}°, en sert gecesi ${dayPhrase(coolest.label)} ${coolest.low}°. %40 ve üzeri yağış beklenen ${rainy} gün var. Sık görülen hal ${mode}.`;
}

/** Kıyı, iç kesim ve yüksek plato farklı cümle kurar. Rastgele cümle yok. */
export function buildPlaceCharacter(input: PlaceCharacterInput): string[] {
  const { placeName, monthLabel, monthClimate, days } = input;
  const elevation = knownElevation(input.elevation);
  const kind = classifyPlace(elevation, monthClimate);
  const paragraphs: string[] = [];

  if (monthClimate) {
    const { high, low, rainChance } = monthClimate;
    const gap = high - low;
    if (kind === "coast") {
      paragraphs.push(
        `${placeName} kıyısında ${monthLabel} gündüzleri ${high}° civarında seyreder, geceler ${low}° dolayında kalır. ${CLIMATE_RANGE_LABEL} kayıtlarında yağışlı gün oranı %${rainChance}. Deniz, gündüz ile geceyi birbirine yaklaştırır.`,
      );
    } else if (kind === "plateau" && elevation != null) {
      paragraphs.push(
        `${placeName} yaklaşık ${Math.round(elevation)} metre rakımda, yüksek platoda. ${monthLabel} geceleri ${low}°’ye iner; gündüz ${high}° olur. ${CLIMATE_RANGE_LABEL} boyunca yağışlı gün oranı %${rainChance}.`,
      );
    } else {
      paragraphs.push(
        `${placeName} iç kesimde. ${monthLabel} ayında gündüz ${high}°, gece ${low}°; aradaki fark ${gap} derece. ${CLIMATE_RANGE_LABEL} yağışlı gün oranı %${rainChance}.`,
      );
    }
  } else if (kind === "plateau" && elevation != null) {
    paragraphs.push(
      `${placeName} yaklaşık ${Math.round(elevation)} metre rakımda, yüksek platoda. Geceler gündüzden sert ayrılır.`,
    );
  } else if (kind === "inland") {
    paragraphs.push(
      `${placeName} iç kesimde. Gündüz ısınır, gece belirgin biçimde düşer.`,
    );
  } else {
    paragraphs.push(
      `${placeName} kıyı çizgisinde. Gündüz ile gece birbirine yakın kalır.`,
    );
  }

  if (days.length > 0) {
    if (kind === "coast") paragraphs.push(coastForecast(days));
    else if (kind === "plateau") paragraphs.push(plateauForecast(days));
    else paragraphs.push(inlandForecast(days));
  }

  return paragraphs;
}
