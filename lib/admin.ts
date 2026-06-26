import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import mammoth from "mammoth";
import TurndownService from "turndown";

/**
 * Server-only helpers for the /admin article uploader.
 * Auth is a password gate (ADMIN_PASSWORD); publishing commits an .mdx file to
 * GitHub (GITHUB_TOKEN/GITHUB_REPO), which triggers the host's auto-deploy.
 */

export const ADMIN_COOKIE = "hl_admin";

function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

/** Cookie value set on a successful login (derived from the credentials). */
export function adminToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  const user = process.env.ADMIN_USERNAME || "";
  return sha256(`hl-admin::${user}::${pw}`);
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function constantEquals(a: string, b: string): boolean {
  const ba = Buffer.from(sha256(a));
  const bb = Buffer.from(sha256(b));
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/**
 * Constant-time credentials check. Password is always required; the username is
 * only enforced if ADMIN_USERNAME is set (so a password-only setup still works).
 */
export function credentialsMatch(username: string, password: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const pwOk = constantEquals(password, pw);
  const expectedUser = process.env.ADMIN_USERNAME;
  const userOk = expectedUser ? constantEquals(username, expectedUser) : true;
  return pwOk && userOk;
}

/** Verify a request cookie value against the expected admin token. */
export function isAuthed(cookieValue: string | undefined): boolean {
  const token = adminToken();
  if (!token || !cookieValue) return false;
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function slugify(text: string): string {
  return new GithubSlugger().slug(text);
}

// ---------------------------------------------------------------------------
// parsing
// ---------------------------------------------------------------------------

export type ParsedDoc = { title: string | null; body: string };

/** Turn an uploaded .docx / .md / .txt buffer into a title + markdown body. */
export async function parseUpload(
  filename: string,
  buffer: Buffer,
): Promise<ParsedDoc> {
  const lower = filename.toLowerCase();
  let markdown: string;

  if (lower.endsWith(".docx")) {
    const { value: html } = await mammoth.convertToHtml({ buffer });
    const td = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
    });
    markdown = td.turndown(html);
  } else {
    // .md / .markdown / .txt — already text
    markdown = buffer.toString("utf8");
  }

  markdown = markdown.replace(/\r\n/g, "\n").trim();

  // Pull the first H1 as the title and drop it from the body (the article
  // template renders the title separately).
  let title: string | null = null;
  const h1 = markdown.match(/^#\s+(.+)$/m);
  if (h1) {
    title = h1[1].trim();
    markdown = markdown.replace(/^#\s+.+$/m, "").trim();
  }

  return { title, body: markdown };
}

/** First readable sentence/paragraph, stripped of markdown, for the excerpt. */
export function deriveExcerpt(body: string, max = 155): string {
  const firstPara =
    body
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .find((p) => p && !p.startsWith("#") && !p.startsWith("<")) ?? "";
  const plain = firstPara
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? `${plain.slice(0, max - 1).trim()}…` : plain;
}

// ---------------------------------------------------------------------------
// build + commit
// ---------------------------------------------------------------------------

export type ArticleFields = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  type: "informational" | "commercial";
  author: string;
  reviewer?: string;
  tags: string[];
  featured: boolean;
  body: string;
  heroImage?: string;
  heroAlt?: string;
  publishedAt?: string; // preserved when editing; defaults to today
};

export function buildMdx(f: ArticleFields): string {
  const today = new Date().toISOString().slice(0, 10);
  const data: Record<string, unknown> = {
    title: f.title,
    slug: f.slug,
    excerpt: f.excerpt,
    category: f.category,
    type: f.type,
    author: f.author,
    publishedAt: f.publishedAt || today,
    updatedAt: today,
    tags: f.tags,
    medicallyReviewed: true,
    featured: f.featured,
  };
  if (f.reviewer) data.reviewer = f.reviewer;
  if (f.heroImage) {
    data.heroImage = f.heroImage;
    data.heroAlt = f.heroAlt || f.title;
  }
  return matter.stringify(`\n${f.body}\n`, data);
}

// --- GitHub commit helpers ---

function gh() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO; // "owner/name"
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) return null;
  const [owner, name] = repo.split("/");
  return { token, owner, name, branch };
}

export function ghConfigured(): boolean {
  return gh() !== null;
}

/** Create/update any file in the repo via the contents API; returns its URL. */
async function commitFile(
  path: string,
  base64: string,
  message: string,
): Promise<string | undefined> {
  const g = gh();
  if (!g) throw new Error("GitHub not configured");
  const apiBase = `https://api.github.com/repos/${g.owner}/${g.name}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${g.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "healthy-logs-admin",
  };
  let sha: string | undefined;
  const getRes = await fetch(`${apiBase}?ref=${g.branch}`, { headers });
  if (getRes.ok) sha = (await getRes.json()).sha;

  const putRes = await fetch(apiBase, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message,
      content: base64,
      branch: g.branch,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!putRes.ok) {
    const detail = await putRes.text();
    throw new Error(`GitHub commit failed (${putRes.status}): ${detail.slice(0, 200)}`);
  }
  const json = await putRes.json();
  return json.content?.html_url ?? json.commit?.html_url;
}

/** Commit a hero image to public/images/articles and return its public path. */
export async function commitImage(
  slug: string,
  ext: string,
  buffer: Buffer,
): Promise<string> {
  const path = `public/images/articles/${slug}.${ext}`;
  await commitFile(path, buffer.toString("base64"), `Add hero image for ${slug}`);
  return `/images/articles/${slug}.${ext}`;
}

export type CommitResult = {
  committed: boolean;
  path: string;
  url?: string;
  preview?: string;
};

/** Commit (create/update) the article .mdx file. Dry-run if GitHub unset. */
export async function commitArticle(
  slug: string,
  mdx: string,
): Promise<CommitResult> {
  const path = `content/articles/${slug}.mdx`;
  if (!ghConfigured()) return { committed: false, path, preview: mdx };
  const url = await commitFile(
    path,
    Buffer.from(mdx, "utf8").toString("base64"),
    `Publish article: ${slug}`,
  );
  return { committed: true, path, url };
}
