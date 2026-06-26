import { getAllArticles } from "@/lib/content";
import { siteConfig } from "@/config/site";

/**
 * RSS 2.0 feed (Phase 7). Served at /feed.xml, prerendered as static.
 */
export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const base = siteConfig.url;
  const articles = getAllArticles();

  const items = articles
    .map((a) => {
      const fm = a.frontmatter;
      const url = `${base}/articles/${fm.slug}`;
      const pubDate = new Date(
        `${fm.publishedAt}T00:00:00Z`,
      ).toUTCString();
      return `    <item>
      <title>${escapeXml(fm.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(fm.excerpt)}</description>
      <category>${escapeXml(fm.category)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${base}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${base}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
