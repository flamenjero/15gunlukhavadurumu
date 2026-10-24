import type { Metadata } from "next";
import TripPlanScreen from "@/components/TripPlanScreen";
import { findCityCenterRemote } from "@/lib/locationService";
import { absoluteUrl } from "@/lib/site";
import { slugToTitle } from "@/lib/slug";

interface TripCityPageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({
  params,
}: TripCityPageProps): Promise<Metadata> {
  const { city } = await params;
  const center = await findCityCenterRemote(city);
  const cityName = center?.cityName ?? slugToTitle(city);
  const title = `${cityName} tatil ve gezi hava durumu`;
  const description = `${cityName} için seçtiğiniz tatil tarihlerinde havanın nasıl geçebileceğini 2016–2025 ortalamasıyla görün. Aylık sıcaklık ve yağış tablosu da bu sayfada.`;
  const path = `/gezi-plani/${city}`;

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

export default async function TripCityPage({ params }: TripCityPageProps) {
  const { city } = await params;
  const center = await findCityCenterRemote(city);
  const cityName = center?.cityName ?? slugToTitle(city);

  return (
    <TripPlanScreen
      place={center}
      placeTitle={cityName}
      forecastHref={`/${city}`}
      searchParams={Promise.resolve({})}
      level="city"
      intro={`${cityName} tarafında bir tatil veya gezi planlıyorsanız tarih aralığı seçin. Sayfa, ${cityName} merkezine yakın koordinatta 2016–2025 arasındaki aynı günlerin sıcaklık ve yağışına bakar. İlçe seçerseniz hesap o ilçeye göre yenilenir.`}
    />
  );
}
