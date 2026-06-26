import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { siteConfig } from "@/config/site";

/* Typography roles — DESIGN_SYSTEM.md §Typography */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${siteConfig.url}/feed.xml` },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  // Add your Google Search Console token to config/site.ts to verify ownership.
  verification: siteConfig.googleSiteVerification
    ? { google: siteConfig.googleSiteVerification }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#2F6B4F",
};

// Flip to live by setting SITE_LIVE=true in the host's env vars, then redeploy.
// Default (unset) = the site stays behind the "coming soon" page.
const SITE_LIVE = process.env.SITE_LIVE === "true";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        {SITE_LIVE ? (
          <>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-card focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-white"
            >
              Skip to content
            </a>
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <CookieConsent />
          </>
        ) : (
          <ComingSoon />
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
