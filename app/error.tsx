"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route error boundary. Keeps a broken page from taking the whole app down and
 * gives the reader a way out. (App Router requires this to be a client component.)
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the console; wire to your error tracker (Sentry, etc.) later.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-article px-5 py-24 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-3 font-display text-2xl text-ink sm:text-3xl">
        This page hit a snag
      </h1>
      <p className="mt-4 text-ink-soft">
        Sorry about that. You can try again, or head back home.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-secondary">
          Back home
        </Link>
      </div>
    </div>
  );
}
