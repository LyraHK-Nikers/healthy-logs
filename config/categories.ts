/**
 * Taxonomy — the ONE place to manage categories.
 *
 * TO ADD A CATEGORY: copy one block below and edit slug / name / description.
 *   - slug: lowercase, hyphenated (used in URLs + article frontmatter `category`)
 *   - name: shown to readers
 *   - description: shown on the category page + homepage tile
 * Everything else (homepage grid, /category/[slug] page, filters, sitemap, the
 * admin dropdown) updates automatically — no other file to touch.
 */
export const categories = [
  {
    slug: "vitamins",
    name: "Vitamins",
    description:
      "Evidence-based guides to vitamins — what the research says about benefits, dosing, and forms.",
  },
  {
    slug: "minerals",
    name: "Minerals",
    description:
      "Magnesium, zinc, iron and more: how essential minerals work and how to choose a form.",
  },
  {
    slug: "protein",
    name: "Protein",
    description:
      "Protein needs, sources, and supplements for everyday health and training.",
  },
  {
    slug: "gut-health",
    name: "Gut health",
    description:
      "Fiber, probiotics, and the science of a healthy digestive system.",
  },
  {
    slug: "weight-management",
    name: "Weight management",
    description:
      "Sustainable, research-backed approaches to managing body weight.",
  },
  {
    slug: "sports-nutrition",
    name: "Sports nutrition",
    description:
      "Fueling performance, recovery, and the supplements with real evidence behind them.",
  },
  {
    slug: "general-nutrition",
    name: "General nutrition",
    description:
      "Foundational nutrition science for everyday, healthy eating.",
  },
] as const;

// Types derive from the array above — add a category and the type updates itself.
export type CategorySlug = (typeof categories)[number]["slug"];
export type Category = { slug: CategorySlug; name: string; description: string };

export const categorySlugs: CategorySlug[] = categories.map((c) => c.slug);

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryName(slug: string): string {
  return getCategory(slug)?.name ?? slug;
}
