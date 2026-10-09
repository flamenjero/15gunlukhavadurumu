import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SeoAdLayout from "@/components/SeoAdLayout";
import { findLocationRemote } from "@/lib/locationService";
import { fetchFifteenDayForecast } from "@/lib/open-meteo";
import { absoluteUrl } from "@/lib/site";
import { slugToTitle } from "@/lib/slug";

interface DistrictPageProps {
  params: Promise<{ city: string; district: string }>;
}

export async function generateMetadata({
  params,
}: DistrictPageProps): Promise<Metadata> {
  const { city, district } = await params;
  const place = await findLocationRemote(city, district);
  const cityName = place?.cityName ?? slugToTitle(city);
  const districtName = place?.districtName ?? slugToTitle(district);
  const path = `/${city}/${district}`;
  const title = `${districtName} / ${cityName} 15 Günlük Hava Durumu`;
  const description = `${districtName} / ${cityName} için detaylı 15 günlük hava tahmini ve mevsimsel rehber.`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description: `${districtName} ilçesi (${cityName}) yerel hava durumu ve mevsimsel rehber.`,
      url: absoluteUrl(path),
      type: "website",
      locale: "tr_TR",
    },
  };
}

export default async function DistrictPage({ params }: DistrictPageProps) {
  const { city, district } = await params;
  const place = await findLocationRemote(city, district);
  const cityName = place?.cityName ?? slugToTitle(city);
  const districtName = place?.districtName ?? slugToTitle(district);
  const now = new Date();
  const monthLabel = now.toLocaleDateString("tr-TR", {
    month: "long",
    year: "numeric",
  });

  const forecast =
    place != null
      ? await fetchFifteenDayForecast(place.lat, place.lng)
      : null;
  const days = forecast?.days ?? [];
  const today = days[0] ?? null;

  const title = `${districtName} / ${cityName} 15 Günlük Hava Durumu`;
  const locationName = `${districtName} / ${cityName}`;
  const pageUrl = absoluteUrl(`/${city}/${district}`);
  const cityUrl = absoluteUrl(`/${city}`);

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            url: pageUrl,
            inLanguage: "tr-TR",
            description: `${districtName} / ${cityName} için 15 günlük yerel tahmin ve mevsimsel rehber.`,
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
                item: cityUrl,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: districtName,
                item: pageUrl,
              },
            ],
          },
        ]}
      />
      <SeoAdLayout
        adPrefix={`district-${city}-${district}`}
        breadcrumb={
          <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-sky-700">
                  Ana sayfa
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={`/${city}`} className="hover:text-sky-700">
                  {cityName}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-slate-800">{districtName}</li>
            </ol>
          </nav>
        }
        title={title}
        description={`${districtName} / ${cityName} için 15 günlük yerel tahmin ve ${monthLabel} mevsimsel rehberi.`}
        locationName={locationName}
        today={today}
        days={days}
        updatedAt={forecast?.fetchedAt ?? now.toLocaleString("tr-TR")}
        todaySubtitle={
          place
            ? `${place.label} · ${place.lat.toFixed(3)}, ${place.lng.toFixed(3)} · Open-Meteo`
            : "İlçe ölçeğinde anlık özet"
        }
        monthLabel={monthLabel}
        lat={place?.lat}
        lng={place?.lng}
        elevation={place && place.elevation > 0 ? place.elevation : undefined}
        agriSummary={`${districtName} / ${cityName} mikroiklimi ve rakımına göre filtrelenmiş tarımsal öneriler.`}
        planHref={`/gezi-plani/${city}/${district}`}
        planPlace={`${districtName}, ${cityName}`}
        apivice={{
          message: `Arıcı mısınız? ${districtName} (${cityName}) kovanlarınızı yapay zeka ve sesli asistanla yönetmek için Apivice’ı indirin`,
        }}
      />
    </>
  );
}
