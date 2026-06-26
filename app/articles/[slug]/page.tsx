import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import {
  getAllSlugs,
  getArticleBySlug,
  getAuthorBySlug,
  getRelatedArticles,
  extractHeadings,
} from "@/lib/content";
import { getCategory } from "@/config/categories";
import { mdxComponents } from "@/lib/mdx";
import { articleMetadata } from "@/lib/seo";
import { Byline } from "@/components/article/Byline";
import { ReviewerBadge } from "@/components/article/ReviewerBadge";
import { TableOfContents } from "@/components/article/TableOfContents";
import { FaqBlock } from "@/components/article/FaqBlock";
import { AffiliateDisclosure } from "@/components/article/AffiliateDisclosure";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { AuthorCard } from "@/components/article/AuthorCard";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { ArticleHero } from "@/components/ui/ArticleHero";
import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";
import { readingTime } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  articleJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  productListJsonLd,
} from "@/lib/seo";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};
  return articleMetadata(article);
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const { frontmatter: fm, content } = article;
  const author = getAuthorBySlug(fm.author);
  const reviewer = fm.reviewer ? getAuthorBySlug(fm.reviewer) : null;
  const headings = extractHeadings(content);
  const category = getCategory(fm.category);
  const related = getRelatedArticles(fm.slug, 3);
  const mins = readingTime(content);
  const updated = fm.updatedAt && fm.updatedAt !== fm.publishedAt;
  // Commercial = explicitly typed commercial OR carries affiliate products.
  const isCommercial =
    fm.type === "commercial" ||
    (fm.affiliateProducts?.length ?? 0) > 0;

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: category?.name ?? fm.category, href: `/category/${fm.category}` },
    { label: fm.title },
  ];

  // Structured data (SEO_REQUIREMENTS.md §2)
  const jsonLd: object[] = [
    articleJsonLd(article, author, reviewer),
    breadcrumbJsonLd(crumbs),
  ];
  if (fm.faq?.length) jsonLd.push(faqJsonLd(fm.faq));
  if (isCommercial && fm.affiliateProducts?.length) {
    jsonLd.push(productListJsonLd(fm.affiliateProducts));
  }

  return (
    <div className="mx-auto max-w-[1080px] px-5 py-10">
      <ReadingProgress />
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={crumbs} />

      <div className="mt-6 lg:grid lg:grid-cols-[1fr_15rem] lg:items-start lg:gap-12">
        {/* ------------------------------------------------ main column */}
        <div className="mx-auto w-full max-w-article">
          {/* ----------------------------------- "log entry" article header */}
          <header>
            <p className="eyebrow">{category?.name ?? fm.category}</p>
            <h1 className="mt-3 font-display text-2xl leading-tight text-ink sm:text-3xl">
              {fm.title}
            </h1>
            <p className="mt-4 text-md text-ink-soft">{fm.excerpt}</p>

            {/* the signature ruled LOG / UPD line */}
            <div className="my-6 flex items-center gap-3">
              <span className="log-stamp whitespace-nowrap">
                LOG {fm.publishedAt}
                {updated ? ` · UPD ${fm.updatedAt}` : ""}
              </span>
              <span className="rule flex-1" aria-hidden="true" />
              <span className="log-stamp shrink-0 text-ink-soft">
                {mins} min read
              </span>
            </div>

            <div className="space-y-3">
              <Byline
                author={author}
                authorSlug={fm.author}
                publishedAt={fm.publishedAt}
                updatedAt={fm.updatedAt}
              />
              {fm.reviewer && (
                <ReviewerBadge
                  reviewer={reviewer}
                  reviewerSlug={fm.reviewer}
                  reviewedAt={fm.updatedAt}
                />
              )}
            </div>
          </header>

          {/* real hero image if uploaded, else designed placeholder */}
          <ArticleHero
            src={fm.heroImage}
            alt={fm.heroAlt}
            category={fm.category}
            className="mt-8 aspect-[2/1] w-full rounded-card border border-line"
            iconClassName="h-16 w-16"
          />

          {/* Commercial articles auto-show the FTC disclosure ABOVE the body —
              structural, never relying on the writer (AFFILIATE_SYSTEM.md §3). */}
          {isCommercial && <AffiliateDisclosure />}

          {/* inline TOC on mobile; sticky sidebar takes over on desktop */}
          <TableOfContents headings={headings} className="my-8 lg:hidden" />

          {/* --------------------------------------------------- body */}
          <article className="article-body mt-8">
            <MDXRemote
              source={content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
                // expose frontmatter to the body so writers can place
                // <ProductComparison products={products} /> where they want.
                scope: {
                  products: fm.affiliateProducts ?? [],
                  frontmatter: fm,
                },
              }}
            />
          </article>

          <FaqBlock items={fm.faq} />

          <AuthorCard author={author} label="Written by" />
          {fm.reviewer && reviewer && (
            <AuthorCard author={reviewer} label="Medically reviewed by" />
          )}
        </div>

        {/* ------------------------------------------ sticky TOC sidebar */}
        {headings.length >= 2 && (
          <aside className="hidden self-start lg:sticky lg:top-24 lg:block">
            <TableOfContents headings={headings} />
          </aside>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-xl text-ink">Related reading</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ArticleCard key={r.frontmatter.slug} article={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
