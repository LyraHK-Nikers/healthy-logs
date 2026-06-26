"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";

export type SearchItem = {
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  categoryName: string;
  tags: string[];
};

/**
 * Client-side fuzzy search over a build-time index (Phase 7).
 * No server round-trips — Fuse runs entirely in the browser.
 */
export function SearchClient({
  index,
  initialQuery = "",
}: {
  index: SearchItem[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);

  const fuse = useMemo(
    () =>
      new Fuse(index, {
        keys: [
          { name: "title", weight: 0.6 },
          { name: "excerpt", weight: 0.3 },
          { name: "tags", weight: 0.2 },
          { name: "categoryName", weight: 0.1 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [index],
  );

  const q = query.trim();
  const results = q ? fuse.search(q).map((r) => r.item) : [];

  return (
    <div>
      <label htmlFor="search-input" className="sr-only">
        Search articles
      </label>
      <input
        id="search-input"
        type="search"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles, e.g. magnesium, creatine…"
        className="w-full rounded-card border border-line bg-surface px-4 py-3 text-md text-ink placeholder:text-ink-soft/60"
      />

      <p aria-live="polite" className="log-stamp mt-3">
        {q
          ? `${results.length} result${results.length === 1 ? "" : "s"}`
          : `${index.length} articles indexed`}
      </p>

      <ul className="mt-6 divide-y divide-line border-y border-line">
        {(q ? results : index).map((item) => (
          <li key={item.slug} className="py-4">
            <Link href={`/articles/${item.slug}`} className="group block">
              <span className="eyebrow">{item.categoryName}</span>
              <h2 className="mt-1 font-display text-md text-ink group-hover:text-accent">
                {item.title}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
                {item.excerpt}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {q && results.length === 0 && (
        <p className="mt-6 text-ink-soft">
          No matches for &ldquo;{q}&rdquo;. Try a broader term.
        </p>
      )}
    </div>
  );
}
