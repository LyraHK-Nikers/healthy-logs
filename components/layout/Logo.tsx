/**
 * Healthy Logs brand logo.
 *
 * Concept (ties to the design system): a leaf (nutrition) inside a rounded
 * "log" badge, underlined by a brass rule — the same brass "LOG / UPD" stamp
 * used across the site. Colors are fixed brand colors (a logo shouldn't recolor).
 *
 * <LogoMark> = the badge mark alone (favicon, avatars, compact spots).
 * <Logo>     = mark + "Healthy Logs" wordmark in Fraunces.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="Healthy Logs"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="11" fill="#2F6B4F" />
      <g transform="rotate(-8 20 19)">
        <path
          d="M20 7C26 11 26 20.5 20 27.5C14 20.5 14 11 20 7Z"
          fill="#FBFBF9"
        />
        <path
          d="M20 10.5V26"
          stroke="#2F6B4F"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M20 16.5L23.4 14"
          stroke="#2F6B4F"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M20 20.5L16.6 18"
          stroke="#2F6B4F"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>
      <rect x="12.5" y="31" width="15" height="2.2" rx="1.1" fill="#C9A24B" />
    </svg>
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
          <span className="log-stamp hidden sm:inline">· nutrition, logged</span>
        )}
      </span>
    </span>
  );
}
