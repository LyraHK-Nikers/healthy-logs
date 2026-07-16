import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SupplementQuiz } from "@/components/quiz/SupplementQuiz";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Find your supplement",
  description:
    "Answer three quick questions and get a research-backed supplement starting point, plus the guides to back it up. No account needed.",
  path: "/quiz",
});

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-article px-5 py-10">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Find your supplement" }]}
      />

      <header className="mt-6 text-center">
        <p className="eyebrow">Interactive</p>
        <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
          Find your supplement
        </h1>
        <p className="mx-auto mt-3 max-w-md text-md text-ink-soft">
          Three quick questions. No account, no jargon — just a research-backed
          place to start.
        </p>
      </header>

      <div className="mt-8">
        <SupplementQuiz />
      </div>
    </div>
  );
}
