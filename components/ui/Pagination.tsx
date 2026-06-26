import Link from "next/link";

/**
 * Simple page navigation for the /articles index.
 * Builds hrefs that preserve the active category filter.
 */
export function Pagination({
  currentPage,
  totalPages,
  basePath,
  category,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  category?: string;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-2"
    >
      {currentPage > 1 && (
        <Link
          href={hrefFor(currentPage - 1)}
          className="rounded-card border border-line px-3 py-1.5 text-sm text-ink-soft hover:border-accent hover:text-accent"
          rel="prev"
        >
          ← Prev
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={hrefFor(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={
            page === currentPage
              ? "rounded-card border border-accent bg-accent px-3 py-1.5 text-sm font-medium text-white"
              : "rounded-card border border-line px-3 py-1.5 text-sm text-ink-soft hover:border-accent hover:text-accent"
          }
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={hrefFor(currentPage + 1)}
          className="rounded-card border border-line px-3 py-1.5 text-sm text-ink-soft hover:border-accent hover:text-accent"
          rel="next"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}
