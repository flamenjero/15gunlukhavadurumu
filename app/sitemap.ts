import type { MetadataRoute } from "next";
import { listSitemapEntriesRemote } from "@/lib/locationService";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const { cities } = await listSitemapEntriesRemote();

  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...[
      "/hakkinda",
      "/iletisim",
      "/gizlilik-politikasi",
      "/gezi-plani",
      "/ay-takvimi",
      "/15-gunluk-tahmin-nasil-okunur",
      "/tatil-haftasi-nasil-secilir",
    ].map(
      (path) => ({
        url: absoluteUrl(path),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority:
          path === "/gezi-plani" || path === "/ay-takvimi"
            ? 0.8
            : path === "/15-gunluk-tahmin-nasil-okunur" || path === "/tatil-haftasi-nasil-secilir"
              ? 0.6
              : 0.4,
      }),
    ),
    ...cities.map((citySlug) => ({
      url: absoluteUrl(`/gezi-plani/${citySlug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...cities.map((citySlug) => ({
      url: absoluteUrl(`/ay-takvimi/${citySlug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...cities.map((citySlug) => ({
      url: absoluteUrl(`/${citySlug}`),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];

  return entries;
}
