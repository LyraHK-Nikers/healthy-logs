import Link from "next/link";
import { getAllArticles, getFeaturedArticles } from "@/lib/content";
import { categories, getCategoryName } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { readingTime } from "@/lib/utils";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { CategoryIcon } from "@/components/ui/CategoryVisual";
import { ArticleHero } from "@/components/ui/ArticleHero";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import type { Article } from "@/lib/content";

export default function HomePage() {
  const allArticles = getAllArticles();
  const featured = getFeaturedArticles(4);
  const spotlight = featured[0];
  const rest = featured.slice(1, 4);

  // Articles already shown in the spotlight block, so the grid below never repeats them.
  const shownSlugs = new Set(
    [spotlight, ...rest.slice(0, 2)].filter(Boolean).map((a) => a.frontmatter.slug),
  );
  const moreRecent = allArticles.filter(
    (a) => !shownSlugs.has(a.frontmatter.slug),
  );

  const countByCategory = allArticles.reduce<Record<string, number>>(
    (acc, a) => {
      acc[a.frontmatter.category] = (acc[a.frontmatter.category] ?? 0) + 1;
      return acc;
    },
    {},
  );
  // Only surface categories that actually have articles (fall back to all if none yet).
  const populatedCategories = categories.filter(
    (c) => (countByCategory[c.slug] ?? 0) > 0,
  );
  const shownCategories = populatedCategories.length
    ? populatedCategories
    : categories;

  return (
    <div>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />

      {/* ============================================================= Hero */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-container items-center gap-10 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="reveal">
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Evidence-based wellness
            </span>
            <h1 className="mt-4 font-display text-3xl leading-[1.05] text-ink sm:text-[3.25rem]">
              Wellness you can
              <br />
              actually trust.
            </h1>
            <p className="mt-5 max-w-md text-md text-ink-soft">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/articles" className="btn-primary">
                Read the guides →
              </Link>
              <Link href="/editorial-policy" className="btn-secondary">
                How we review
              </Link>
            </div>
          </div>

          {/* the "log entry" signature, as a designed visual */}
          <div className="reveal hidden lg:block" style={{ ["--d" as string]: "120ms" }}>
            <LogEntryMockup />
          </div>
        </div>
      </section>

      {/* ====================================================== Trust band */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-container grid-cols-2 gap-px overflow-hidden px-5 py-8 sm:grid-cols-4">
          <Stat value="Cited" label="Every health claim sourced" />
          <Stat value="Reviewed" label="Checked by a qualified reviewer" />
          <Stat value="Dated" label="Logged & revisited, not evergreen" />
          <Stat value="Honest" label="Ratings never bought" />
        </div>
      </section>

      <div className="mx-auto max-w-container px-5">
        {/* ============================================== Featured spotlight */}
        {spotlight && (
          <section className="py-12">
            <SectionHeading title="Latest logs" href="/articles" linkLabel="All articles →" />
            <div className="grid gap-6 lg:grid-cols-2">
              <Spotlight article={spotlight} />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                {rest.slice(0, 2).map((a) => (
                  <CompactRow key={a.frontmatter.slug} article={a} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* More recent — only when there are genuinely different articles to show,
            so the homepage never repeats the spotlight above. */}
        {moreRecent.length >= 3 && (
          <section className="pb-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moreRecent.slice(0, 6).map((a, i) => (
                <div
                  key={a.frontmatter.slug}
                  className="reveal"
                  style={{ ["--d" as string]: `${i * 70}ms` }}
                >
                  <ArticleCard article={a} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==================================================== Quiz CTA */}
        <section className="py-6">
          <Link
            href="/quiz"
            className="card card-hover group flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
            style={{ backgroundColor: "var(--accent-soft)" }}
          >
            <div>
              <p className="eyebrow">60-second quiz</p>
              <h2 className="mt-1 font-display text-xl text-ink sm:text-2xl">
                Not sure which supplement is right for you?
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                Answer three quick questions and get a research-backed place to
                start.
              </p>
            </div>
            <span className="btn-primary shrink-0">Take the quiz →</span>
          </Link>
        </section>

        {/* ===================================================== Categories */}
        <section className="py-12">
          <SectionHeading title="Browse by topic" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shownCategories.map((category, i) => (
              <div
                key={category.slug}
                className="reveal"
                style={{ ["--d" as string]: `${i * 50}ms` }}
              >
                <CategoryCard
                  category={category}
                  count={countByCategory[category.slug] ?? 0}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================== Newsletter */}
        <section className="my-12 overflow-hidden rounded-card border border-line bg-accent-soft">
          <div className="relative p-8 sm:p-12">
            <div className="notebook-lines absolute inset-0 opacity-40" aria-hidden="true" />
            <div className="relative max-w-md">
              <h2 className="font-display text-xl text-ink sm:text-2xl">
                Get new logs in your inbox
              </h2>
              <p className="mt-2 mb-5 text-sm text-ink-soft">
                Occasional, dietitian-reviewed wellness &amp; supplement notes.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- subcomponents */

function SectionHeading({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-baseline justify-between gap-4">
      <h2 className="flex items-center gap-3 font-display text-xl text-ink sm:text-2xl">
        {title}
      </h2>
      {href && linkLabel && (
        <Link
          href={href}
          className="shrink-0 text-sm text-ink-soft link-underline hover:text-accent"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-2 text-center sm:px-4">
      <p className="font-display text-lg text-accent">{value}</p>
      <p className="mt-1 text-xs text-ink-soft">{label}</p>
    </div>
  );
}

function Spotlight({ article }: { article: Article }) {
  const fm = article.frontmatter;
  const mins = readingTime(article.content);
  return (
    <Link
      href={`/articles/${fm.slug}`}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      <ArticleHero
        src={fm.heroImage}
        alt={fm.heroAlt}
        category={fm.category}
        className="aspect-[16/10] w-full border-b border-line"
        iconClassName="h-16 w-16"
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="chip">
            <CategoryIcon slug={fm.category} className="h-3 w-3" />
            {getCategoryName(fm.category)}
          </span>
          <span className="log-stamp">Featured</span>
        </div>
        <h3 className="font-display text-xl leading-snug text-ink transition-colors group-hover:text-accent sm:text-2xl">
          {fm.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-ink-soft">{fm.excerpt}</p>
        <div className="mt-5 flex items-center gap-3 text-xs text-ink-soft">
          <span className="font-mono">{mins} min read</span>
          <span className="log-stamp">UPD {fm.updatedAt}</span>
        </div>
      </div>
    </Link>
  );
}

function CompactRow({ article }: { article: Article }) {
  const fm = article.frontmatter;
  return (
    <Link
      href={`/articles/${fm.slug}`}
      className="card card-hover group flex items-center gap-4 p-4"
    >
      <ArticleHero
        src={fm.heroImage}
        alt={fm.heroAlt}
        category={fm.category}
        className="h-20 w-24 shrink-0 rounded-card"
        iconClassName="h-7 w-7"
      />
      <div className="min-w-0">
        <span className="eyebrow">{getCategoryName(fm.category)}</span>
        <h3 className="mt-1 line-clamp-2 font-display text-md leading-snug text-ink transition-colors group-hover:text-accent">
          {fm.title}
        </h3>
        <p className="log-stamp mt-1">LOG {fm.publishedAt}</p>
      </div>
    </Link>
  );
}

function LogEntryMockup() {
  return (
    <div className="relative rounded-card border border-line bg-surface p-7 shadow-[0_20px_50px_-30px_rgba(28,37,32,0.4)]">
      <div className="notebook-lines absolute inset-0 rounded-card opacity-40" aria-hidden="true" />
      <div className="relative">
        <span className="eyebrow">Minerals</span>
        <p className="mt-3 font-display text-2xl leading-tight text-ink">
          Magnesium Glycinate vs Citrate: Which Is Better for Sleep?
        </p>
        <div className="my-5 flex items-center gap-3">
          <span className="log-stamp whitespace-nowrap">
            LOG 2026-06-20 · UPD 2026-06-25
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft font-display text-sm text-accent">
            JD
          </span>
          <div className="text-sm">
            <p className="text-ink">Jane Doe, MS RD</p>
            <p className="flex items-center gap-1 text-xs text-accent">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Medically reviewed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
