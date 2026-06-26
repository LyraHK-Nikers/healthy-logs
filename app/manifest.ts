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
    background_color: "#FBFBF9",
    theme_color: "#2F6B4F",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
