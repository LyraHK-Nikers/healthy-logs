import type { Metadata } from "next";
import { getAllArticles } from "@/lib/content";
import { getCategoryName } from "@/config/categories";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SearchClient, type SearchItem } from "@/components/search/SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Healthy Logs articles.",
  // utility page — keep it out of the index
  robots: { index: false, follow: true },
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const index: SearchItem[] = getAllArticles().map((a) => ({
    title: a.frontmatter.title,
    excerpt: a.frontmatter.excerpt,
    slug: a.frontmatter.slug,
    category: a.frontmatter.category,
    categoryName: getCategoryName(a.frontmatter.category),
    tags: a.frontmatter.tags ?? [],
  }));

  return (
    <div className="mx-auto max-w-article px-5 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <header className="mb-8 mt-6">
        <h1 className="font-display text-2xl text-ink">Search</h1>
        <p className="mt-2 text-ink-soft">
          Find evidence-based guides and comparisons across the site.
        </p>
      </header>
      <SearchClient index={index} initialQuery={searchParams.q ?? ""} />
    </div>
  );
}
