/**
 * Site-wide config — name, URL, nav, social.
 * Single source of truth for metadata defaults (SEO_REQUIREMENTS.md §1).
 */
export const siteConfig = {
  name: "Healthy Logs",
  tagline: "Evidence-based wellness & supplements, logged and reviewed.",
  description:
    "Expert-reviewed wellness guides and honest supplement comparisons.",
  // Production domain (apex). If you serve on www instead, change to
  // "https://www.healthylogs.com" and set up the redirect in Hostinger.
  url: "https://healthylogs.com",
  ogImage: "/images/og-default.png",
  email: "contact@healthylogs.com",
  // Shown on legal pages; bump when you revise the policies.
  legalLastUpdated: "June 26, 2026",
  // Governing law for the Terms. TODO: name the state, e.g. "the State of Texas, United States".
  jurisdiction: "the United States",
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
    { label: "Tools", href: "/tools" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  // Footer columns. Every legal/trust page must stay linked here — a required
  // trust signal on YMYL sites (LEGAL_TEMPLATES.md).
  footerNav: [
    {
      title: "Explore",
      links: [
        { label: "All articles", href: "/articles" },
        { label: "Find your supplement", href: "/quiz" },
        { label: "Free tools", href: "/tools" },
        { label: "Myth or fact?", href: "/myths" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "About Healthy Logs", href: "/about" },
        { label: "Editorial policy", href: "/editorial-policy" },
        { label: "Contact", href: "/contact" },
        { label: "Search", href: "/search" },
      ],
    },
    {
      title: "Policies",
      links: [
        { label: "Affiliate disclosure", href: "/disclosure" },
        { label: "Privacy policy", href: "/privacy" },
        { label: "Terms of use", href: "/terms" },
        { label: "Medical disclaimer", href: "/medical-disclaimer" },
      ],
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
