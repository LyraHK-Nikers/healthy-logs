import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import {
  getAllAuthors,
  getAuthorBySlug,
  getArticlesByAuthor,
} from "@/lib/content";
import { mdxComponents } from "@/lib/mdx";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.frontmatter.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const author = getAuthorBySlug(params.slug);
  if (!author) return {};
  const { frontmatter: fm } = author;
  return pageMetadata({
    title: `${fm.name}${fm.credentials ? `, ${fm.credentials}` : ""}`,
    description: fm.bio,
    path: `/authors/${fm.slug}`,
  });
}

export default function AuthorPage({ params }: { params: { slug: string } }) {
  const author = getAuthorBySlug(params.slug);
  if (!author) notFound();

  const { frontmatter: fm, content } = author;
  const articles = getArticlesByAuthor(fm.slug);
  const initials = fm.name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: fm.name },
  ];

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fm.name,
    ...(fm.credentials ? { jobTitle: fm.credentials } : {}),
    description: fm.bio,
    url: `${siteConfig.url}/authors/${fm.slug}`,
  };

  return (
    <div className="mx-auto max-w-container px-5 py-10">
      <JsonLd data={[personJsonLd, breadcrumbJsonLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />

      <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
        <span
          aria-hidden="true"
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-xl text-accent"
        >
          {initials}
        </span>
        <div>
          <p className="eyebrow">
            {fm.role === "reviewer" ? "Reviewer" : "Writer"}
          </p>
          <h1 className="mt-1 font-display text-2xl text-ink">
            {fm.name}
            {fm.credentials && (
              <span className="text-ink-soft"> · {fm.credentials}</span>
            )}
          </h1>
          <p className="mt-2 max-w-xl text-ink-soft">{fm.bio}</p>
        </div>
      </header>

      {fm.placeholder && (
        <p className="mt-6 rounded-card border border-line bg-accent-soft p-4 text-sm text-ink-soft">
          ⚠️ Placeholder profile for development. Replace with a real,
          credentialed person before launch — invented credentials undermine the
          E-E-A-T trust this byline is meant to signal.
        </p>
      )}

      {/* author bio body (MDX) */}
      {content.trim() && (
        <div className="article-body mt-8 max-w-article">
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>
      )}

      <section className="mt-12">
        <h2 className="mb-6 font-display text-xl text-ink">
          {fm.role === "reviewer" ? "Reviewed & written" : "Articles"} by{" "}
          {fm.name.split(" ")[0]}
        </h2>
        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.frontmatter.slug} article={article} />
            ))}
          </div>
        ) : (
          <p className="text-ink-soft">No articles yet.</p>
        )}
      </section>
    </div>
  );
}
