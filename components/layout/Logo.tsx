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
      {/* "Field notebook" mark: an open book sprouting a golden leaf. */}
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="10"
        fill="#FBFBF9"
        stroke="#2F6B4F"
        strokeWidth="2"
      />
      <path
        d="M20 28C16.5 25.8 13 25.8 10 27L10 18C13 16.8 16.5 16.8 20 19Z"
        fill="#2F6B4F"
      />
      <path
        d="M20 28C23.5 25.8 27 25.8 30 27L30 18C27 16.8 23.5 16.8 20 19Z"
        fill="#2F6B4F"
      />
      <path d="M20 19V28" stroke="#FBFBF9" strokeWidth="1" strokeLinecap="round" />
      <path
        d="M20 18.5V9.5"
        stroke="#2F6B4F"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M20 13C22.6 12.4 24.2 10.4 24 7.8C21.4 8.1 19.7 9.8 20 13Z"
        fill="#C9A24B"
      />
      <path
        d="M20 15.5C17.4 15 15.9 13.2 16 10.7C18.6 11 20.2 12.6 20 15.5Z"
        fill="#C9A24B"
      />
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
