import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { getAllAuthors } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Who is behind Healthy Logs — our mission to publish calm, credible, evidence-based wellness and supplement content.",
  path: "/about",
});

export default function AboutPage() {
  const authors = getAllAuthors();

  return (
    <LegalPage
      title="About Healthy Logs"
      intro="Calm, credible, evidence-based wellness & supplements — logged and reviewed."
      lastUpdated={false}
    >
      <p>
        Healthy Logs exists to make wellness and supplement information
        trustworthy again. The
        web is full of supplement hype and thin affiliate pages; we do the
        opposite. Every article is framed as a research log — a dated, revisited
        entry — written by named authors, reviewed for accuracy, and grounded in
        peer-reviewed evidence.
      </p>

      <h2>What we believe</h2>
      <ul>
        <li>Evidence over hype. We cite our claims and avoid disease claims.</li>
        <li>
          Transparency over tricks. Affiliate relationships are disclosed; see
          our <Link href="/disclosure">affiliate disclosure</Link>.
        </li>
        <li>
          Usefulness over volume. We&rsquo;d rather publish fewer, better,
          reviewed articles than bulk content.
        </li>
      </ul>

      <h2>How we work</h2>
      <p>
        Read our <Link href="/editorial-policy">editorial policy</Link> for how
        we research, review, and update content. Remember that our content is
        information, not medical advice — see the{" "}
        <Link href="/medical-disclaimer">medical disclaimer</Link>.
      </p>

      <h2>The team</h2>
      <p>Our writers and reviewers (sample profiles during development):</p>
      <ul>
        {authors.map((a) => (
          <li key={a.frontmatter.slug}>
            <Link href={`/authors/${a.frontmatter.slug}`}>
              {a.frontmatter.name}
              {a.frontmatter.credentials
                ? `, ${a.frontmatter.credentials}`
                : ""}
            </Link>{" "}
            — {a.frontmatter.role === "reviewer" ? "Reviewer" : "Writer"}
          </li>
        ))}
      </ul>
    </LegalPage>
  );
}
