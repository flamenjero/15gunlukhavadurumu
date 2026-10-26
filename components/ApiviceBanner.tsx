export interface ApiviceBannerProps {
  /** Soft-pitch metin; varsayılan arıcı CTA */
  message?: string;
  ctaLabel?: string;
  href?: string;
  className?: string;
}

/**
 * İnce soft-pitch CTA — AgriAdvice arılık sütununun altına gömülmek üzere tasarlandı.
 * Sabit min-height ile CLS üretmez.
 */
export default function ApiviceBanner({
  message = "Arıcı mısınız? Kovanlarınızı yapay zeka ve sesli asistanla yönetmek için Apivice’ı indirin",
  ctaLabel = "Apivice’ı indir",
  href = "https://play.google.com/store/apps/details?id=com.apivice.app",
  className = "",
}: ApiviceBannerProps) {
  return (
    <aside
      aria-label="Apivice soft-pitch"
      className={`flex min-h-[4.75rem] w-full flex-col gap-3 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 p-3 sm:min-h-[4.25rem] sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${className}`}
    >
      <p className="text-sm leading-snug text-amber-950/90">{message}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
      >
        {ctaLabel}
      </a>
    </aside>
  );
}
