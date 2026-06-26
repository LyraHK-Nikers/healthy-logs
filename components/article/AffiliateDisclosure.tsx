import Link from "next/link";

/**
 * FTC affiliate-disclosure banner (AFFILIATE_SYSTEM.md §3).
 * The article template injects this automatically ABOVE the body on any
 * commercial article — so the disclosure is ALWAYS visible BEFORE the first
 * affiliate link, never relying on the writer to remember.
 *
 * Style: quiet --accent-soft wash, small text (DESIGN_SYSTEM.md).
 */
export function AffiliateDisclosure() {
  return (
    <aside
      role="note"
      aria-label="Affiliate disclosure"
      className="my-6 rounded-card border border-line bg-accent-soft px-4 py-3 text-sm text-ink-soft"
    >
      <strong className="text-ink">Disclosure:</strong> Healthy Logs is
      reader-supported. When you buy through links on our site, we may earn an
      affiliate commission at no extra cost to you. This never affects which
      products we recommend or how we rate them.{" "}
      <Link href="/disclosure" className="text-accent link-underline">
        Learn more
      </Link>
      .
    </aside>
  );
}
