/**
 * JSONB kural motoru — agricultural_tips.conditions ↔ anlık hava bağlamı.
 * Dizi sezon/ay fazı, rakım, rüzgar, nem kurallarını destekler.
 */

export type WeatherSeason = "spring" | "summer" | "autumn" | "winter";

/** Seed verisinde geçen alt-mevsim etiketleri dahil */
export type SeasonTag =
  | WeatherSeason
  | "early_spring"
  | "late_spring"
  | "early_summer"
  | "late_summer"
  | "early_autumn"
  | "late_autumn";

export interface WeatherContext {
  /** Anlık / ortalama sıcaklık (°C) */
  temp: number;
  /** Hava durumu kodu (örn. rain, clear, snow, cloudy) */
  condition: string;
  /** Rüzgar hızı (km/s) */
  wind_speed: number;
  /** Bağıl nem (%) */
  humidity: number;
  /** Ana mevsim */
  season: WeatherSeason;
  /**
   * Eşleştirme için genişletilmiş sezon etiketleri
   * örn. Ağustos → ["summer", "late_summer"]
   */
  season_tags: SeasonTag[];
  /** Ay fazı (örn. waxing_crescent, full_moon) */
  moon_phase: string;
  /** Lokasyon rakımı (metre) */
  elevation: number;
}

/** conditions JSONB — string veya string[] alanlar desteklenir */
export interface RuleConditions {
  min_temp?: number;
  max_temp?: number;
  condition?: string | string[];
  season?: string | string[];
  moon_phase?: string | string[];
  min_elevation?: number;
  max_elevation?: number;
  min_wind_speed?: number;
  max_wind_speed?: number;
  min_humidity?: number;
  max_humidity?: number;
  [key: string]: unknown;
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase("en-US");
}

function isPresent(value: unknown): boolean {
  return value !== undefined && value !== null && value !== "";
}

