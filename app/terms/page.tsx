import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms of use",
  description:
    "The terms governing your use of Healthy Logs, including intellectual property, disclaimers, and limitation of liability.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" notice>
      <h2>Acceptance of terms</h2>
      <p>
        By accessing or using Healthy Logs, you agree to these Terms of Use. If
        you do not agree, please do not use the site.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All content on this site is owned by Healthy Logs or its licensors and
        is protected by copyright. You may not scrape, republish, or
        redistribute our content without permission.
      </p>

      <h2>Acceptable use</h2>
      <p>
        You agree not to use the site in any way that is unlawful or that could
        damage, disable, or impair the site.
      </p>

      <h2>Disclaimer of warranties</h2>
      <p>
        The information on this site is provided &ldquo;as is&rdquo; without
        warranties of any kind. See also our{" "}
        <a href="/medical-disclaimer">medical disclaimer</a>.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Healthy Logs is not liable for
        any damages arising from your use of, or reliance on, the site.
      </p>

      <h2>Affiliate relationships &amp; external links</h2>
      <p>
        This site contains affiliate links and links to third-party websites.
        See our <a href="/disclosure">affiliate disclosure</a>. We are not
        responsible for the content or practices of external sites.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of {siteConfig.jurisdiction}.
      </p>

      <h2>Changes &amp; contact</h2>
      <p>
        We may update these terms from time to time. Questions? Contact us at{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
    </LegalPage>
  );
}
