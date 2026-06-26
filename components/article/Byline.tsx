import Link from "next/link";
import type { Author } from "@/lib/content";
import { formatDate } from "@/lib/utils";

/**
 * Author byline with credentials and publish/update dates.
 * A core E-E-A-T signal — named, credentialed author on every article
 * (SEO_REQUIREMENTS.md §4).
 */
export function Byline({
  author,
  authorSlug,
  publishedAt,
  updatedAt,
}: {
  author: Author | null;
  authorSlug: string;
  publishedAt: string;
  updatedAt: string;
}) {
  const name = author?.frontmatter.name ?? authorSlug;
  const credentials = author?.frontmatter.credentials;
  const updated = updatedAt && updatedAt !== publishedAt;

  return (
    <div className="flex items-center gap-3">
      <Avatar name={name} avatar={author?.frontmatter.avatar} />
      <div className="text-sm">
        <p className="text-ink">
          By{" "}
          {author ? (
            <Link
              href={`/authors/${author.frontmatter.slug}`}
              className="font-medium text-ink link-underline hover:text-accent"
            >
              {name}
            </Link>
          ) : (
            <span className="font-medium">{name}</span>
          )}
          {credentials && (
            <span className="text-ink-soft">, {credentials}</span>
          )}
        </p>
        <p className="log-stamp mt-0.5">
          {updated ? `Updated ${formatDate(updatedAt)}` : `Published ${formatDate(publishedAt)}`}
        </p>
      </div>
    </div>
  );
}

/** Initials-circle placeholder until real author images land in Phase 6. */
function Avatar({ name, avatar }: { name: string; avatar?: string }) {
  // Real images are wired with next/image in Phase 6; for now show initials so a
  // missing file never breaks the byline.
  void avatar;
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-sm text-accent"
    >
      {initials}
    </span>
  );
}
