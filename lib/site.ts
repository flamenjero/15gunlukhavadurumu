/** Canonical site origin — SEO, sitemap, Open Graph */
export const SITE_URL = "https://15gunlukhavadurumu.org";
export const SITE_NAME = "15 Günlük Hava Durumu";

/** Google AdSense publisher ID */
export const ADSENSE_CLIENT_ID = "ca-pub-1920068982660179";

export type AdSenseSize = "banner" | "rectangle" | "leaderboard" | "skyscraper";

/**
 * Numeric ad unit ids from the AdSense dashboard.
 * Auto ads work from the site script alone. These fill the reserved boxes
 * once a unit is created and the matching env var is set at build time.
 */
const ADSENSE_SLOT_BY_SIZE: Record<AdSenseSize, string | undefined> = {
  banner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER,
  leaderboard: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD,
  rectangle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE,
  skyscraper: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SKYSCRAPER,
};

export function adsenseSlotFor(size: AdSenseSize): string | null {
  const specific = ADSENSE_SLOT_BY_SIZE[size]?.trim();
  if (specific) return specific;
  const shared = process.env.NEXT_PUBLIC_ADSENSE_SLOT?.trim();
  return shared || null;
}

/** Public contact address shown on the contact and privacy pages */
export const CONTACT_EMAIL = "iletisim@15gunlukhavadurumu.org";

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
