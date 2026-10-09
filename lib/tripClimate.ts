import { fetchFifteenDayForecast, weatherCodeToTurkish } from "@/lib/open-meteo";

/** Complete calendar years used as the climate baseline. */
export const CLIMATE_RANGE_LABEL = "2016–2025";
const HISTORY_START = "2016-01-01";
const HISTORY_END = "2025-12-31";
const RAIN_MM = 1;
export const MAX_TRIP_DAYS = 16;
const MAX_LEAD_DAYS = 540;

const MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
] as const;

interface ArchiveDaily {
  time: string[];
  temperature_2m_max?: (number | null)[];
  temperature_2m_min?: (number | null)[];
  precipitation_sum?: (number | null)[];
  weather_code?: (number | null)[];
}

interface DaySample {
  high: number;
  low: number;
  precip: number;
  code: number;
}

export interface MonthClimate {
  month: number;
  label: string;
  high: number;
  low: number;
  rainChance: number;
}

export interface TripDayOutlook {
  date: string;
  label: string;
  high: number;
  low: number;
  rainChance: number;
  condition: string;
  weatherCode: number;
  sampleYears: number;
  note: string;
  forecast: {
    high: number;
    low: number;
    rainChance: number;
    condition: string;
  } | null;
}

export interface TripOutlook {
  start: string;
  end: string;
  rangeLabel: string;
  summary: string;
  packing: string[];
  days: TripDayOutlook[];
  usesForecast: boolean;
}

export function istanbulToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addIsoDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function defaultTripDates(now = new Date()): { start: string; end: string } {
  const today = istanbulToday(now);
  return { start: addIsoDays(today, 30), end: addIsoDays(today, 34) };
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function readParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export function parseTripRange(
  startRaw: string | string[] | undefined,
  endRaw: string | string[] | undefined,
  now = new Date(),
):
  | { ok: true; empty: true }
  | { ok: true; empty: false; start: string; end: string; dates: string[] }
  | { ok: false; message: string } {
  const start = readParam(startRaw);
  const end = readParam(endRaw);
  if (!start && !end) return { ok: true, empty: true };
  if (!start || !end || !isIsoDate(start) || !isIsoDate(end)) {
    return { ok: false, message: "Başlangıç ve bitiş için geçerli bir tarih seçin." };
  }
  if (end < start) {
    return { ok: false, message: "Bitiş tarihi başlangıçtan önce olamaz." };
  }

  const today = istanbulToday(now);
  const latest = addIsoDays(today, MAX_LEAD_DAYS);
  if (start < today) {
    return {
      ok: false,
      message: "Plan bugünden itibaren bir tarih aralığı kullanır.",
    };
  }
  if (end > latest) {
    return {
      ok: false,
      message: "En fazla 18 ay sonrasına kadar bir gezi planlanabilir.",
    };
  }

  const dates: string[] = [];
  let cursor = start;
  while (cursor <= end) {
    dates.push(cursor);
    if (dates.length > MAX_TRIP_DAYS) {
      return {
        ok: false,
        message: `Bir planda en fazla ${MAX_TRIP_DAYS} gün seçebilirsiniz.`,
      };
    }
    cursor = addIsoDays(cursor, 1);
  }

  return { ok: true, empty: false, start, end, dates };
}

function monthDay(iso: string): string {
  return iso.slice(5);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function modeCode(codes: number[]): number {
  const counts = new Map<number, number>();
  for (const code of codes) counts.set(code, (counts.get(code) ?? 0) + 1);
  let best = 1;
  let bestCount = -1;
  for (const [code, count] of counts) {
    if (count > bestCount) {
      best = code;
      bestCount = count;
    }
  }
  return best;
}

function indexSamples(daily: ArchiveDaily): Map<string, DaySample[]> {
  const samples = new Map<string, DaySample[]>();
  daily.time.forEach((date, index) => {
    const high = daily.temperature_2m_max?.[index];
    const low = daily.temperature_2m_min?.[index];
    const precip = daily.precipitation_sum?.[index];
    const code = daily.weather_code?.[index];
    if (
      high == null ||
      low == null ||
      precip == null ||
      code == null ||
      !Number.isFinite(high) ||
      !Number.isFinite(low)
    ) {
      return;
    }
    const key = monthDay(date);
    const bucket = samples.get(key) ?? [];
    bucket.push({ high, low, precip, code });
    samples.set(key, bucket);
  });
  return samples;
}

async function fetchArchiveDaily(
  lat: number,
  lng: number,
): Promise<ArchiveDaily | null> {
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lng.toFixed(4),
    start_date: HISTORY_START,
    end_date: HISTORY_END,
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "weather_code",
    ].join(","),
    timezone: "Europe/Istanbul",
  });

  try {
    const response = await fetch(
      `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`,
      { next: { revalidate: 60 * 60 * 24 * 7 } },
    );
    if (!response.ok) {
      console.error("Open-Meteo archive HTTP error:", response.status);
      return null;
    }
    const data = (await response.json()) as { daily?: ArchiveDaily; error?: boolean };
    if (!data.daily?.time?.length || data.error) return null;
    return data.daily;
  } catch (error) {
    console.error("Open-Meteo archive fetch failed:", error);
    return null;
  }
}

