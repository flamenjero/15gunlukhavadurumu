import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SeoAdLayout from "@/components/SeoAdLayout";
import { findCityCenterRemote } from "@/lib/locationService";
import { fetchFifteenDayForecast } from "@/lib/open-meteo";
import { absoluteUrl } from "@/lib/site";
import { slugToTitle } from "@/lib/slug";

interface CityPageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const center = await findCityCenterRemote(city);
  const cityName = center?.cityName ?? slugToTitle(city);
  const path = `/${city}`;
  const title = `${cityName} 15 Günlük Hava Durumu`;
  const description = `${cityName} için 15 günlük hava tahmini ve mevsimsel rehber.`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      type: "website",
      locale: "tr_TR",
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  const center = await findCityCenterRemote(city);
  const cityName = center?.cityName ?? slugToTitle(city);
  const now = new Date();
  const monthLabel = now.toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });

  const forecast =
    center != null
      ? await fetchFifteenDayForecast(center.lat, center.lng)
      : null;
  const days = forecast?.days ?? [];
  const today = days[0] ?? null;
  const pageUrl = absoluteUrl(`/${city}`);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${cityName} 15 Günlük Hava Durumu`,
            url: pageUrl,
            inLanguage: "tr-TR",
            description: `${cityName} için 15 günlük hava tahmini ve mevsimsel rehber.`,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Ana sayfa",
                item: absoluteUrl("/"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: cityName,
                item: pageUrl,
              },
            ],
          },
        ]}
      />
      <SeoAdLayout
        adPrefix={`city-${city}`}
        breadcrumb={
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-sky-700">
                  Ana sayfa
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-slate-800">{cityName}</li>
            </ol>
          </nav>
        }
        title={`${cityName} 15 Günlük Hava Durumu`}
        description={`${monthLabel} için yerel tahmin ve mevsimsel öneriler.`}
        locationName={cityName}
        today={today}
        days={days}
        updatedAt={forecast?.fetchedAt ?? now.toLocaleString("tr-TR")}
        todaySubtitle={
          center ? `${cityName} · Open-Meteo` : "Şehir geneli anlık özet"
        }
        monthLabel={monthLabel}
        lat={center?.lat}
        lng={center?.lng}
        elevation={center && center.elevation > 0 ? center.elevation : undefined}
        agriSummary={`${cityName} coğrafyası ve ${monthLabel} takvimine göre hazırlanmış tavsiyeler.`}
        apivice={{
          message: `Arıcı mısınız? ${cityName} kovanlarınızı yapay zeka ve sesli asistanla yönetmek için Apivice’ı indirin`,
        }}
      />
    </>
  );
}
