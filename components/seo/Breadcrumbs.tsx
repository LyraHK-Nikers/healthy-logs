import Link from "next/link";

export type Crumb = { label: string; href?: string };

/**
 * Visible breadcrumb trail. Phase 5 will emit a matching BreadcrumbList JSON-LD
 * from the same crumbs (SEO_REQUIREMENTS.md §2).
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-ink-soft">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="link-underline hover:text-accent">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="text-ink">
                  {item.label}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-line">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
