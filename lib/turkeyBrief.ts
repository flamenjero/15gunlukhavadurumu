import { addIsoDays, istanbulToday } from "@/lib/tripClimate";

export interface TurkeyBriefDay {
  date: string;
  high: number;
  precipitationChance: number;
}

export interface TurkeyBriefCity {
  name: string;
  region: string;
  today: { high: number; precipitationChance: number } | null;
  days: TurkeyBriefDay[];
}

function weekday(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** İçinde bulunulan veya bir sonraki cumartesi-pazar. Pazar günü yalnızca bugün. */
export function weekendIsoDates(todayIso: string): string[] {
  const day = weekday(todayIso);
  if (day === 0) return [todayIso];
  if (day === 6) return [todayIso, addIsoDays(todayIso, 1)];
  const saturday = addIsoDays(todayIso, 6 - day);
  return [saturday, addIsoDays(saturday, 1)];
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} ve ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} ve ${names[names.length - 1]}`;
}

/**
 * Altı ilin bugünkü tahmininden sabit bir Türkiye özeti.
 * Aynı sayılar her zaman aynı cümleleri üretir.
 */
export function buildTurkeyBrief(
  cities: TurkeyBriefCity[],
  todayIso = istanbulToday(),
): string[] | null {
  const withToday = cities.filter((city) => city.today != null);
  if (withToday.length === 0) return null;

  const warmest = withToday.reduce((best, city) =>
    city.today!.high > best.today!.high ? city : best,
  );
  const warmestHigh = warmest.today!.high;
  const tied = withToday.filter((city) => city.today!.high === warmestHigh);
  const rainy = withToday.filter((city) => city.today!.precipitationChance >= 40);
  const regions = [...new Set(rainy.map((city) => city.region))];

  const paragraphs = [
    tied.length === 1
      ? `Bugün en sıcak bölge ${warmest.region}: ${warmest.name} ${warmestHigh}°.`
      : `Bugün en sıcak yerler ${joinNames(tied.map((city) => city.name))}, ${warmestHigh}°.`,
    rainy.length === 0
      ? "Bugün bu illerde yağış ihtimali %40’ın altında."
      : `Yağış ${joinNames(regions)} tarafında: ${rainy
          .map((city) => `${city.name} %${city.today!.precipitationChance}`)
          .join(", ")}.`,
  ];

  if (weekday(todayIso) === 0) return paragraphs;

  const weekend = new Set(weekendIsoDates(todayIso));
  const weekendRows = cities.flatMap((city) => {
    const slice = city.days.filter((day) => weekend.has(day.date));
    if (slice.length === 0) return [];
    return [
      {
        name: city.name,
        high: Math.max(...slice.map((day) => day.high)),
        rain: Math.max(...slice.map((day) => day.precipitationChance)),
      },
    ];
  });
  if (weekendRows.length === 0) return paragraphs;

  const mild = weekendRows.reduce((best, row) => (row.high > best.high ? row : best));
  const wet = weekendRows.filter((row) => row.rain >= 40);
  const wettest = wet.reduce<(typeof weekendRows)[number] | null>(
    (best, row) => (best == null || row.rain > best.rain ? row : best),
    null,
  );

  paragraphs.push(
    wettest
      ? `Hafta sonu en ılık yer ${mild.name}, ${mild.high}°. Yağış ihtimali ${wettest.name} tarafında %${wettest.rain}.`
      : `Hafta sonu en ılık yer ${mild.name}, ${mild.high}°. Bu illerde hafta sonu yağış ihtimali %40’ın altında.`,
  );

  return paragraphs;
}
