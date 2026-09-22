import type { DayForecast } from "@/components/WeatherCard";
import {
  getPrimarySeason,
  getSeasonTags,
  type WeatherContext,
} from "@/lib/adviceEngine";

interface OpenMeteoDailyResponse {
  daily?: {
    time: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: (number | null)[];
    wind_speed_10m_max?: (number | null)[];
    relative_humidity_2m_mean?: (number | null)[];
    relative_humidity_2m_max?: (number | null)[];
  };
  error?: boolean;
  reason?: string;
}

interface OpenMeteoCurrentResponse {
  elevation?: number;
  current?: {
    temperature_2m?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    weather_code?: number;
  };
  error?: boolean;
  reason?: string;
}

export function weatherCodeToTurkish(code: number): string {
  if (code === 0) return "Açık";
  if (code === 1) return "Çoğunlukla açık";
  if (code === 2) return "Parçalı bulutlu";
  if (code === 3) return "Bulutlu";
  if (code === 45 || code === 48) return "Sisli";
  if (code === 51 || code === 53 || code === 55) return "Çiseleme";
  if (code === 56 || code === 57) return "Dondurucu çiseleme";
  if (code === 61 || code === 63) return "Hafif yağmur";
  if (code === 65) return "Şiddetli yağmur";
  if (code === 66 || code === 67) return "Dondurucu yağmur";
  if (code === 71 || code === 73) return "Hafif kar";
  if (code === 75 || code === 77) return "Yoğun kar";
  if (code === 80 || code === 81) return "Sağanak";
  if (code === 82) return "Şiddetli sağanak";
  if (code === 85 || code === 86) return "Kar sağanağı";
  if (code === 95) return "Gök gürültülü fırtına";
  if (code === 96 || code === 99) return "Dolu ile fırtına";
  return "Değişken";
}

function weatherCodeToCondition(code: number): string {
  if (code === 0) return "clear";
  if (code === 1 || code === 2) return "partly_cloudy";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 85 && code <= 86) return "snow";
  if (code >= 95) return "storm";
  return "unknown";
}

function dayLabel(dateIso: string, index: number): string {
  if (index === 0) return "Bugün";
  if (index === 1) return "Yarın";
  const date = new Date(`${dateIso}T12:00:00`);
  return date.toLocaleDateString("tr-TR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function round(value: number | null | undefined, fallback = 0): number {
  if (value == null || !Number.isFinite(value)) return fallback;
  return Math.round(value);
}

/**
 * Open-Meteo 15 günlük günlük tahmin → UI DayForecast listesi.
 */
export async function fetchFifteenDayForecast(
  lat: number,
  lng: number,
): Promise<{ days: DayForecast[]; fetchedAt: string } | null> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "relative_humidity_2m_mean",
    ].join(","),
    timezone: "Europe/Istanbul",
    forecast_days: "16",
  });

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      { next: { revalidate: 1800 } },
    );

    if (!response.ok) {
      console.error("Open-Meteo HTTP error:", response.status);
      return null;
    }

    const data = (await response.json()) as OpenMeteoDailyResponse;
    const daily = data.daily;

    if (!daily?.time?.length || data.error) {
      console.error("Open-Meteo invalid payload:", data.reason ?? data);
      return null;
    }

    const days: DayForecast[] = daily.time.slice(0, 15).map((date, index) => {
      const code = daily.weather_code?.[index] ?? 0;
      const humidity =
        daily.relative_humidity_2m_mean?.[index] ??
        daily.relative_humidity_2m_max?.[index] ??
        50;

      return {
        date,
        label: dayLabel(date, index),
        condition: weatherCodeToTurkish(code),
        weatherCode: code,
        high: round(daily.temperature_2m_max?.[index]),
        low: round(daily.temperature_2m_min?.[index]),
        precipitationChance: round(
          daily.precipitation_probability_max?.[index],
          0,
        ),
        windKph: round(daily.wind_speed_10m_max?.[index], 0),
        humidity: round(humidity, 50),
      };
    });

    if (days.length === 0) return null;

    return {
      days,
      fetchedAt: new Date().toLocaleString("tr-TR"),
    };
  } catch (error) {
    console.error("Open-Meteo fetch failed:", error);
    return null;
  }
}

/**
 * Anlık hava → tavsiye motoru WeatherContext.
 * Edge Function yerine doğrudan Open-Meteo.
 */
export async function fetchWeatherContext(
  lat: number,
  lng: number,
  elevationOverride?: number,
): Promise<WeatherContext | null> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "wind_speed_10m",
      "weather_code",
    ].join(","),
    timezone: "Europe/Istanbul",
  });

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      { next: { revalidate: 1800 } },
    );

    if (!response.ok) {
      console.error("Open-Meteo context HTTP error:", response.status);
      return null;
    }

    const data = (await response.json()) as OpenMeteoCurrentResponse;
    if (!data.current || data.error) {
      console.error("Open-Meteo context invalid:", data.reason ?? data);
      return null;
    }

    const code = Number(data.current.weather_code ?? NaN);
    const elevation =
      elevationOverride != null && Number.isFinite(elevationOverride)
        ? elevationOverride
        : Number(data.elevation ?? 0);

    return {
      temp: Number(data.current.temperature_2m ?? 0),
      condition: Number.isFinite(code)
        ? weatherCodeToCondition(code)
        : "unknown",
      wind_speed: Number(data.current.wind_speed_10m ?? 0),
      humidity: Number(data.current.relative_humidity_2m ?? 50),
      season: getPrimarySeason(),
      season_tags: getSeasonTags(),
      moon_phase: "full_moon",
      elevation,
    };
  } catch (error) {
    console.error("Open-Meteo context fetch failed:", error);
    return null;
  }
}
