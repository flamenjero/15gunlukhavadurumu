"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT_ID } from "@/lib/site";

export type AdSlotSize = "banner" | "rectangle" | "leaderboard" | "skyscraper";

export interface AdSlotProps {
  id: string;
  /** Numeric AdSense ad unit id. Nothing is rendered when this is empty. */
  slot?: string | null;
  size?: AdSlotSize;
  className?: string;
}

const sizeClasses: Record<AdSlotSize, string> = {
  banner: "min-h-[90px] min-w-full w-full sm:min-h-[100px]",
  leaderboard: "min-h-[90px] min-w-full w-full sm:min-h-[120px]",
  rectangle: "min-h-[250px] min-w-full w-full sm:min-h-[280px]",
  skyscraper: "min-h-[600px] min-w-[160px] w-full max-w-[160px]",
};

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export default function AdSlot({
  id,
  slot,
  size = "banner",
  className = "",
}: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const ins = insRef.current;
    if (!slot || !ins || ins.dataset.adsbygoogleStatus) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // The ad script can be blocked; the reserved box stays empty.
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <aside id={id} aria-label="Reklam" className={className}>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Reklam
      </p>
      <ins
        ref={insRef}
        className={`adsbygoogle block overflow-hidden ${sizeClasses[size]}`}
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
