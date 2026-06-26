import { ImageResponse } from "next/og";
import { articleIndex } from "@/lib/articleIndex.generated";
import { getCategoryName } from "@/config/categories";
import { siteConfig } from "@/config/site";

/**
 * Per-article social-share image (1200×630) with the article's title + category.
 *
 * Edge runtime (no fs) — so it reads the build-generated articleIndex instead of
 * the MDX files. This also avoids the Windows-only @vercel/og node-build crash.
 */
export const runtime = "edge";
export const alt = "Healthy Logs article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MARK = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 40 40"><rect width="40" height="40" rx="11" fill="#2F6B4F"/><g transform="rotate(-8 20 19)"><path d="M20 7C26 11 26 20.5 20 27.5C14 20.5 14 11 20 7Z" fill="#FBFBF9"/><path d="M20 10.5V26" stroke="#2F6B4F" stroke-width="1.4" stroke-linecap="round"/><path d="M20 16.5L23.4 14" stroke="#2F6B4F" stroke-width="1.2" stroke-linecap="round"/><path d="M20 20.5L16.6 18" stroke="#2F6B4F" stroke-width="1.2" stroke-linecap="round"/></g><rect x="12.5" y="31" width="15" height="2.2" rx="1.1" fill="#C9A24B"/></svg>`;

export default function ArticleOgImage({
  params,
}: {
  params: { slug: string };
}) {
  const entry = articleIndex.find((e) => e.slug === params.slug);
  const title = entry?.title ?? siteConfig.name;
  const category = entry ? getCategoryName(entry.category).toUpperCase() : "";
  const markSrc = `data:image/svg+xml,${encodeURIComponent(MARK)}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FBFBF9",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSrc} width={64} height={64} alt="" />
          <div style={{ fontSize: 30, color: "#1C2520", fontWeight: 600 }}>
            Healthy Logs
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {category && (
            <div style={{ fontSize: 24, color: "#2F6B4F", letterSpacing: 3 }}>
              {category}
            </div>
          )}
          <div
            style={{
              fontSize: 60,
              color: "#1C2520",
              lineHeight: 1.1,
              marginTop: 16,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 6, background: "#C9A24B", borderRadius: 3 }} />
          <div style={{ fontSize: 24, color: "#4A554E" }}>
            Evidence-based · dietitian-reviewed
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
