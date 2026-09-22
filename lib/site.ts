/** Canonical site origin — SEO, sitemap, Open Graph */
export const SITE_URL = "https://15gunlukhavadurumu.org";
export const SITE_NAME = "15 Günlük Hava Durumu";

/** Google AdSense publisher ID */
export const ADSENSE_CLIENT_ID = "ca-pub-1920068982660179";

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
