import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/content";
import { categorySlugs, getCategory } from "@/config/categories";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return categorySlugs.map((category) => ({ category }));
}

export function generateMetadata({
  params,
}: {
  params: { category: string };
}): Metadata {
  const category = getCategory(params.category);
  if (!category) return {};
  return pageMetadata({
    title: category.name,
    description: category.description,
    path: `/category/${category.slug}`,
  });
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = getCategory(params.category);
  if (!category) notFound();

  const articles = getArticlesByCategory(category.slug);

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/articles" },
    { label: category.name },
  ];

  return (
    <div className="mx-auto max-w-container px-5 py-10">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <header className="mb-8 mt-6">
        <p className="eyebrow">Category</p>
        <h1 className="mt-2 font-display text-2xl text-ink">{category.name}</h1>
        <p className="mt-2 max-w-xl text-ink-soft">{category.description}</p>
      </header>

      {articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.frontmatter.slug} article={article} />
          ))}
        </div>
      ) : (
        <p className="rounded-card border border-line bg-surface p-8 text-center text-ink-soft">
          No articles in {category.name} yet. Check back soon.
        </p>
      )}
    </div>
  );
}
