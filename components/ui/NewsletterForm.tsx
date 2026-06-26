"use client";

import { useState } from "react";

/**
 * Newsletter signup. Posts to /api/subscribe, which is provider-agnostic
 * (ConvertKit / Beehiiv / Mailchimp via env) and runs in demo mode until
 * configured. Accessible: labeled input, status announced via aria-live.
 */
type Status = "idle" | "loading" | "done" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("No spam. Unsubscribe anytime.");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("done");
      setEmail("");
      setMessage(
        data.demo
          ? "Thanks! (Demo mode — connect a provider to go live.)"
          : "Thanks for subscribing! Check your inbox to confirm.",
      );
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const done = status === "done";

  return (
    <div>
      <form
        onSubmit={submit}
        className="flex max-w-md flex-col gap-3 sm:flex-row"
        aria-label="Newsletter signup"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={status === "loading" || done}
          className="flex-1 rounded-card border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading" || done}
          className="rounded-card bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing…" : done ? "Subscribed ✓" : "Subscribe"}
        </button>
      </form>
      <p
        aria-live="polite"
        className={`log-stamp mt-3 ${status === "error" ? "text-ink-soft" : ""}`}
      >
        {message}
      </p>
    </div>
  );
}
