import { ImageResponse } from "next/og";
import { articleIndex } from "@/lib/articleIndex.generated";
import { getCategoryName } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { EMBLEM_DATA_URI } from "@/lib/brandMark";

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

export default function ArticleOgImage({
  params,
}: {
  params: { slug: string };
}) {
  const entry = articleIndex.find((e) => e.slug === params.slug);
  const title = entry?.title ?? siteConfig.name;
  const category = entry ? getCategoryName(entry.category).toUpperCase() : "";
  const markSrc = EMBLEM_DATA_URI;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F5F7FF",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSrc} width={64} height={64} alt="" />
          <div style={{ fontSize: 30, color: "#1C2140", fontWeight: 600 }}>
            Healthy Logs
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {category && (
            <div style={{ fontSize: 24, color: "#3448C8", letterSpacing: 3 }}>
              {category}
            </div>
          )}
          <div
            style={{
              fontSize: 60,
              color: "#1C2140",
              lineHeight: 1.1,
              marginTop: 16,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 6, background: "#8AA3FF", borderRadius: 3 }} />
          <div style={{ fontSize: 24, color: "#515979" }}>
            Evidence-based · expert-reviewed
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
