"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/layout/Logo";

/**
 * Global header. Wordmark in Fraunces; inline nav on desktop, a toggle menu on
 * mobile (closes on navigation). Quiet top rule echoes the "log" ruling.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navItems = [...siteConfig.nav, { label: "Search", href: "/search" }];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-container items-center justify-between gap-4 px-5 py-4">
        <Link href="/" aria-label={`${siteConfig.name} home`}>
          <Logo />
        </Link>

        {/* desktop nav */}
        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="flex items-center gap-5 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={
                    isActive(item.href)
                      ? "text-accent"
                      : "text-ink-soft link-underline hover:text-accent"
                  }
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* mobile toggle */}
        <button
          type="button"
          className="sm:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block text-2xl leading-none text-ink">
            {open ? "×" : "≡"}
          </span>
        </button>
      </div>

      {/* mobile nav */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-line sm:hidden"
        >
          <ul className="mx-auto flex max-w-container flex-col px-5 py-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={
                    isActive(item.href)
                      ? "block py-2.5 text-accent"
                      : "block py-2.5 text-ink-soft hover:text-accent"
                  }
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
