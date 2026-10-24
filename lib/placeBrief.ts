import type { DayForecast } from "@/components/WeatherCard";
import type { WeatherContext } from "@/lib/adviceEngine";
import { CLIMATE_RANGE_LABEL } from "@/lib/tripClimate";
import type { AgriculturalTipConditions } from "@/types/supabase";

export interface BriefDay {
  label: string;
  condition: string;
  high: number;
  low: number;
  precipitationChance: number;
}

export interface BriefTip {
  title: string;
  content: string;
  conditions: AgriculturalTipConditions;
}

export interface PlaceBriefInput {
  placeName: string;
  monthLabel: string;
  days: BriefDay[];
  elevation?: number;
  monthClimate?: { high: number; low: number; rainChance: number } | null;
  farming?: BriefTip | null;
  beekeeping?: BriefTip | null;
  weather?: Pick<
    WeatherContext,
    "temp" | "humidity" | "wind_speed" | "elevation" | "season"
  > | null;
}

const SEASON_TR: Record<WeatherContext["season"], string> = {
  spring: "ilkbahar",
  summer: "yaz",
  autumn: "sonbahar",
  winter: "kış",
};

function modeCondition(days: BriefDay[]): string {
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

export function explainTipSelection(
  conditions: AgriculturalTipConditions,
  weather: NonNullable<PlaceBriefInput["weather"]>,
): string {
  const parts: string[] = [];
  if (conditions.season) parts.push(`dönem ${SEASON_TR[weather.season]}`);
  if (conditions.min_temp != null || conditions.max_temp != null) {
    parts.push(`sıcaklık ${Math.round(weather.temp)}°`);
  }
  if (conditions.min_elevation != null || conditions.max_elevation != null) {
    parts.push(`rakım ${Math.round(weather.elevation)} m`);
  }
  if (
    conditions.min_wind_speed != null ||
    conditions.max_wind_speed != null ||
    conditions.wind_max_kph != null
  ) {
    parts.push(`rüzgar ${Math.round(weather.wind_speed)} km/s`);
  }
  if (conditions.min_humidity != null || conditions.max_humidity != null) {
    parts.push(`nem %${Math.round(weather.humidity)}`);
  }
  if (conditions.condition) parts.push("bugünkü hava tipi");
  if (parts.length === 0) {
    return `güncel ölçüm ${Math.round(weather.temp)}°, nem %${Math.round(weather.humidity)}, rüzgar ${Math.round(weather.wind_speed)} km/s`;
  }
  return parts.join(", ");
}

function tipParagraph(
  kind: string,
  tip: BriefTip,
  weather: PlaceBriefInput["weather"],
): string {
  const reason = weather
    ? explainTipSelection(tip.conditions, weather)
    : "bu yerin takvimi ve hava özeti";
  return `${kind} notu “${tip.title}”. ${tip.content} Bu not seçildi çünkü ${reason}.`;
}

/** Aynı girdi her zaman aynı metni üretir. Rastgele cümle yok. */
export function buildPlaceBrief(input: PlaceBriefInput): string[] {
  const paragraphs: string[] = [];
  const { placeName, monthLabel, days, elevation, monthClimate } = input;

  if (monthClimate) {
    const elevationSentence =
      elevation != null && elevation > 0
        ? ` Rakım yaklaşık ${Math.round(elevation)} metre.`
        : "";
    paragraphs.push(
      `${placeName} için ${monthLabel} normali, ${CLIMATE_RANGE_LABEL} kayıtlarında gündüz ${monthClimate.high}°, gece ${monthClimate.low}° ve yağışlı gün oranı %${monthClimate.rainChance}.${elevationSentence}`,
    );
  } else if (elevation != null && elevation > 0) {
    paragraphs.push(
      `${placeName} yaklaşık ${Math.round(elevation)} metre rakımda.`,
    );
  }

  if (days.length > 0) {
    const hottest = days.reduce((best, day) => (day.high > best.high ? day : best));
    const coolest = days.reduce((best, day) => (day.low < best.low ? day : best));
    const rainy = days.filter((day) => day.precipitationChance >= 40).length;
    paragraphs.push(
      `${placeName} için önümüzdeki ${days.length} günde en sıcak gündüz ${hottest.label} ${hottest.high}°, en serin gece ${coolest.label} ${coolest.low}°. Yağış ihtimali %40 ve üzerinde olan ${rainy} gün var. En sık beklenen hal ${modeCondition(days)}.`,
    );
  }

  if (input.farming) {
    paragraphs.push(tipParagraph("Tarım", input.farming, input.weather));
  }
  if (input.beekeeping) {
    paragraphs.push(tipParagraph("Arıcılık", input.beekeeping, input.weather));
  }

  return paragraphs;
}

export function toBriefDays(days: DayForecast[]): BriefDay[] {
  return days.map((day) => ({
    label: day.label,
    condition: day.condition,
    high: day.high,
    low: day.low,
    precipitationChance: day.precipitationChance,
  }));
}
