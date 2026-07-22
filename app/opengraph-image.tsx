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

const MARK = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 40 40"><rect x="2" y="2" width="36" height="36" rx="10" fill="#FBFBF9" stroke="#2F6B4F" stroke-width="2"/><path d="M20 28C16.5 25.8 13 25.8 10 27L10 18C13 16.8 16.5 16.8 20 19Z" fill="#2F6B4F"/><path d="M20 28C23.5 25.8 27 25.8 30 27L30 18C27 16.8 23.5 16.8 20 19Z" fill="#2F6B4F"/><path d="M20 19V28" stroke="#FBFBF9" stroke-width="1" stroke-linecap="round"/><path d="M20 18.5V9.5" stroke="#2F6B4F" stroke-width="1.8" stroke-linecap="round"/><path d="M20 13C22.6 12.4 24.2 10.4 24 7.8C21.4 8.1 19.7 9.8 20 13Z" fill="#C9A24B"/><path d="M20 15.5C17.4 15 15.9 13.2 16 10.7C18.6 11 20.2 12.6 20 15.5Z" fill="#C9A24B"/></svg>`;

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
            Wellness you can actually trust.
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
