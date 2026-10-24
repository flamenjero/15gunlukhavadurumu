import type { Metadata } from "next";
import TripPlanScreen from "@/components/TripPlanScreen";
import { listCitiesRemote } from "@/lib/locationService";
import { absoluteUrl } from "@/lib/site";

const title = "Tatil ve gezi hava durumu";
const description =
  "Gideceğiniz il veya ilçede seçtiğiniz tarihlerde havanın nasıl olabileceğini 2016–2025 verisiyle görün. Yakın günlerde 15 günlük tahmin de yanındadır.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/gezi-plani" },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/gezi-plani"),
    locale: "tr_TR",
  },
};

export default async function TripPlanHubPage() {
  const cities = await listCitiesRemote();
  const popularSlugs = [
    "istanbul",
    "ankara",
    "izmir",
    "antalya",
    "mugla",
    "aydin",
    "trabzon",
    "nevsehir",
  ];
  const fallback = [
    { name: "İstanbul", slug: "istanbul" },
    { name: "Ankara", slug: "ankara" },
    { name: "İzmir", slug: "izmir" },
    { name: "Antalya", slug: "antalya" },
    { name: "Muğla", slug: "mugla" },
    { name: "Aydın", slug: "aydin" },
    { name: "Trabzon", slug: "trabzon" },
    { name: "Nevşehir", slug: "nevsehir" },
  ];
  const popular = popularSlugs
    .map((slug) => cities.find((city) => city.slug === slug))
    .filter((city): city is NonNullable<typeof city> => Boolean(city))
    .map((city) => ({ name: city.name, slug: city.slug }));

  return (
    <TripPlanScreen
      place={null}
      placeTitle=""
      forecastHref={null}
      searchParams={Promise.resolve({})}
      intro="Tatil, düğün veya kısa bir gezi için tarih seçin. Motor, o yerde aynı takvim günlerinin son 10 yılda nasıl geçtiğine bakar ve çantanız için kısa bir not çıkarır. Bu, resmî bir meteoroloji uyarısı değildir."
      level="hub"
      popular={popular.length > 0 ? popular : fallback}
    />
  );
}
