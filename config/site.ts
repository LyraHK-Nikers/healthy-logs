/**
 * Site-wide config — name, URL, nav, social.
 * Single source of truth for metadata defaults (SEO_REQUIREMENTS.md §1).
 */
export const siteConfig = {
  name: "Healthy Logs",
  tagline: "Evidence-based nutrition, logged and reviewed.",
  description:
    "Dietitian-reviewed nutrition guides and honest supplement comparisons. Every claim sourced, every author named.",
  // Update this to your production domain before launch.
  url: "https://www.healthylogs.com",
  ogImage: "/images/og-default.png",
  email: "hello@healthylogs.com",
  // Shown on legal pages; bump when you revise the policies.
  legalLastUpdated: "June 26, 2026",
  // Governing law for the Terms — REPLACE before launch.
  jurisdiction: "[your jurisdiction]",
  // Paste the token from Google Search Console (URL-prefix → HTML tag) to verify
  // ownership; leave empty to omit the tag.
  googleSiteVerification: "",
  social: {
    twitter: "",
    linkedin: "",
  },
  // Primary nav (header)
  nav: [
    { label: "Articles", href: "/articles" },
    { label: "About", href: "/about" },
    { label: "Editorial policy", href: "/editorial-policy" },
    { label: "Contact", href: "/contact" },
  ],
  // Footer legal links — required trust signal on YMYL sites (LEGAL_TEMPLATES.md)
  legalNav: [
    { label: "Affiliate disclosure", href: "/disclosure" },
    { label: "Medical disclaimer", href: "/medical-disclaimer" },
    { label: "Privacy policy", href: "/privacy" },
    { label: "Terms of use", href: "/terms" },
    { label: "Editorial policy", href: "/editorial-policy" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
