import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/** PWA web manifest — makes the site installable with proper icons/colors. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Healthy Logs",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F5F7FF",
    theme_color: "#3448C8",
    icons: [
      { src: "/brand/healthy-logs-emblem-256.png", type: "image/png", sizes: "256x256" },
      { src: "/brand/healthy-logs-emblem-512.png", type: "image/png", sizes: "512x512" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
