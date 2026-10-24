import type { Metadata } from "next";
import TripPlanScreen, {
  tripQueryIsIndexable,
  tripRangeLabel,
} from "@/components/TripPlanScreen";
import { findLocationRemote } from "@/lib/locationService";
import { absoluteUrl } from "@/lib/site";
import { slugToTitle } from "@/lib/slug";

interface TripDistrictPageProps {
  params: Promise<{ city: string; district: string }>;
  searchParams: Promise<{
    baslangic?: string | string[];
    bitis?: string | string[];
  }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: TripDistrictPageProps): Promise<Metadata> {
  const { city, district } = await params;
  const query = await searchParams;
  const place = await findLocationRemote(city, district);
  const cityName = place?.cityName ?? slugToTitle(city);
  const districtName = place?.districtName ?? slugToTitle(district);
  const placeTitle = `${districtName}, ${cityName}`;
  const rangeLabel = tripRangeLabel(query.baslangic, query.bitis);
  const title = rangeLabel
    ? `${placeTitle} ${rangeLabel} hava beklentisi`
    : `${placeTitle} tatil ve gezi hava durumu`;
  const description = `${placeTitle} için seçtiğiniz tarihlerde beklenen sıcaklık ve yağış ihtimali. Rakamlar 2016–2025 aynı günlerinin ortalamasıdır; 15 gün içindeki tarihlerde güncel tahmin de gösterilir.`;
  const path = `/gezi-plani/${city}/${district}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: tripQueryIsIndexable(query.baslangic, query.bitis)
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      locale: "tr_TR",
    },
  };
}

export default async function TripDistrictPage({
  params,
  searchParams,
}: TripDistrictPageProps) {
  const { city, district } = await params;
  const place = await findLocationRemote(city, district);
  const cityName = place?.cityName ?? slugToTitle(city);
  const districtName = place?.districtName ?? slugToTitle(district);

  return (
    <TripPlanScreen
      place={place}
      placeTitle={`${districtName}, ${cityName}`}
      forecastHref={`/${city}/${district}`}
      searchParams={searchParams}
      level="district"
      intro={`${districtName} (${cityName}) için tatil, yolculuk veya kısa bir kaçamak planlıyorsanız gidiş ve dönüş tarihini seçin. Motor bu ilçenin koordinatında 2016–2025 yıllarının aynı günlerini karşılaştırır.`}
    />
  );
}
