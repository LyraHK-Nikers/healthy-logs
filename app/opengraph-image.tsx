import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { EMBLEM_DATA_URI } from "@/lib/brandMark";

/**
 * Branded social-share image (1200×630) via next/og.
 * Reuses the logo mark + brand colors so links unfurl on-brand.
 *
 * Edge runtime: the edge build of @vercel/og embeds its default font, which
 * avoids a Windows-only font-path crash in the node build at `next build`.
 */
export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSrc} width={84} height={84} alt="" />
          <div style={{ fontSize: 40, color: "#1C2140", fontWeight: 600 }}>
            Healthy Logs
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 70,
              color: "#1C2140",
              lineHeight: 1.05,
              maxWidth: 940,
            }}
          >
            Wellness you can actually trust.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 34 }}>
            <div style={{ width: 64, height: 6, background: "#8AA3FF", borderRadius: 3 }} />
            <div style={{ fontSize: 28, color: "#515979" }}>{siteConfig.tagline}</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
