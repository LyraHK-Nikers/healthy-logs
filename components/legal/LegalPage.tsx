import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { siteConfig } from "@/config/site";

/**
 * Shared layout for legal + trust pages (LEGAL_TEMPLATES.md).
 * Renders a breadcrumb, title, optional "last updated" stamp, and an optional
 * "starter template, not legal advice" notice for the legal documents.
 */
export function LegalPage({
  title,
  intro,
  lastUpdated = true,
  notice = false,
  children,
}: {
  title: string;
  intro?: string;
  lastUpdated?: boolean;
  notice?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-article px-5 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />

      <header className="mt-6">
        <h1 className="font-display text-2xl text-ink sm:text-3xl">{title}</h1>
        {intro && <p className="mt-3 text-md text-ink-soft">{intro}</p>}
        {lastUpdated && (
          <p className="log-stamp mt-3">
            Last updated: {siteConfig.legalLastUpdated}
          </p>
        )}
      </header>

      {notice && (
        <p className="mt-6 rounded-card border border-line bg-accent-soft p-4 text-sm text-ink-soft">
          ⚠️ This is a starter template, not legal advice. Have it reviewed by a
          qualified professional before launch, and fill in any remaining
          placeholders.
        </p>
      )}

      <div className="prose mt-8">{children}</div>
    </div>
  );
}
