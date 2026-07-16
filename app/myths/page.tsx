import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { MythGame } from "@/components/game/MythGame";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Nutrition myth or fact",
  description:
    "Can you tell nutrition myths from facts? Play our quick game and learn the evidence behind ten common claims.",
  path: "/myths",
});

export default function MythsPage() {
  return (
    <div className="mx-auto max-w-article px-5 py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Myth or fact" },
        ]}
      />

      <header className="mt-6 text-center">
        <p className="eyebrow">Play</p>
        <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
          Nutrition: myth or fact?
        </h1>
        <p className="mx-auto mt-3 max-w-md text-md text-ink-soft">
          Ten common claims. Guess each one, then see the evidence.
        </p>
      </header>

      <div className="mt-8">
        <MythGame />
      </div>
    </div>
  );
}
