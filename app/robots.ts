import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * robots.txt — allow all, point to the sitemap (SEO_REQUIREMENTS.md §3).
 * Nothing sensitive to disallow in v1.
 */
export default function robots(): MetadataRoute.Robots {
  // While the site is in "coming soon" mode, block all crawling.
  if (process.env.SITE_LIVE !== "true") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // affiliate redirects, search, and admin — no SEO value, keep crawlers out
      disallow: ["/go/", "/search", "/admin", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
