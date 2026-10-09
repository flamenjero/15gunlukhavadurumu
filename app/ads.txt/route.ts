import { ADSENSE_CLIENT_ID } from "@/lib/site";

/**
 * Served on both the apex and www hosts. AdSense treats a redirect
 * away from the registered host as "ads.txt not found".
 */
const ADS_TXT = `google.com, ${ADSENSE_CLIENT_ID.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`;

export const dynamic = "force-static";

export function GET() {
  return new Response(ADS_TXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
