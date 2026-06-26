import type { AffiliateProduct } from "@/lib/content";
import { ProductCard } from "@/components/affiliate/ProductCard";

/**
 * Roundup grid of products (AFFILIATE_SYSTEM.md §4). Driven by the
 * `affiliateProducts` frontmatter array, so the writer never pastes tracking
 * tags or raw store links — every "Check price" routes through <AffiliateLink>.
 *
 * MDX usage (frontmatter is exposed to the body via scope):
 *   <ProductComparison products={products} />
 *
 * Note: no automatic "Best" badge — methodology must justify any ranking
 * (AFFILIATE_SYSTEM.md §6). Pass an explicit `badge` per product if warranted.
 */
export function ProductComparison({
  products,
}: {
  products?: AffiliateProduct[];
}) {
  if (!products || products.length === 0) return null;

  return (
    <div className="my-8 grid gap-5 sm:grid-cols-2">
      {products.map((p, i) => (
        <ProductCard
          key={i}
          name={p.name}
          asin={p.asin}
          affiliateUrl={p.affiliateUrl}
          rating={p.rating}
          price={p.price}
          pros={p.pros}
          cons={p.cons}
        />
      ))}
    </div>
  );
}
