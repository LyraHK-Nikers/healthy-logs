import { ImageResponse } from "next/og";

/**
 * Apple touch icon (180×180 PNG) for iOS home screens.
 * Edge runtime + no text = no font dependency, builds cleanly on all platforms.
 */
export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const MARK = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 40 40"><rect x="2" y="2" width="36" height="36" rx="10" fill="#FBFBF9" stroke="#2F6B4F" stroke-width="2"/><path d="M20 28C16.5 25.8 13 25.8 10 27L10 18C13 16.8 16.5 16.8 20 19Z" fill="#2F6B4F"/><path d="M20 28C23.5 25.8 27 25.8 30 27L30 18C27 16.8 23.5 16.8 20 19Z" fill="#2F6B4F"/><path d="M20 19V28" stroke="#FBFBF9" stroke-width="1" stroke-linecap="round"/><path d="M20 18.5V9.5" stroke="#2F6B4F" stroke-width="1.8" stroke-linecap="round"/><path d="M20 13C22.6 12.4 24.2 10.4 24 7.8C21.4 8.1 19.7 9.8 20 13Z" fill="#C9A24B"/><path d="M20 15.5C17.4 15 15.9 13.2 16 10.7C18.6 11 20.2 12.6 20 15.5Z" fill="#C9A24B"/></svg>`;

export default function AppleIcon() {
  const src = `data:image/svg+xml,${encodeURIComponent(MARK)}`;
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBFBF9",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={150} height={150} alt="" />
      </div>
    ),
    { ...size },
  );
}
