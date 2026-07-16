import type { MetadataRoute } from "next";
import { getAllArticles, getAllAuthors } from "@/lib/content";
import { categorySlugs } from "@/config/categories";
import { siteConfig } from "@/config/site";

/**
 * Auto-generated sitemap from all articles, categories, authors, and static
 * pages (SEO_REQUIREMENTS.md §3). Submit to Google Search Console.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticPages = [
    "",
    "/articles",
    "/quiz",
    "/about",
    "/contact",
    "/disclosure",
    "/medical-disclaimer",
    "/privacy",
    "/terms",
    "/editorial-policy",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.6,
  }));

  const articles = getAllArticles().map((a) => ({
    url: `${base}/articles/${a.frontmatter.slug}`,
    lastModified: new Date(a.frontmatter.updatedAt || a.frontmatter.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categories = categorySlugs.map((slug) => ({
    url: `${base}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const authors = getAllAuthors().map((a) => ({
    url: `${base}/authors/${a.frontmatter.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [...staticPages, ...articles, ...categories, ...authors];
}
