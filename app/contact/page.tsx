import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with the Healthy Logs team.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact"
      intro="Questions, corrections, or partnership enquiries — we'd love to hear from you."
      lastUpdated={false}
    >
      <p>
        The fastest way to reach us is by email:{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
      <ul>
        <li>
          <strong>Corrections:</strong> spotted something inaccurate? Tell us and
          we&rsquo;ll review it promptly (see our{" "}
          <a href="/editorial-policy">editorial policy</a>).
        </li>
        <li>
          <strong>Partnerships &amp; brands:</strong> we consider relationships
          that fit our editorial standards; commissions never affect our
          ratings.
        </li>
        <li>
          <strong>Press:</strong> reach out at the address above.
        </li>
      </ul>
      <p>
        Please note we cannot provide personal medical or dietary advice — see
        our <a href="/medical-disclaimer">medical disclaimer</a>.
      </p>
    </LegalPage>
  );
}
