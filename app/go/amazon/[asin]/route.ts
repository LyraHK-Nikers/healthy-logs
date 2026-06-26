import { amazonUrl } from "@/config/affiliates";

/**
 * Affiliate click redirect (cloaking + tracking).
 * AffiliateLink points here (/go/amazon/[asin]) instead of straight to Amazon, so:
 *   - the tracking tag stays in config (one place),
 *   - links can be swapped/audited without touching content,
 *   - clicks are countable from access logs / an analytics hook below,
 *   - /go/ is disallowed in robots.txt so crawlers don't follow it.
 *
 * Safe by construction: only ever builds an Amazon URL from a validated ASIN —
 * never redirects to an arbitrary user-supplied URL (no open-redirect).
 */
export function GET(
  _req: Request,
  { params }: { params: { asin: string } },
) {
  const asin = params.asin;
  if (!/^[A-Za-z0-9]{8,14}$/.test(asin)) {
    return new Response("Not found", { status: 404 });
  }
  // TODO: record the click here (e.g. log line, KV counter, or analytics event).
  return Response.redirect(amazonUrl(asin), 302);
}
