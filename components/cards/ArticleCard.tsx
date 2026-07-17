import Link from "next/link";
import type { Article } from "@/lib/content";
import { getCategoryName } from "@/config/categories";
import { readingTime } from "@/lib/utils";
import { CategoryIcon } from "@/components/ui/CategoryVisual";
import { ArticleHero } from "@/components/ui/ArticleHero";

/**
 * Article preview card. Designed art header (category-tinted + icon), a category
 * chip, the mono LOG/UPD stamp, reading time, and a "reviewed" trust signal.
 * Lifts on hover.
 */
export function ArticleCard({ article }: { article: Article }) {
  const { frontmatter: fm } = article;
  const mins = readingTime(article.content);

  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <Link href={`/articles/${fm.slug}`} className="flex h-full flex-col">
        <ArticleHero
          src={fm.heroImage}
          alt={fm.heroAlt}
          category={fm.category}
          className="aspect-[16/9] w-full border-b border-line"
        />

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2.5 flex items-center gap-2">
            <span className="chip">
              <CategoryIcon slug={fm.category} className="h-3 w-3" />
              {getCategoryName(fm.category)}
            </span>
            {fm.type === "commercial" && (
              <span className="chip bg-highlight/15 text-highlightText">Reviews</span>
            )}
          </div>

          <h3 className="font-display text-lg leading-snug text-ink transition-colors group-hover:text-accent">
            {fm.title}
          </h3>

          <p className="log-stamp mt-2">
            LOG {fm.publishedAt}
            {fm.updatedAt && fm.updatedAt !== fm.publishedAt
              ? ` · UPD ${fm.updatedAt}`
              : ""}
          </p>

          <p className="mt-3 line-clamp-2 text-sm text-ink-soft">{fm.excerpt}</p>

          <div className="mt-4 flex items-center gap-3 border-t border-line pt-3 text-xs text-ink-soft">
            <span className="font-mono">{mins} min read</span>
            {fm.medicallyReviewed && (
              <span className="flex items-center gap-1 text-accent">
                <CheckIcon /> Reviewed
              </span>
            )}
            <span className="ml-auto text-accent opacity-0 transition-opacity group-hover:opacity-100">
              Read →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
