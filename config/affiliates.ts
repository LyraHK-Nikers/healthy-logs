/**
 * Central affiliate config — the SINGLE source of truth for tracking tags
 * (AFFILIATE_SYSTEM.md §1). Change the tag here and it applies everywhere.
 *
 * NEVER hardcode an Amazon Associates tag into article content.
 * Phase 3 builds the <AffiliateLink> / <ProductCard> components on top of this.
 */
export const AFFILIATE = {
  amazon: {
    // Your Amazon Associates tracking tag. Placeholder until you have a real one.
    trackingTag: "healthylogs-20",
    domain: "https://www.amazon.com",
  },
  // Add brand-direct / network programs as you sign up, e.g.:
  // iherb: { template: "https://www.iherb.com/pr/{id}?rcode=XXXX" },
} as const;

/** Build a final Amazon URL from an ASIN. */
export function amazonUrl(asin: string): string {
  return `${AFFILIATE.amazon.domain}/dp/${asin}?tag=${AFFILIATE.amazon.trackingTag}`;
}

/** Generic resolver used by product frontmatter / components. */
export function resolveAffiliateUrl(p: {
  asin?: string;
  affiliateUrl?: string;
}): string {
  if (p.asin) return amazonUrl(p.asin);
  if (p.affiliateUrl) return p.affiliateUrl;
  return "#";
}
