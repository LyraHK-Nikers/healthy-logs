import Link from "next/link";
import type { Author } from "@/lib/content";

/**
 * End-of-article author/reviewer card — a clear E-E-A-T signal that puts a
 * named, credentialed human next to the content (SEO_REQUIREMENTS.md §4).
 */
export function AuthorCard({
  author,
  label,
}: {
  author: Author | null;
  label: string;
}) {
  if (!author) return null;
  const fm = author.frontmatter;
  const initials = fm.name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="card mt-8 flex gap-4 p-5">
      <span
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-ink-soft"
      >
        {initials}
      </span>
      <div className="min-w-0">
        <p className="eyebrow">{label}</p>
        <p className="mt-0.5 font-display text-md text-ink">
          {fm.name}
          {fm.credentials && (
            <span className="text-ink-soft"> · {fm.credentials}</span>
          )}
        </p>
        <p className="mt-1 text-sm text-ink-soft">{fm.bio}</p>
        <Link
          href={`/authors/${fm.slug}`}
          className="mt-2 inline-block text-sm text-accent link-underline"
        >
          View profile →
        </Link>
      </div>
    </div>
  );
}
