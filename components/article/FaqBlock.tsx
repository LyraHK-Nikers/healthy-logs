import type { FaqItem } from "@/lib/content";

/**
 * Frequently-asked-questions block, rendered from the `faq` frontmatter array.
 * Uses native <details>/<summary> for accessible, no-JS collapse.
 * Phase 5 emits matching FAQPage JSON-LD from the same data.
 */
export function FaqBlock({ items }: { items?: FaqItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="mt-12">
      <h2 id="faq-heading" className="mb-4 font-display text-xl text-ink">
        Frequently asked questions
      </h2>
      <div className="divide-y divide-line border-y border-line">
        {items.map((item, i) => (
          <details key={i} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink marker:hidden">
              <span>{item.q}</span>
              <span
                aria-hidden="true"
                className="log-stamp shrink-0 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-ink-soft">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
