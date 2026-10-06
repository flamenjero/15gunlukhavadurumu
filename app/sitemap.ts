import type { MetadataRoute } from "next";
import { listSitemapEntriesRemote } from "@/lib/locationService";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const { cities, districts } = await listSitemapEntriesRemote();

  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...["/hakkinda", "/iletisim", "/gizlilik-politikasi", "/gezi-plani"].map(
      (path) => ({
        url: absoluteUrl(path),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: path === "/gezi-plani" ? 0.9 : 0.4,
      }),
    ),
    ...cities.map((citySlug) => ({
      url: absoluteUrl(`/gezi-plani/${citySlug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...cities.map((citySlug) => ({
      url: absoluteUrl(`/${citySlug}`),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...districts.map(({ citySlug, districtSlug }) => ({
      url: absoluteUrl(`/${citySlug}/${districtSlug}`),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];

  return entries;
}
