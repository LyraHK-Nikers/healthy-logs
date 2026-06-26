import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/layout/Logo";

/**
 * Global footer. MUST link every legal/trust page — itself an E-E-A-T signal
 * Google looks for on YMYL sites (LEGAL_TEMPLATES.md "Footer requirement").
 */
export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto max-w-container px-5 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <Logo showSuffix={false} />
            <p className="mt-3 text-sm text-ink-soft">{siteConfig.tagline}</p>
            <p className="mt-4 text-xs text-ink-soft">
              Information only — not medical advice. See our{" "}
              <Link href="/medical-disclaimer" className="text-accent link-underline">
                medical disclaimer
              </Link>
              .
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="eyebrow mb-3">Site</h2>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {siteConfig.legalNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink-soft link-underline hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 rule flex flex-col gap-3 pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <span className="log-stamp">2026</span> {siteConfig.name}. As an
            Amazon Associate we earn from qualifying purchases. See our{" "}
            <Link href="/disclosure" className="text-accent link-underline">
              affiliate disclosure
            </Link>
            .
          </p>
          <div className="flex gap-4">
            <Link href="/search" className="link-underline hover:text-accent">
              Search
            </Link>
            <a href="/feed.xml" className="link-underline hover:text-accent">
              RSS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
