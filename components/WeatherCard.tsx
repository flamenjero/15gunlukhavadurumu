export interface DayForecast {
  date: string;
  label: string;
  condition: string;
  /** Open-Meteo WMO weather code — ikon eşlemesi için */
  weatherCode?: number;
  high: number;
  low: number;
  precipitationChance: number;
  windKph: number;
  humidity: number;
}

export interface TodayWeatherPanelProps {
  locationName: string;
  day: DayForecast;
  updatedAt?: string;
  subtitle?: string;
}

export interface WeatherCardProps {
  day: DayForecast;
}

export type WeatherKind =
  | "clear"
  | "partly_cloudy"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

export function resolveWeatherKind(day: DayForecast): WeatherKind {
  const code = day.weatherCode;
  if (typeof code === "number") {
    if (code === 0 || code === 1) return "clear";
    if (code === 2) return "partly_cloudy";
    if (code === 3) return "cloudy";
    if (code === 45 || code === 48) return "fog";
    if (code >= 51 && code <= 57) return "drizzle";
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "snow";
    if (code >= 95) return "storm";
  }

  const lower = day.condition.toLocaleLowerCase("tr-TR");
  if (lower.includes("fırtına") || lower.includes("dolu")) return "storm";
  if (lower.includes("kar")) return "snow";
  if (
    lower.includes("yağmur") ||
    lower.includes("sağanak") ||
    lower.includes("çisele")
  ) {
    return lower.includes("çisele") ? "drizzle" : "rain";
  }
  if (lower.includes("sis")) return "fog";
  if (lower.includes("parçalı")) return "partly_cloudy";
  if (lower.includes("bulut")) return "cloudy";
  if (lower.includes("açık")) return "clear";
  return "partly_cloudy";
}

const CARD_THEMES: Record<
  WeatherKind,
  { card: string; iconWrap: string; icon: string; label: string }
> = {
  clear: {
    card: "from-amber-50 via-sky-50 to-orange-50 ring-amber-100/80",
    iconWrap: "bg-amber-100/80 text-amber-500",
    icon: "text-amber-500",
    label: "text-amber-800/70",
  },
  partly_cloudy: {
    card: "from-sky-50 via-white to-slate-50 ring-sky-100/80",
    iconWrap: "bg-sky-100/80 text-sky-500",
    icon: "text-sky-500",
    label: "text-sky-800/70",
  },
  cloudy: {
    card: "from-slate-100 via-slate-50 to-sky-50 ring-slate-200/80",
    iconWrap: "bg-slate-200/80 text-slate-500",
    icon: "text-slate-500",
    label: "text-slate-600",
  },
  fog: {
    card: "from-slate-100 via-gray-50 to-slate-100 ring-slate-200/70",
    iconWrap: "bg-slate-200/70 text-slate-400",
    icon: "text-slate-400",
    label: "text-slate-500",
  },
  drizzle: {
    card: "from-sky-100 via-cyan-50 to-slate-100 ring-cyan-100/80",
    iconWrap: "bg-cyan-100/80 text-cyan-600",
    icon: "text-cyan-600",
    label: "text-cyan-800/70",
  },
  rain: {
    card: "from-sky-200/80 via-slate-100 to-blue-100 ring-sky-200/80",
    iconWrap: "bg-sky-200/70 text-sky-700",
    icon: "text-sky-700",
    label: "text-sky-800/80",
  },
  snow: {
    card: "from-slate-50 via-sky-50 to-indigo-50 ring-indigo-100/70",
    iconWrap: "bg-indigo-100/70 text-indigo-400",
    icon: "text-indigo-400",
    label: "text-indigo-700/70",
  },
  storm: {
    card: "from-indigo-100 via-slate-200 to-violet-100 ring-indigo-200/80",
    iconWrap: "bg-indigo-200/80 text-indigo-700",
    icon: "text-indigo-700",
    label: "text-indigo-900/70",
  },
};

const HERO_THEMES: Record<WeatherKind, string> = {
  clear: "from-amber-400 via-orange-400 to-sky-400",
  partly_cloudy: "from-sky-400 via-sky-500 to-cyan-400",
  cloudy: "from-slate-400 via-slate-500 to-sky-500",
  fog: "from-slate-400 via-gray-400 to-slate-500",
  drizzle: "from-cyan-500 via-sky-500 to-slate-500",
  rain: "from-sky-600 via-blue-600 to-slate-600",
  snow: "from-sky-300 via-indigo-300 to-slate-400",
  storm: "from-indigo-700 via-violet-700 to-slate-800",
};

