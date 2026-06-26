import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

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

const MARK = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 40 40"><rect width="40" height="40" rx="11" fill="#2F6B4F"/><g transform="rotate(-8 20 19)"><path d="M20 7C26 11 26 20.5 20 27.5C14 20.5 14 11 20 7Z" fill="#FBFBF9"/><path d="M20 10.5V26" stroke="#2F6B4F" stroke-width="1.4" stroke-linecap="round"/><path d="M20 16.5L23.4 14" stroke="#2F6B4F" stroke-width="1.2" stroke-linecap="round"/><path d="M20 20.5L16.6 18" stroke="#2F6B4F" stroke-width="1.2" stroke-linecap="round"/></g><rect x="12.5" y="31" width="15" height="2.2" rx="1.1" fill="#C9A24B"/></svg>`;

export default function OpengraphImage() {
  // encodeURIComponent works in both node + edge runtimes (no Buffer/btoa).
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
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSrc} width={84} height={84} alt="" />
          <div style={{ fontSize: 40, color: "#1C2520", fontWeight: 600 }}>
            Healthy Logs
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 70,
              color: "#1C2520",
              lineHeight: 1.05,
              maxWidth: 940,
            }}
          >
            Nutrition you can actually trust.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 34 }}>
            <div style={{ width: 64, height: 6, background: "#C9A24B", borderRadius: 3 }} />
            <div style={{ fontSize: 28, color: "#4A554E" }}>{siteConfig.tagline}</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
