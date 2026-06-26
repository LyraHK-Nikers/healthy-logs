import { resolveAffiliateUrl } from "@/config/affiliates";

/**
 * The ONLY way an outbound product/store link may render (AFFILIATE_SYSTEM.md §2).
 * Guarantees compliance structurally:
 *   - rel="sponsored nofollow" → Google requirement since 2019
 *   - noopener → security
 *   - target="_blank" → opens retailer in a new tab
 *   - data-affiliate="true" → analytics hook
 *
 * RULE: no raw <a href> to an external store anywhere else in the codebase.
 */
type Props = {
  asin?: string;
  url?: string;
  children: React.ReactNode;
  className?: string;
};

export function AffiliateLink({ asin, url, children, className }: Props) {
  // ASIN links are cloaked through /go/amazon/[asin] for tracking + central
  // control; non-Amazon links resolve directly (no registry to validate them).
  const href = asin
    ? `/go/amazon/${asin}`
    : resolveAffiliateUrl({ affiliateUrl: url });
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      className={className}
      data-affiliate="true"
    >
      {children}
    </a>
  );
}
