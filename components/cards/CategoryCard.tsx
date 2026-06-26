import Link from "next/link";
import type { Category } from "@/config/categories";
import { CategoryIcon, categoryTint } from "@/components/ui/CategoryVisual";

/**
 * Category tile for the homepage taxonomy grid: a tinted icon badge, name,
 * count, and description. Accent border on hover.
 */
export function CategoryCard({
  category,
  count,
}: {
  category: Category;
  count: number;
}) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="card card-hover group flex flex-col p-5"
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-card text-accent"
          style={{ backgroundColor: categoryTint(category.slug) }}
        >
          <CategoryIcon slug={category.slug} className="h-5 w-5" />
        </span>
        <div className="flex flex-1 items-baseline justify-between">
          <h3 className="font-display text-md text-ink group-hover:text-accent">
            {category.name}
          </h3>
          <span
            className="log-stamp"
            aria-label={`${count} ${count === 1 ? "article" : "articles"}`}
          >
            {String(count).padStart(2, "0")}
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-soft">{category.description}</p>
    </Link>
  );
}
