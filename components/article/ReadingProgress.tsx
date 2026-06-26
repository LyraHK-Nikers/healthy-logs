"use client";

import { useEffect, useState } from "react";

/**
 * Thin reading-progress bar pinned to the very top of the viewport.
 * A small, credible touch that helps orientation in long articles.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-0.5"
      role="presentation"
      aria-hidden="true"
    >
      <div
        className="h-full bg-accent"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
