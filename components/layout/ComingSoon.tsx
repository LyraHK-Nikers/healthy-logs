import { Logo } from "@/components/layout/Logo";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

/**
 * Pre-launch holding page. Shown for every route while the site is not live
 * (SITE_LIVE !== "true"). Captures emails so the wait still grows the list.
 * Gated in app/layout.tsx; flip SITE_LIVE=true (+ redeploy) to go live.
 */
export function ComingSoon() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div className="notebook-lines absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative">
        <div className="flex justify-center">
          <Logo markClassName="h-12 w-12" showSuffix={false} />
        </div>

        <p className="eyebrow mt-8">Launching soon</p>
        <h1 className="mt-3 max-w-2xl font-display text-2xl leading-tight text-ink sm:text-3xl">
          Wellness you can actually trust — almost ready.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-md text-ink-soft">
          We&rsquo;re putting the finishing touches on Healthy Logs. Leave your
          email and we&rsquo;ll tell you the moment it&rsquo;s live.
        </p>

        <div className="mx-auto mt-8 w-full max-w-md text-left">
          <NewsletterForm />
        </div>

        <p className="log-stamp mt-10">LOG 2026 · dietitian-reviewed wellness</p>
      </div>
    </div>
  );
}
