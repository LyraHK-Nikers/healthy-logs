import { ImageResponse } from "next/og";

/**
 * Apple touch icon (180×180 PNG) for iOS home screens.
 * Edge runtime + no text = no font dependency, builds cleanly on all platforms.
 */
export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const MARK = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 40 40"><rect width="40" height="40" rx="11" fill="#2F6B4F"/><g transform="rotate(-8 20 19)"><path d="M20 7C26 11 26 20.5 20 27.5C14 20.5 14 11 20 7Z" fill="#FBFBF9"/><path d="M20 10.5V26" stroke="#2F6B4F" stroke-width="1.4" stroke-linecap="round"/><path d="M20 16.5L23.4 14" stroke="#2F6B4F" stroke-width="1.2" stroke-linecap="round"/><path d="M20 20.5L16.6 18" stroke="#2F6B4F" stroke-width="1.2" stroke-linecap="round"/></g><rect x="12.5" y="31" width="15" height="2.2" rx="1.1" fill="#C9A24B"/></svg>`;

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
