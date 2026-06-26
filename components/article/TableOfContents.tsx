import type { Heading } from "@/lib/content";

/**
 * On-page table of contents built from the article's h2/h3 headings.
 * Anchor ids are produced by rehype-slug at render time and matched here via
 * github-slugger (see lib/content.ts extractHeadings).
 */
export function TableOfContents({
  headings,
  className = "",
}: {
  headings: Heading[];
  className?: string;
}) {
  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={`rounded-card border border-line bg-surface p-5 ${className}`}
    >
      <h2 className="eyebrow mb-3">On this page</h2>
      <ol className="space-y-1.5 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${h.id}`}
              className="text-ink-soft link-underline hover:text-accent"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
