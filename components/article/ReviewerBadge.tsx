import Link from "next/link";
import type { Author } from "@/lib/content";
import { formatDate } from "@/lib/utils";

/**
 * "Medically reviewed by …" line — a strong trust signal for YMYL health
 * content (SEO_REQUIREMENTS.md §4). Green check, never neon.
 * Phase 4 may extend this into a fuller "fact-checked" component.
 */
export function ReviewerBadge({
  reviewer,
  reviewerSlug,
  reviewedAt,
}: {
  reviewer: Author | null;
  reviewerSlug: string;
  reviewedAt?: string;
}) {
  const name = reviewer?.frontmatter.name ?? reviewerSlug;
  const credentials = reviewer?.frontmatter.credentials;

  return (
    <p className="flex flex-wrap items-center gap-1.5 text-sm text-ink-soft">
      <CheckIcon />
      <span>
        Medically reviewed by{" "}
        {reviewer ? (
          <Link
            href={`/authors/${reviewer.frontmatter.slug}`}
            className="font-medium text-ink link-underline hover:text-accent"
          >
            {name}
          </Link>
        ) : (
          <span className="font-medium text-ink">{name}</span>
        )}
        {credentials && <span>, {credentials}</span>}
        {reviewedAt && (
          <span className="log-stamp"> · {formatDate(reviewedAt)}</span>
        )}
      </span>
    </p>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="8" cy="8" r="8" fill="var(--accent-soft)" />
      <path
        d="M4.5 8.2l2.2 2.3 4.8-4.9"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
