import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * robots.txt — allow all, point to the sitemap (SEO_REQUIREMENTS.md §3).
 * Nothing sensitive to disallow in v1.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // affiliate click-redirects — no SEO value, keep crawlers out
      disallow: ["/go/", "/search"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