function WeatherIcon({
  kind,
  className = "h-10 w-10",
}: {
  kind: WeatherKind;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    className,
    "aria-hidden": true as const,
  };

  switch (kind) {
    case "clear":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.9" />
          <path
            strokeLinecap="round"
            d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"
          />
        </svg>
      );
    case "partly_cloudy":
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="3.2" fill="currentColor" opacity="0.85" />
          <path
            strokeLinecap="round"
            d="M9 3.5V5M4.5 9H3M5.2 5.2l1.1 1.1"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 16.5h8.5a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.5 1.5A3.2 3.2 0 0 0 8 16.5Z"
            fill="currentColor"
            opacity="0.35"
          />
        </svg>
      );
    case "cloudy":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 17h9a3.5 3.5 0 0 0 .5-7 5.5 5.5 0 0 0-10.6 1.8A3.5 3.5 0 0 0 7.5 17Z"
            fill="currentColor"
            opacity="0.4"
          />
        </svg>
      );
    case "fog":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            d="M4 10h16M5 13.5h14M6 17h12M7 7.5h10"
            opacity="0.85"
          />
        </svg>
      );
    case "drizzle":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 13h8.2a3 3 0 0 0 .4-6 4.5 4.5 0 0 0-8.6 1.3A2.8 2.8 0 0 0 7.5 13Z"
            fill="currentColor"
            opacity="0.35"
          />
          <path strokeLinecap="round" d="M9 16.5v2M12 16v3M15 16.5v2" />
        </svg>
      );
    case "rain":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 12.5h9a3.2 3.2 0 0 0 .4-6.4 5 5 0 0 0-9.6 1.6A3 3 0 0 0 7 12.5Z"
            fill="currentColor"
            opacity="0.35"
          />
          <path
            strokeLinecap="round"
            d="M8.5 15.5 7 19M12 15l-1.5 4M15.5 15.5 14 19"
          />
        </svg>
      );
    case "snow":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 12h9a3.2 3.2 0 0 0 .4-6.4 5 5 0 0 0-9.6 1.6A3 3 0 0 0 7 12Z"
            fill="currentColor"
            opacity="0.3"
          />
          <path
            strokeLinecap="round"
            d="M9 15.5h0M12 16.5h0M15 15.5h0M10.5 18.5h0M13.5 18h0"
            strokeWidth="2.4"
          />
        </svg>
      );
    case "storm":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 11.5h8.5a3 3 0 0 0 .4-6 4.8 4.8 0 0 0-9.2 1.5A2.8 2.8 0 0 0 7 11.5Z"
            fill="currentColor"
            opacity="0.35"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11 12.5-2 4.5h3L10.5 21"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      );
  }
}

/** Geniş, dikkat çekici bugünün özeti paneli */
export function TodayWeatherPanel({
  locationName,
  day,
  updatedAt,
  subtitle,
}: TodayWeatherPanelProps) {
  const kind = resolveWeatherKind(day);

  return (
    <section
      aria-labelledby="today-weather-heading"
      className={`overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br text-white shadow-[0_16px_40px_-20px_rgba(14,165,233,0.45)] ${HERO_THEMES[kind]}`}
    >
      <div className="px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm sm:h-20 sm:w-20">
              <WeatherIcon kind={kind} className="h-10 w-10 text-white sm:h-12 sm:w-12" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">Bugünün özeti</p>
              <h2
                id="today-weather-heading"
                className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                {locationName}
              </h2>
              {subtitle ? (
                <p className="mt-1 text-sm text-white/75">{subtitle}</p>
              ) : null}
              <p className="mt-3 text-lg font-medium text-white/95">
                {day.condition}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur-sm">
            <p className="text-sm text-white/80">{day.label}</p>
            <p className="mt-1 text-5xl font-semibold tabular-nums tracking-tight">
              {day.high}°
              <span className="ml-2 text-2xl font-normal text-white/80">
                / {day.low}°
              </span>
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/20 pt-5 text-sm">
          <div>
            <dt className="text-white/75">Yağış</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">
              %{day.precipitationChance}
            </dd>
          </div>
          <div>
            <dt className="text-white/75">Rüzgar</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">
              {day.windKph} km/s
            </dd>
          </div>
          <div>
            <dt className="text-white/75">Nem</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">
              %{day.humidity}
            </dd>
          </div>
        </dl>

        {updatedAt ? (
          <p className="mt-4 text-xs text-white/70">Güncelleme: {updatedAt}</p>
        ) : null}
      </div>
    </section>
  );
}

/** 15 günlük ızgara için tek günlük kart */
export default function WeatherCard({ day }: WeatherCardProps) {
  const kind = resolveWeatherKind(day);
  const theme = CARD_THEMES[kind];

  return (
    <article
      className={`flex h-full flex-col rounded-2xl bg-gradient-to-b p-4 ring-1 ${theme.card}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={`text-xs font-semibold uppercase tracking-wide ${theme.label}`}
        >
          {day.label}
        </p>
        <span
          className={`grid h-10 w-10 place-items-center rounded-xl ${theme.iconWrap}`}
          title={day.condition}
        >
          <WeatherIcon kind={kind} className={`h-6 w-6 ${theme.icon}`} />
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-slate-800">{day.condition}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">
        {day.high}°
        <span className="ml-1 text-base font-normal text-slate-500">
          {day.low}°
        </span>
      </p>
      <dl className="mt-auto space-y-1 pt-4 text-xs text-slate-600">
        <div className="flex justify-between gap-2">
          <dt>Yağış</dt>
          <dd className="tabular-nums">%{day.precipitationChance}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Rüzgar</dt>
          <dd className="tabular-nums">{day.windKph} km/s</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Nem</dt>
          <dd className="tabular-nums">%{day.humidity}</dd>
        </div>
      </dl>
    </article>
  );
}