export async function fetchMonthlyClimate(
  lat: number,
  lng: number,
): Promise<MonthClimate[] | null> {
  const daily = await fetchArchiveDaily(lat, lng);
  if (!daily) return null;

  const byMonth = new Map<number, DaySample[]>();
  daily.time.forEach((date, index) => {
    const high = daily.temperature_2m_max?.[index];
    const low = daily.temperature_2m_min?.[index];
    const precip = daily.precipitation_sum?.[index];
    const code = daily.weather_code?.[index];
    if (high == null || low == null || precip == null || code == null) return;
    const month = Number(date.slice(5, 7));
    const bucket = byMonth.get(month) ?? [];
    bucket.push({ high, low, precip, code });
    byMonth.set(month, bucket);
  });

  return MONTHS.map((label, index) => {
    const month = index + 1;
    const samples = byMonth.get(month) ?? [];
    const rainy = samples.filter((sample) => sample.precip >= RAIN_MM).length;
    return {
      month,
      label,
      high: Math.round(average(samples.map((sample) => sample.high))),
      low: Math.round(average(samples.map((sample) => sample.low))),
      rainChance:
        samples.length === 0 ? 0 : Math.round((rainy / samples.length) * 100),
    };
  });
}

function formatDayLabel(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("tr-TR", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
}

export function formatTripRange(start: string, end: string): string {
  const startDate = new Date(`${start}T12:00:00`);
  const endDate = new Date(`${end}T12:00:00`);
  const sameMonth = start.slice(0, 7) === end.slice(0, 7);
  if (start === end) {
    return startDate.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  if (sameMonth) {
    return `${startDate.toLocaleDateString("tr-TR", { day: "numeric" })}–${endDate.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}`;
  }
  const startLabel = startDate.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
  });
  const endLabel = endDate.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${startLabel} – ${endLabel}`;
}

function dayNote(high: number, low: number, rainChance: number, code: number): string {
  if (code >= 71 && code <= 86) return "Kar görülen yıllar var; kaygan zemin ve kalın giysi düşünün.";
  if (code >= 95) return "Bazı yıllarda gök gürültülü yağış olmuş.";
  if (rainChance >= 50) return "Yağışlı geçen yıllar çoğunlukta; ıslanmaya göre plan yapın.";
  if (rainChance >= 30) return "Yağmur ihtimali belirgin; şemsiye yer açın.";
  if (high >= 32) return "Öğleden sonra sıcak geçer; gölge ve su molası işe yarar.";
  if (low <= 0) return "Gece don civarı; sabah erken çıkışlarda katmanlı giyinin.";
  if (high <= 12) return "Serin bir gün; dışarıda ince bir mont yeterli olmayabilir.";
  if (high >= 24 && rainChance < 25) return "Açık ve ılık görünüyor; yürüyüş için elverişli yıllar çoğunlukta.";
  return "Günler arasında fark olur; bu rakam tipik bir günü anlatır.";
}

function buildPacking(days: TripDayOutlook[]): string[] {
  const items: string[] = [];
  const rain = Math.max(...days.map((day) => day.rainChance));
  const high = Math.max(...days.map((day) => day.high));
  const low = Math.min(...days.map((day) => day.low));
  const snow = days.some((day) => day.weatherCode >= 71 && day.weatherCode <= 86);
  if (high >= 28) items.push("İnce kıyafet, şapka ve güneş kremi");
  else if (high >= 20) items.push("Katman yapılabilen rahat kıyafet");
  if (low <= 8) items.push("Akşam için hırka veya mont");
  if (low <= 0 || snow) items.push("Bere, eldiven ve kaymaz ayakkabı");
  if (rain >= 40) items.push("Yağmurluk veya şemsiye");
  else if (rain >= 25) items.push("Katlanabilir şemsiye");
  if (items.length === 0) items.push("Günün sıcaklığına göre ince bir üst");
  return items;
}

export async function buildTripOutlook(
  lat: number,
  lng: number,
  dates: string[],
  placeName: string,
): Promise<TripOutlook | null> {
  const daily = await fetchArchiveDaily(lat, lng);
  if (!daily || dates.length === 0) return null;
  const samples = indexSamples(daily);
  const forecast = await fetchFifteenDayForecast(lat, lng);
  const forecastByDate = new Map(forecast?.days.map((day) => [day.date, day]) ?? []);

  const days: TripDayOutlook[] = dates.map((date) => {
    const bucket = samples.get(monthDay(date)) ?? [];
    const rainy = bucket.filter((sample) => sample.precip >= RAIN_MM).length;
    const rainChance =
      bucket.length === 0 ? 0 : Math.round((rainy / bucket.length) * 100);
    const code = bucket.length ? modeCode(bucket.map((sample) => sample.code)) : 1;
    const high = Math.round(average(bucket.map((sample) => sample.high)));
    const low = Math.round(average(bucket.map((sample) => sample.low)));
    const live = forecastByDate.get(date);
    return {
      date,
      label: formatDayLabel(date),
      high,
      low,
      rainChance,
      condition: weatherCodeToTurkish(code),
      weatherCode: code,
      sampleYears: bucket.length,
      note: dayNote(high, low, rainChance, code),
      forecast: live
        ? {
            high: live.high,
            low: live.low,
            rainChance: live.precipitationChance,
            condition: live.condition,
          }
        : null,
    };
  });

  const usesForecast = days.some((day) => day.forecast);
  const meanHigh = Math.round(average(days.map((day) => day.high)));
  const meanLow = Math.round(average(days.map((day) => day.low)));
  const meanRain = Math.round(average(days.map((day) => day.rainChance)));
  const rangeLabel = formatTripRange(dates[0], dates[dates.length - 1]);
  const forecastSentence = usesForecast
    ? " Aralığın 15 gün içine giren günlerinde güncel tahmin de yazılır; o günler için planı güncel tahmine göre kurun."
    : " Bu aralık 15 günlük tahminin dışında olduğu için rakamlar geçmiş yılların aynı günlerinden gelir.";

  return {
    start: dates[0],
    end: dates[dates.length - 1],
    rangeLabel,
    summary: `${placeName} için ${rangeLabel} döneminde ${CLIMATE_RANGE_LABEL} ortalaması gündüz ${meanHigh}°, gece ${meanLow}° ve yağışlı gün ihtimali yaklaşık %${meanRain}.${forecastSentence} Bu bir garanti değil; aynı takvim günü yıllar arasında değişir.`,
    packing: buildPacking(days),
    days,
    usesForecast,
  };
}
