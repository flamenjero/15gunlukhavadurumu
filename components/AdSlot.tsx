export type AdSlotSize = "banner" | "rectangle" | "leaderboard" | "skyscraper";

export interface AdSlotProps {
  id: string;
  label?: string;
  size?: AdSlotSize;
  className?: string;
}

/** Sabit rezerv boyutları — AdSense geç yüklense bile CLS üretmez */
const sizeClasses: Record<AdSlotSize, string> = {
  banner: "min-h-[90px] min-w-full w-full sm:min-h-[100px]",
  leaderboard: "min-h-[90px] min-w-full w-full sm:min-h-[120px]",
  rectangle: "min-h-[250px] min-w-full w-full sm:min-h-[280px]",
  skyscraper: "min-h-[600px] min-w-[160px] w-full max-w-[160px]",
};

export default function AdSlot({
  id,
  label = "Reklam alanı",
  size = "banner",
  className = "",
}: AdSlotProps) {
  return (
    <aside
      id={id}
      role="complementary"
      aria-label={label}
      aria-busy="true"
      className={`relative isolate flex overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-100 ${sizeClasses[size]} ${className}`}
    >
      {/* Skeleton: reklam yüklenene kadar alanı doldurur */}
      <div
        aria-hidden
        className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 via-slate-200/80 to-slate-100"
      />
      <div
        aria-hidden
        className="absolute inset-x-3 top-3 h-2 animate-pulse rounded-full bg-slate-300/70"
      />
      <div
        aria-hidden
        className="absolute inset-x-6 bottom-4 h-2 animate-pulse rounded-full bg-slate-300/50"
      />

      <div className="relative z-10 m-auto px-3 py-4 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Sponsored
        </p>
        <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
          {label}
        </p>
        <p className="mt-1 text-[10px] text-slate-400">
          min boyut rezervli · CLS korumalı
        </p>
      </div>
    </aside>
  );
}