function toStringList(value: unknown): string[] {
  if (!isPresent(value)) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

/**
 * Ay numarasına göre ana mevsim + alt etiketler.
 * Seed'deki early_summer / late_summer vb. ile uyumlu.
 */
export function getSeasonTags(date: Date = new Date()): SeasonTag[] {
  const month = date.getMonth() + 1;

  switch (month) {
    case 3:
      return ["spring", "early_spring"];
    case 4:
      return ["spring"];
    case 5:
      return ["spring", "late_spring"];
    case 6:
      return ["summer", "early_summer"];
    case 7:
      return ["summer"];
    case 8:
      return ["summer", "late_summer"];
    case 9:
      return ["autumn", "early_autumn"];
    case 10:
      return ["autumn"];
    case 11:
      return ["autumn", "late_autumn"];
    default:
      return ["winter"];
  }
}

export function getPrimarySeason(date: Date = new Date()): WeatherSeason {
  const tags = getSeasonTags(date);
  const primary = tags.find(
    (tag): tag is WeatherSeason =>
      tag === "spring" ||
      tag === "summer" ||
      tag === "autumn" ||
      tag === "winter",
  );
  return primary ?? "winter";
}

function matchesAny(ruleValues: string[], contextValues: string[]): boolean {
  const ctx = new Set(contextValues.map(normalize));
  return ruleValues.some((value) => ctx.has(normalize(value)));
}

/**
 * Girilmiş olan tüm kurallar Context ile uyuşuyorsa true.
 * Tanımlı olmayan alanlar "geçer" sayılır (AND / soft-match).
 * season / moon_phase / condition dizi veya tekil olabilir.
 */
export function evaluateConditions(
  conditions: unknown,
  context: WeatherContext,
): boolean {
  if (conditions == null || typeof conditions !== "object") {
    return true;
  }

  const rules = conditions as RuleConditions;

  if (isPresent(rules.min_temp) && typeof rules.min_temp === "number") {
    if (context.temp < rules.min_temp) return false;
  }

  if (isPresent(rules.max_temp) && typeof rules.max_temp === "number") {
    if (context.temp > rules.max_temp) return false;
  }

  const conditionRules = toStringList(rules.condition);
  if (conditionRules.length > 0) {
    if (!matchesAny(conditionRules, [context.condition])) return false;
  }

  const seasonRules = toStringList(rules.season);
  if (seasonRules.length > 0) {
    const tags = [context.season, ...(context.season_tags ?? [])].map(String);
    if (!matchesAny(seasonRules, tags)) return false;
  }

  const moonRules = toStringList(rules.moon_phase);
  if (moonRules.length > 0) {
    if (!matchesAny(moonRules, [context.moon_phase])) return false;
  }

  if (
    isPresent(rules.min_elevation) &&
    typeof rules.min_elevation === "number"
  ) {
    if (context.elevation < rules.min_elevation) return false;
  }

  if (
    isPresent(rules.max_elevation) &&
    typeof rules.max_elevation === "number"
  ) {
    if (context.elevation > rules.max_elevation) return false;
  }

  if (
    isPresent(rules.min_wind_speed) &&
    typeof rules.min_wind_speed === "number"
  ) {
    if (context.wind_speed < rules.min_wind_speed) return false;
  }

  if (
    isPresent(rules.max_wind_speed) &&
    typeof rules.max_wind_speed === "number"
  ) {
    if (context.wind_speed > rules.max_wind_speed) return false;
  }

  if (isPresent(rules.min_humidity) && typeof rules.min_humidity === "number") {
    if (context.humidity < rules.min_humidity) return false;
  }

  if (isPresent(rules.max_humidity) && typeof rules.max_humidity === "number") {
    if (context.humidity > rules.max_humidity) return false;
  }

  return true;
}

/** Kategoriye göre ayır, priority desc sırala */
export function rankTipsByCategory<
  T extends { category: string; priority: number },
>(tips: T[], category: string): T[] {
  return tips
    .filter((tip) => tip.category === category)
    .sort((a, b) => b.priority - a.priority);
}

const SEASONS: WeatherSeason[] = ["spring", "summer", "autumn", "winter"];

function asFiniteNumber(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function asSeason(value: unknown): WeatherSeason | null {
  if (typeof value !== "string") return null;
  const normalized = normalize(value) as WeatherSeason;
  return SEASONS.includes(normalized) ? normalized : null;
}

/**
 * Edge Function / API payload → WeatherContext.
 * `{ ...fields }` veya `{ context: {...} }` / `{ data: {...} }` sarmalayıcılarını destekler.
 */
export function toWeatherContext(payload: unknown): WeatherContext | null {
  if (payload == null || typeof payload !== "object") return null;

  const root = payload as Record<string, unknown>;
  const nested =
    root.context && typeof root.context === "object"
      ? (root.context as Record<string, unknown>)
      : root.data && typeof root.data === "object"
        ? (root.data as Record<string, unknown>)
        : root;

  const temp = asFiniteNumber(nested.temp ?? nested.temperature);
  const wind_speed = asFiniteNumber(
    nested.wind_speed ?? nested.windSpeed ?? nested.wind,
  );
  const humidity =
    asFiniteNumber(
      nested.humidity ?? nested.relative_humidity ?? nested.humidity_2m,
    ) ?? 50;
  const elevation =
    asFiniteNumber(nested.elevation ?? nested.altitude ?? nested.rakim) ?? 0;
  const conditionRaw = nested.condition ?? nested.weather ?? "unknown";
  const moonRaw = nested.moon_phase ?? nested.moonPhase ?? "any";
  const season = asSeason(nested.season) ?? getPrimarySeason();

  let season_tags: SeasonTag[];
  if (Array.isArray(nested.season_tags) && nested.season_tags.length > 0) {
    season_tags = nested.season_tags.filter(
      (item): item is string => typeof item === "string",
    ) as SeasonTag[];
  } else {
    season_tags = getSeasonTags();
  }
  if (!season_tags.includes(season)) {
    season_tags = [season, ...season_tags];
  }

  if (
    temp == null ||
    wind_speed == null ||
    typeof conditionRaw !== "string" ||
    conditionRaw.trim() === "" ||
    typeof moonRaw !== "string" ||
    moonRaw.trim() === ""
  ) {
    return null;
  }

  return {
    temp,
    condition: String(conditionRaw).trim(),
    wind_speed,
    humidity,
    season,
    season_tags,
    moon_phase: String(moonRaw).trim(),
    elevation,
  };
}
