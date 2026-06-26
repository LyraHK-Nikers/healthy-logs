import { AffiliateLink } from "@/components/affiliate/AffiliateLink";

/**
 * Single-product card for reviews and roundups (AFFILIATE_SYSTEM.md §4).
 * - rating in brass mono, pros with green ✓, cons with muted slate – (never red)
 * - "Check price" routes through <AffiliateLink> so it's always compliant
 *
 * Usable inline in MDX with literal props:
 *   <ProductCard name="Brand X" asin="B0XXXX" rating={4.5} price="$24.99"
 *     pros={["High absorption"]} cons={["Pricier"]} />
 */
export type ProductCardProps = {
  name: string;
  asin?: string;
  /** raw affiliate URL (used when there's no ASIN) */
  affiliateUrl?: string;
  url?: string;
  rating?: number;
  price?: string;
  pros?: string[];
  cons?: string[];
  /** optional ribbon, e.g. "Best overall" */
  badge?: string;
};

export function ProductCard({
  name,
  asin,
  affiliateUrl,
  url,
  rating,
  price,
  pros,
  cons,
  badge,
}: ProductCardProps) {
  const linkUrl = affiliateUrl || url;

  return (
    <div className="flex h-full flex-col rounded-card border border-line bg-surface p-5">
      {badge && (
        <span className="mb-3 inline-block self-start rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wide text-accent">
          {badge}
        </span>
      )}

      <h3 className="font-display text-md leading-snug text-ink">{name}</h3>

      <div className="mt-2 flex items-center gap-3">
        {typeof rating === "number" && <StarRating rating={rating} />}
        {price && (
          <span className="font-mono text-sm text-ink">{price}</span>
        )}
      </div>

      {pros && pros.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-sm">
          {pros.map((p, i) => (
            <li key={i} className="flex gap-2 text-ink-soft">
              <Check />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}

      {cons && cons.length > 0 && (
        <ul className="mt-2 space-y-1.5 text-sm">
          {cons.map((c, i) => (
            <li key={i} className="flex gap-2 text-ink-soft">
              <Dash />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 pt-2">
        <AffiliateLink
          asin={asin}
          url={linkUrl}
          className="inline-flex w-full items-center justify-center rounded-card bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Check price
        </AffiliateLink>
        <p className="log-stamp mt-2 text-center">Price may vary</p>
      </div>
    </div>
  );
}

/** Brass star rating (DESIGN_SYSTEM.md: --highlight used for ratings only). */
function StarRating({ rating }: { rating: number }) {
  const clamped = Math.max(0, Math.min(5, rating));
  return (
    <span
      className="flex items-center gap-1"
      aria-label={`Rated ${clamped} out of 5`}
    >
      <span aria-hidden="true" className="flex">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, clamped - i));
          return <Star key={i} fill={fill} />;
        })}
      </span>
      <span className="font-mono text-xs text-ink-soft">
        {clamped.toFixed(1)}
      </span>
    </span>
  );
}

function Star({ fill }: { fill: number }) {
  // fill: 0 = empty, 1 = full, 0.5 = half — via a clip width
  const id = `star-${Math.round(fill * 100)}`;
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="var(--highlight)" />
          <stop offset={`${fill * 100}%`} stopColor="var(--line)" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7L12 2z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}

function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Dash() {
  return (
    <span
      aria-hidden="true"
      className="mt-1.5 inline-block h-px w-3 shrink-0 bg-ink-soft/60"
    />
  );
}
