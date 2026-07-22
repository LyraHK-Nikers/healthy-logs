import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/content";
import { categories, getCategory } from "@/config/categories";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

const PAGE_SIZE = 9;

export const metadata: Metadata = pageMetadata({
  title: "All articles",
  description:
    "Browse every Healthy Logs guide — evidence-based wellness articles and honest supplement comparisons.",
  path: "/articles",
});

export default function ArticlesIndexPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string };
}) {
  const activeCategory = searchParams.category;
  const validCategory = activeCategory
    ? getCategory(activeCategory)
    : undefined;

  const all = getAllArticles();
  const filtered = validCategory
    ? all.filter((a) => a.frontmatter.category === validCategory.slug)
    : all;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const requested = Number.parseInt(searchParams.page ?? "1", 10);
  const currentPage = Math.min(
    Math.max(1, Number.isNaN(requested) ? 1 : requested),
    totalPages,
  );
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="mx-auto max-w-container px-5 py-10">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Articles" }]}
      />

      <header className="mb-8 mt-6">
        <h1 className="font-display text-2xl text-ink">
          {validCategory ? validCategory.name : "All articles"}
        </h1>
        <p className="mt-2 max-w-xl text-ink-soft">
          {validCategory
            ? validCategory.description
            : "Evidence-based wellness guides and honest supplement comparisons."}
        </p>
      </header>

      {/* category filter chips */}
      <nav aria-label="Filter by category" className="mb-8 flex flex-wrap gap-2">
        <FilterChip label="All" href="/articles" active={!validCategory} />
        {categories.map((c) => (
          <FilterChip
            key={c.slug}
            label={c.name}
            href={`/articles?category=${c.slug}`}
            active={validCategory?.slug === c.slug}
          />
        ))}
      </nav>

      {pageItems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((article) => (
            <ArticleCard key={article.frontmatter.slug} article={article} />
          ))}
        </div>
      ) : (
        <p className="rounded-card border border-line bg-surface p-8 text-center text-ink-soft">
          No articles in this category yet. Check back soon.
        </p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/articles"
        category={validCategory?.slug}
      />
    </div>
  );
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={
        active
          ? "rounded-full bg-accent px-3.5 py-1.5 text-xs font-medium uppercase tracking-wide text-white"
          : "rounded-full border border-line px-3.5 py-1.5 text-xs uppercase tracking-wide text-ink-soft hover:border-accent hover:text-accent"
      }
    >
      {label}
    </Link>
  );
}
