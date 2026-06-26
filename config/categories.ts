/**
 * Taxonomy — edit categories in ONE place (PROJECT_BRIEF.md §3).
 * `slug` is used in URLs and article frontmatter `category`.
 */
export type CategorySlug =
  | "vitamins"
  | "minerals"
  | "protein"
  | "gut-health"
  | "weight-management"
  | "sports-nutrition"
  | "general-nutrition";

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
};

export const categories: Category[] = [
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
];

export const categorySlugs = categories.map((c) => c.slug);

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryName(slug: string): string {
  return getCategory(slug)?.name ?? slug;
}
