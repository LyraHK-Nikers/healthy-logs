"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Lightweight, dependency-free cookie consent banner (LEGAL_TEMPLATES.md).
 * Stores the choice in a first-party cookie for 180 days. Non-essential
 * scripts (analytics/ads) should be gated on `hl-consent=all` — read the
 * cookie before injecting any such script.
 *
 * EU/GDPR note: this is opt-IN for non-essential cookies (nothing fires until
 * the user clicks "Accept"). Replace with a vetted CMP before serious EU
 * traffic if you need granular categories and consent logging.
 */
const COOKIE_NAME = "hl-consent";

function setConsent(value: "all" | "essential") {
  const maxAge = 60 * 60 * 24 * 180; // 180 days
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasChoice = document.cookie
      .split("; ")
      .some((c) => c.startsWith(`${COOKIE_NAME}=`));
    if (!hasChoice) setVisible(true);
  }, []);

  if (!visible) return null;

  const choose = (value: "all" | "essential") => {
    setConsent(value);
    setVisible(false);
    // When you add analytics, initialize it here if value === "all".
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-container flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft">
          We use essential cookies to run the site, and optional analytics
          cookies to understand what&rsquo;s useful. See our{" "}
          <Link href="/privacy" className="text-accent link-underline">
            privacy policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="rounded-card border border-line px-4 py-2 text-sm text-ink-soft hover:border-accent hover:text-accent"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="rounded-card bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
