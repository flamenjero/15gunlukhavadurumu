import type { Metadata } from "next";
import Link from "next/link";
import PlaceCalendar from "@/components/PlaceCalendar";
import { findCityCenterRemote } from "@/lib/locationService";
import { absoluteUrl } from "@/lib/site";
import { slugToTitle } from "@/lib/slug";

const FALLBACK_CENTERS: Record<string, { name: string; lat: number; lng: number }> = {
  istanbul: { name: "İstanbul", lat: 41.0136, lng: 28.955 },
  ankara: { name: "Ankara", lat: 39.9208, lng: 32.8541 },
  izmir: { name: "İzmir", lat: 38.4237, lng: 27.1428 },
  antalya: { name: "Antalya", lat: 36.8969, lng: 30.7133 },
  mugla: { name: "Muğla", lat: 37.2153, lng: 28.3636 },
  trabzon: { name: "Trabzon", lat: 41.0027, lng: 39.7168 },
  nevsehir: { name: "Nevşehir", lat: 38.6244, lng: 34.7239 },
  bursa: { name: "Bursa", lat: 40.195, lng: 29.06 },
};

interface MonthCityPageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({
  params,
}: MonthCityPageProps): Promise<Metadata> {
  const { city } = await params;
  const center = await findCityCenterRemote(city);
  const cityName = center?.cityName ?? FALLBACK_CENTERS[city]?.name ?? slugToTitle(city);
  const title = `${cityName} ay takvimi`;
  const description = `${cityName} için on iki ayın gündüz, gece ve yağışlı gün ortalaması. 2016–2025.`;
  const path = `/ay-takvimi/${city}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      locale: "tr_TR",
    },
  };
}

export default async function MonthCityPage({ params }: MonthCityPageProps) {
  const { city } = await params;
  const center = await findCityCenterRemote(city);
  const fallback = FALLBACK_CENTERS[city];
  const cityName = center?.cityName ?? fallback?.name ?? slugToTitle(city);
  const lat = center?.lat ?? fallback?.lat;
  const lng = center?.lng ?? fallback?.lng;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-stone-900">
              Ana sayfa
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/ay-takvimi" className="hover:text-stone-900">
              Ay takvimi
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-stone-800">{cityName}</li>
        </ol>
      </nav>

      <div className="mt-8">
        {lat != null && lng != null ? (
          <PlaceCalendar placeName={cityName} lat={lat} lng={lng} heading="h1" />
        ) : (
          <p className="text-sm text-stone-600">
            Bu il için ay takvimi şu an hazır değil.
          </p>
        )}
      </div>

      <p className="mt-10 text-sm text-stone-600">
        <Link href={`/${city}`} className="font-semibold text-stone-900 hover:text-stone-600">
          {cityName} 15 günlük hava durumu
        </Link>
        <span aria-hidden> · </span>
        <Link
          href={`/gezi-plani/${city}`}
          className="font-semibold text-stone-900 hover:text-stone-600"
        >
          Gezi planı
        </Link>
      </p>
    </main>
  );
}
