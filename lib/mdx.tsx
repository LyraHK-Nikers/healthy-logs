import type { MDXComponents } from "mdx/types";
import { AffiliateLink } from "@/components/affiliate/AffiliateLink";
import { ProductCard } from "@/components/affiliate/ProductCard";
import { ProductComparison } from "@/components/affiliate/ProductComparison";

/**
 * MDX component mapping (ARCHITECTURE.md). Applies the design system to
 * article body elements so .mdx authors get consistent typography for free,
 * and exposes the affiliate components so writers can use them in .mdx.
 */
export const mdxComponents: MDXComponents = {
  // affiliate components (Phase 3) — usable directly in article bodies
  AffiliateLink,
  ProductCard,
  ProductComparison,
  // scroll-mt clears the sticky header when jumping to a TOC anchor.
  // {...props} carries the `id` that rehype-slug injects, so anchors resolve.
  h2: (props) => (
    <h2 className="mt-12 mb-3 scroll-mt-24 text-xl font-display" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-8 mb-2 scroll-mt-24 text-lg font-display" {...props} />
  ),
  p: (props) => <p className="my-4 text-ink-soft" {...props} />,
  ul: (props) => (
    <ul className="my-4 list-disc space-y-1 pl-6 text-ink-soft" {...props} />
  ),
  ol: (props) => (
    <ol className="my-4 list-decimal space-y-1 pl-6 text-ink-soft" {...props} />
  ),
  a: (props) => <a className="text-accent link-underline" {...props} />,
  hr: () => <hr className="my-10 rule" />,
  blockquote: (props) => (
    <blockquote
      className="my-8 rounded-r-card border-l-[3px] border-accent bg-accent-soft/50 px-5 py-4 font-display text-md italic text-ink"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-[0.85em] text-ink"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-line px-3 py-2 text-left font-display text-ink"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border-b border-line px-3 py-2 text-ink-soft" {...props} />
  ),
};
