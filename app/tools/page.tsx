import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ProteinCalculator } from "@/components/tools/ProteinCalculator";
import { HydrationCalculator } from "@/components/tools/HydrationCalculator";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free wellness tools",
  description:
    "Free, no-signup wellness tools: a protein calculator, a hydration calculator, a supplement finder quiz, and a myth-or-fact game.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-container px-5 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />

      <header className="mt-6">
        <p className="eyebrow">Interactive</p>
        <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
          Free wellness tools
        </h1>
        <p className="mt-3 max-w-xl text-md text-ink-soft">
          Quick, no-signup tools to help you make sense of the basics. All are a
          starting point, not medical advice.
        </p>
      </header>

      {/* calculators */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ProteinCalculator />
        <HydrationCalculator />
      </div>

      {/* the interactive pages */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Link
          href="/quiz"
          className="card card-hover group flex flex-col p-6"
          style={{ backgroundColor: "var(--accent-soft)" }}
        >
          <p className="eyebrow">Quiz</p>
          <h2 className="mt-1 font-display text-lg text-ink group-hover:text-accent">
            Find your supplement
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Three questions → a research-backed place to start.
          </p>
          <span className="mt-3 text-sm text-accent">Take the quiz →</span>
        </Link>

        <Link href="/myths" className="card card-hover group flex flex-col p-6">
          <p className="eyebrow">Game</p>
          <h2 className="mt-1 font-display text-lg text-ink group-hover:text-accent">
            Myth or fact?
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Ten common wellness claims. How many can you spot?
          </p>
          <span className="mt-3 text-sm text-accent">Play now →</span>
        </Link>
      </div>
    </div>
  );
}
