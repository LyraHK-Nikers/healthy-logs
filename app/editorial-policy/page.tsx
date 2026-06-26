import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Editorial policy",
  description:
    "How Healthy Logs chooses topics, researches and reviews content, updates articles, and handles product recommendations.",
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <LegalPage
      title="Editorial policy"
      intro="How we research, write, review, and update our content — and how we handle product recommendations."
      lastUpdated
    >
      <h2>How we choose topics</h2>
      <p>
        We write about nutrition questions real people are asking, prioritizing
        topics where clear, evidence-based information is genuinely useful and
        where misinformation is common.
      </p>

      <h2>Our research standards</h2>
      <p>
        We base our content on high-quality evidence: peer-reviewed studies,
        systematic reviews, and authoritative sources such as the NIH Office of
        Dietary Supplements and other .gov/.edu references. Health claims are
        cited, and we use compliant, non-sensational language — we never claim a
        food or supplement can &ldquo;treat,&rdquo; &ldquo;cure,&rdquo; or
        &ldquo;prevent&rdquo; a disease.
      </p>

      <h2>Who writes and who reviews</h2>
      <p>
        Articles are written by named authors and, where appropriate, reviewed
        by a qualified reviewer whose byline appears near the top of the
        article. You can see who is behind the site on our{" "}
        <a href="/about">about page</a> and on each author&rsquo;s profile.
      </p>

      <h2>How and how often we update</h2>
      <p>
        Our content is modeled as a research log: each article shows when it was
        first published and when it was last updated. We revisit articles as new
        evidence emerges, and the &ldquo;UPD&rdquo; date reflects the most recent
        meaningful revision.
      </p>

      <h2>Product recommendations &amp; affiliates</h2>
      <p>
        Some articles contain affiliate links, disclosed clearly on every
        commercial page and on our{" "}
        <a href="/disclosure">affiliate disclosure</a> page. Commissions never
        influence our ratings or recommendations, and any ranking states its
        methodology.
      </p>

      <h2>Corrections</h2>
      <p>
        Found an error? Email us at{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> and
        we&rsquo;ll review and correct it promptly.
      </p>
    </LegalPage>
  );
}
