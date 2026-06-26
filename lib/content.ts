import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import type { CategorySlug } from "@/config/categories";

/**
 * Content pipeline (ARCHITECTURE.md §"Content pipeline").
 * Reads MDX files on disk with gray-matter. All functions run at build time
 * (Server Components / generateStaticParams) — no runtime DB calls.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");
const ARTICLES_DIR = path.join(CONTENT_DIR, "articles");
const AUTHORS_DIR = path.join(CONTENT_DIR, "authors");

export type ArticleType = "informational" | "commercial";

export type AffiliateProduct = {
  name: string;
  asin?: string;
  rating?: number;
  price?: string;
  pros?: string[];
  cons?: string[];
  affiliateUrl?: string;
};

export type FaqItem = { q: string; a: string };

export type ArticleFrontmatter = {
  title: string;
  slug: string;
  excerpt: string;
  category: CategorySlug;
  type: ArticleType;
  author: string;
  reviewer?: string;
  publishedAt: string;
  updatedAt: string;
  heroImage?: string;
  heroAlt?: string;
  tags?: string[];
  affiliateProducts?: AffiliateProduct[];
  faq?: FaqItem[];
  medicallyReviewed?: boolean;
  featured?: boolean;
};

export type Article = {
  frontmatter: ArticleFrontmatter;
  /** raw MDX body (frontmatter stripped) */
  content: string;
};

export type AuthorFrontmatter = {
  name: string;
  slug: string;
  credentials?: string;
  bio: string;
  avatar?: string;
  role?: "writer" | "reviewer";
  /** clearly mark placeholder/sample authors (PROJECT_BRIEF.md §6.6) */
  placeholder?: boolean;
  links?: {
    linkedin?: string;
    twitter?: string;
  };
};

export type Author = {
  frontmatter: AuthorFrontmatter;
  content: string;
};

// ---------------------------------------------------------------------------
// internal helpers
// ---------------------------------------------------------------------------

function listMdx(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
}

function readArticleFile(fileName: string): Article {
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  const fm = data as ArticleFrontmatter;
  // Fall back to the filename for the slug if not set in frontmatter.
  if (!fm.slug) fm.slug = fileName.replace(/\.mdx$/, "");
  return { frontmatter: fm, content };
}

function readAuthorFile(fileName: string): Author {
  const raw = fs.readFileSync(path.join(AUTHORS_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  const fm = data as AuthorFrontmatter;
  if (!fm.slug) fm.slug = fileName.replace(/\.mdx$/, "");
  return { frontmatter: fm, content };
}

// ---------------------------------------------------------------------------
// articles
// ---------------------------------------------------------------------------

/** All articles, sorted by publishedAt desc. */
export function getAllArticles(): Article[] {
  return listMdx(ARTICLES_DIR)
    .map(readArticleFile)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime(),
    );
}

export function getArticleBySlug(slug: string): Article | null {
  const file = `${slug}.mdx`;
  if (!fs.existsSync(path.join(ARTICLES_DIR, file))) {
    // slug may differ from filename — fall back to a scan
    const match = getAllArticles().find((a) => a.frontmatter.slug === slug);
    return match ?? null;
  }
  return readArticleFile(file);
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter((a) => a.frontmatter.category === category);
}

export function getArticlesByAuthor(authorSlug: string): Article[] {
  return getAllArticles().filter(
    (a) =>
      a.frontmatter.author === authorSlug ||
      a.frontmatter.reviewer === authorSlug,
  );
}

export function getFeaturedArticles(limit = 3): Article[] {
  const all = getAllArticles();
  const featured = all.filter((a) => a.frontmatter.featured);
  // Fall back to most-recent if none are explicitly featured.
  return (featured.length ? featured : all).slice(0, limit);
}

export function getAllSlugs(): string[] {
  return getAllArticles().map((a) => a.frontmatter.slug);
}

/**
 * Related articles for internal linking / topical clusters (SEO_REQUIREMENTS.md
 * §3). Ranks others by same-category, then shared tags; excludes the current one.
 */
export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const all = getAllArticles();
  const current = all.find((a) => a.frontmatter.slug === slug);
  if (!current) return [];
  const currentTags = new Set(current.frontmatter.tags ?? []);

  return all
    .filter((a) => a.frontmatter.slug !== slug)
    .map((a) => {
      let score = 0;
      if (a.frontmatter.category === current.frontmatter.category) score += 2;
      score += (a.frontmatter.tags ?? []).filter((t) =>
        currentTags.has(t),
      ).length;
      return { article: a, score };
    })
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.article);
}

// ---------------------------------------------------------------------------
// authors
// ---------------------------------------------------------------------------

export function getAllAuthors(): Author[] {
  return listMdx(AUTHORS_DIR).map(readAuthorFile);
}

export function getAuthorBySlug(slug: string): Author | null {
  const file = `${slug}.mdx`;
  if (!fs.existsSync(path.join(AUTHORS_DIR, file))) {
    const match = getAllAuthors().find((a) => a.frontmatter.slug === slug);
    return match ?? null;
  }
  return readAuthorFile(file);
}

// ---------------------------------------------------------------------------
// table of contents
// ---------------------------------------------------------------------------

export type Heading = { level: 2 | 3; text: string; id: string };

/**
 * Extract h2/h3 headings from raw MDX for the Table of Contents.
 * Uses github-slugger so the generated ids match rehype-slug's output exactly
 * (so TOC anchor links resolve to the rendered heading ids).
 */
export function extractHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  // Strip fenced code blocks so "# inside code" isn't treated as a heading.
  const withoutCode = content.replace(/```[\s\S]*?```/g, "");
  const lines = withoutCode.split("\n");
  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const level = match[1].length as 2 | 3;
    // strip basic inline markdown (links, emphasis, code) from the label
    const text = match[2]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim();
    headings.push({ level, text, id: slugger.slug(text) });
  }
  return headings;
}
