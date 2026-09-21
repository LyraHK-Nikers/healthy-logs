import Link from "next/link";
import { siteConfig } from "@/config/site";
import { LogoMark } from "@/components/layout/Logo";

/**
 * Global footer — deep navy, periwinkle accent. MUST link every legal/trust
 * page (siteConfig.footerNav) — itself an E-E-A-T signal Google looks for on
 * YMYL sites (LEGAL_TEMPLATES.md "Footer requirement").
 */
const linkClass =
  "text-footer-link hover:text-white hover:underline underline-offset-4 focus-visible:outline-footer-accent";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-footer-bg text-footer-text">
      <div className="mx-auto max-w-container px-5 pb-7 pt-14 text-[0.92rem]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-3 focus-visible:outline-footer-accent"
            >
              <LogoMark className="h-10 w-10" />
              <span className="font-display text-[1.75rem] leading-none text-white">
                Healthy <span className="italic text-footer-accent">Logs</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-base leading-relaxed">
              Wellness you can actually trust.
              <br />
              {siteConfig.description}
            </p>
          </div>

          {siteConfig.footerNav.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="mb-3.5 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-footer-muted">
                {col.title}
              </h2>
              <ul className="space-y-2">
                {col.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-11 grid gap-2 border-t border-footer-line pt-5 text-[0.8rem] leading-relaxed text-footer-muted">
          <p>
            The content on {siteConfig.name} is for informational purposes only
            and is not a substitute for professional medical advice, diagnosis,
            or treatment.{" "}
            <Link href="/medical-disclaimer" className={linkClass}>
              Read the full disclaimer
            </Link>
            .
          </p>
          <p>
            Some links on this site are affiliate links. If you buy through them,
            we may earn a small commission at no extra cost to you. As an Amazon
            Associate we earn from qualifying purchases.{" "}
            <Link href="/disclosure" className={linkClass}>
              Learn more
            </Link>
            .
          </p>
          <p>
            © {year} {siteConfig.name}. All rights reserved. ·{" "}
            <a href="/feed.xml" className={linkClass}>
              RSS
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
