/**
 * Healthy Logs brand logo — a gold botanical emblem: a leaf wreath encircling
 * a sprouting figure. The raster mark lives in /public/brand.
 *
 * <LogoMark> = the emblem alone (favicon, avatars, compact spots).
 * <Logo>     = emblem + "Healthy Logs" wordmark in Fraunces.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/healthy-logs-emblem-256.png"
      alt="Healthy Logs"
      className={`object-contain ${className ?? ""}`}
      draggable={false}
    />
  );
}

export function Logo({
  className,
  markClassName = "h-9 w-9",
  showSuffix = true,
}: {
  className?: string;
  markClassName?: string;
  showSuffix?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className={markClassName} />
      <span className="flex items-baseline gap-2">
        <span className="font-display text-lg font-semibold leading-none text-ink">
          Healthy Logs
        </span>
        {showSuffix && (
          <span className="log-stamp hidden sm:inline">· wellness, logged</span>
        )}
      </span>
    </span>
  );
}
