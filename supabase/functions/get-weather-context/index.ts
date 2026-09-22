import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

/**
 * Opsiyonel Edge Function — uygulama artık Next.js üzerinden Open-Meteo kullanır.
 * Deploy edersen CORS + OPTIONS destekler.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { lat, lng, elevation: elevationOverride } = body;

    if (lat == null || lng == null) {
      return new Response(
        JSON.stringify({
          error: "Enlem (lat) ve Boylam (lng) parametreleri eksik.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Europe%2FIstanbul`,
    );
    const weather = await weatherRes.json();

    if (!weather?.current) {
      return new Response(
        JSON.stringify({ error: "Open-Meteo yanıtı geçersiz." }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const date = new Date();
    const month = date.getMonth() + 1;
    let season = "winter";
    /** @type {string[]} */
    let season_tags = ["winter"];

    if (month === 3) {
      season = "spring";
      season_tags = ["spring", "early_spring"];
    } else if (month === 4) {
      season = "spring";
      season_tags = ["spring"];
    } else if (month === 5) {
      season = "spring";
      season_tags = ["spring", "late_spring"];
    } else if (month === 6) {
      season = "summer";
      season_tags = ["summer", "early_summer"];
    } else if (month === 7) {
      season = "summer";
      season_tags = ["summer"];
    } else if (month === 8) {
      season = "summer";
      season_tags = ["summer", "late_summer"];
    } else if (month === 9) {
      season = "autumn";
      season_tags = ["autumn", "early_autumn"];
    } else if (month === 10) {
      season = "autumn";
      season_tags = ["autumn"];
    } else if (month === 11) {
      season = "autumn";
      season_tags = ["autumn", "late_autumn"];
    }

    const weatherCode = Number(weather.current.weather_code ?? NaN);
    const resolvedElevation =
      elevationOverride != null && Number.isFinite(Number(elevationOverride))
        ? Number(elevationOverride)
        : Number(weather.elevation ?? 0);

    const context = {
      temp: weather.current.temperature_2m,
      humidity: weather.current.relative_humidity_2m,
      wind_speed: weather.current.wind_speed_10m,
      elevation: resolvedElevation,
      lat: Number(lat),
      lng: Number(lng),
      season,
      season_tags,
      condition: Number.isFinite(weatherCode)
        ? weatherCodeToCondition(weatherCode)
        : "unknown",
      moon_phase: "full_moon",
    };

    return new Response(JSON.stringify(context), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (_error) {
    return new Response(
      JSON.stringify({ error: "Hava durumu alınırken bir hata oluştu." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
