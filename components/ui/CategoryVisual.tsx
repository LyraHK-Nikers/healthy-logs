import type { CategorySlug } from "@/config/categories";

/**
 * Per-category visual identity (design overhaul): a line icon + a muted tint.
 * Tints are deliberately low-saturation to stay "calm / clinical-warm" — the
 * variety adds designed personality without going neon (DESIGN_SYSTEM.md).
 */
export const CATEGORY_TINTS: Record<CategorySlug, string> = {
  vitamins: "#F2EEDD", // warm sand
  minerals: "#E6EDEF", // cool slate
  protein: "#F0EAE2", // soft clay
  "gut-health": "#E4EFEA", // mint
  "weight-management": "#ECE8F0", // muted lavender-grey
  "sports-nutrition": "#EAF2EC", // accent green wash
  "general-nutrition": "#EEF0E4", // olive wash
};

export function categoryTint(slug: string): string {
  return CATEGORY_TINTS[slug as CategorySlug] ?? "#EAF2EC";
}

/** Simple, consistent line icons (24×24, stroke = currentColor). */
const ICONS: Record<CategorySlug, React.ReactNode> = {
  vitamins: (
    <>
      <rect x="3.5" y="9" width="17" height="6" rx="3" transform="rotate(-40 12 12)" />
      <path d="M9.5 7.7l6.8 8.1" />
    </>
  ),
  minerals: (
    <>
      <path d="M12 3l7 5-3 12H8L5 8z" />
      <path d="M5 8h14M9.5 8L12 20M14.5 8L12 20" />
    </>
  ),
  protein: (
    <>
      <ellipse cx="12" cy="13" rx="6" ry="8" />
      <path d="M9 11c1.2-1.4 3-1.6 4.5-.6" />
    </>
  ),
  "gut-health": (
    <>
      <path d="M8 4c-2.5 1-3.5 3.5-3 6 .6 3 .2 6-2 8" />
      <path d="M16 4c2.5 1 3.5 3.5 3 6-.6 3-.2 6 2 8" />
      <circle cx="11" cy="11" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="14" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="15.5" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  "weight-management": (
    <>
      <path d="M5 16a7 7 0 0 1 14 0" />
      <path d="M12 16l3.2-3.4" />
      <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  "sports-nutrition": (
    <>
      <path d="M13 2.5L5.5 13H11l-1.5 8.5L18.5 10H12.5z" />
    </>
  ),
  "general-nutrition": (
    <>
      <path d="M12 8c-2-2-5.5-1.6-6.5 1.2-1 2.8 1 7 3.5 9.3 2.5-2.3 4.5-6.5 3.5-9.3C11.5 6.4 8 6 6 8" />
      <path d="M12 8c0-2 1-3.5 3-4" />
    </>
  ),
};

export function CategoryIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const icon = ICONS[slug as CategorySlug] ?? ICONS["general-nutrition"];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icon}
    </svg>
  );
}

/**
 * Designed placeholder art for article heroes/cards — a category-tinted panel
 * with the notebook ruling and the category icon. Replaces the old empty
 * gradient block so nothing looks unfinished, and swaps cleanly for a real
 * photo later.
 */
export function ArticleArt({
  slug,
  className,
  iconClassName = "h-12 w-12",
}: {
  slug: string;
  className?: string;
  iconClassName?: string;
}) {
  const tint = categoryTint(slug);
  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{
        background: `radial-gradient(120% 120% at 80% 0%, ${tint} 0%, var(--surface) 130%)`,
      }}
      aria-hidden="true"
    >
      <div className="notebook-lines absolute inset-0 opacity-70" />
      <div className="absolute inset-0 flex items-center justify-center">
        <CategoryIcon slug={slug} className={`text-accent/70 ${iconClassName}`} />
      </div>
    </div>
  );
}
