import Link from "next/link";
import {
  getAllArticles,
  getAuthorBySlug,
  getFeaturedArticles,
} from "@/lib/content";
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

  // The hero "log entry" card shows the newest real article (never a mockup).
  const latest = allArticles[0];
  const latestAuthor = latest ? getAuthorBySlug(latest.frontmatter.author) : null;
  const latestAuthorName = latestAuthor
    ? [latestAuthor.frontmatter.name, latestAuthor.frontmatter.credentials]
        .filter(Boolean)
        .join(", ")
    : latest?.frontmatter.author ?? "";

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
  // Only surface categories that actually have articles; a single tile isn't
  // worth a whole section, so "Browse by topic" appears from two topics up.
  const shownCategories = categories.filter(
    (c) => (countByCategory[c.slug] ?? 0) > 0,
  );

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
          {latest && (
            <div className="reveal hidden lg:block" style={{ ["--d" as string]: "120ms" }}>
              <LogEntryCard article={latest} authorName={latestAuthorName} />
            </div>
          )}
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
                {rest.length > 0 ? (
                  rest.slice(0, 2).map((a) => (
                    <CompactRow key={a.frontmatter.slug} article={a} />
                  ))
                ) : (
                  // Not enough articles yet: fill the column with the free tools.
                  <>
                    <ToolRow
                      href="/tools"
                      eyebrow="Free tools"
                      title="Protein & hydration calculators"
                      note="No signup · 30 seconds"
                      icon={ICON_CALC}
                    />
                    <ToolRow
                      href="/myths"
                      eyebrow="Game"
                      title="Myth or fact? Test what you know"
                      note="10 quick claims"
                      icon={ICON_QUESTION}
                    />
                  </>
                )}
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
                Answer a few quick questions and get a research-backed place to
                start.
              </p>
            </div>
            <span className="btn-primary shrink-0">Take the quiz →</span>
          </Link>
        </section>

        {/* ===================================================== Categories */}
        {shownCategories.length > 1 && (
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
        )}

        {/* ==================================================== Newsletter */}
        <section className="my-12 overflow-hidden rounded-card border border-line bg-accent-soft">
          <div className="relative p-8 sm:p-12">
            <div className="notebook-lines absolute inset-0 opacity-40" aria-hidden="true" />
            <div className="relative max-w-md">
              <h2 className="font-display text-xl text-ink sm:text-2xl">
                Get new logs in your inbox
              </h2>
              <p className="mt-2 mb-5 text-sm text-ink-soft">
                Occasional, expert-reviewed wellness &amp; supplement notes.
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

const ICON_CALC =
  "M6 3h12v18H6z M9 7h6 M9 11h.01 M12 11h.01 M15 11h.01 M9 15h.01 M12 15h.01 M15 15h.01";
const ICON_QUESTION =
  "M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17 M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6 M12 17h.01";

function ToolRow({
  href,
  eyebrow,
  title,
  note,
  icon,
}: {
  href: string;
  eyebrow: string;
  title: string;
  note: string;
  icon: string;
}) {
  return (
    <Link href={href} className="card card-hover group flex items-center gap-4 p-4">
      <span className="flex h-20 w-24 shrink-0 items-center justify-center rounded-card bg-accent-soft">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7 text-accent"
          aria-hidden="true"
        >
          <path d={icon} />
        </svg>
      </span>
      <div className="min-w-0">
        <span className="eyebrow">{eyebrow}</span>
        <h3 className="mt-1 line-clamp-2 font-display text-md leading-snug text-ink transition-colors group-hover:text-accent">
          {title}
        </h3>
        <p className="log-stamp mt-1">{note}</p>
      </div>
    </Link>
  );
}

/** The hero's "log entry" signature: the newest real article, clickable. */
function LogEntryCard({
  article,
  authorName,
}: {
  article: Article;
  authorName: string;
}) {
  const fm = article.frontmatter;
  const initials = authorName
    .split(/[\s,]+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  const updated = fm.updatedAt && fm.updatedAt !== fm.publishedAt;
  return (
    <Link
      href={`/articles/${fm.slug}`}
      className="group relative block rounded-card border border-line bg-surface p-7 shadow-[0_20px_50px_-30px_rgba(28,37,32,0.4)] transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="notebook-lines absolute inset-0 rounded-card opacity-40" aria-hidden="true" />
      <div className="relative">
        <span className="eyebrow">{getCategoryName(fm.category)}</span>
        <p className="mt-3 font-display text-2xl leading-tight text-ink transition-colors group-hover:text-accent">
          {fm.title}
        </p>
        <div className="my-5 flex items-center gap-3">
          <span className="log-stamp whitespace-nowrap">
            LOG {fm.publishedAt}
            {updated ? ` · UPD ${fm.updatedAt}` : ""}
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft font-display text-sm text-accent">
            {initials || "HL"}
          </span>
          <div className="text-sm">
            <p className="text-ink">{authorName}</p>
            {fm.reviewer ? (
              <p className="flex items-center gap-1 text-xs text-accent">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Expert reviewed
              </p>
            ) : (
              <p className="text-xs text-ink-soft">Latest log</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
