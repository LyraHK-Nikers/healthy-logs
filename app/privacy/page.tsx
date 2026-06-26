import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy policy",
  description:
    "What data Healthy Logs collects, how we use it, your rights under GDPR and CCPA, and how to contact us.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" notice>
      <p>
        This policy explains what information we collect, how we use it, and the
        choices you have. Before launch, generate the full text with a tool like
        Termly or iubenda once you know exactly which analytics, ad, and email
        tools you use.
      </p>

      <h2>Who we are</h2>
      <p>
        Healthy Logs ({siteConfig.url}) is a nutrition content publication. You
        can reach us at{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>

      <h2>What data we collect</h2>
      <ul>
        <li>
          Analytics data (e.g., pages visited, device and browser type) if and
          when an analytics provider is enabled.
        </li>
        <li>Cookies, as described below.</li>
        <li>
          Your email address, only if you choose to subscribe to a newsletter.
        </li>
        <li>Standard server logs.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To improve the site and understand what content is useful.</li>
        <li>To measure affiliate performance.</li>
        <li>To send newsletters, if you have opted in.</li>
      </ul>

      <h2>Cookies &amp; tracking</h2>
      <p>
        We may use analytics cookies (gated behind your consent — see the cookie
        banner) and affiliate cookies. Note that retailers such as Amazon set
        their own cookies when you click through an affiliate link; those are
        governed by the retailer&rsquo;s privacy policy.
      </p>

      <h2>Third parties</h2>
      <p>
        We may share data with service providers including the Amazon Associates
        program, analytics and ad networks (if enabled later), an email
        provider, and our hosting provider (Vercel). We do not sell your
        personal information.
      </p>

      <h2>Your rights</h2>
      <p>
        If you are in the EU/UK, you have rights under the GDPR including access,
        correction, deletion, and objection. If you are a California resident,
        you have rights under the CCPA. To exercise any right, contact us at{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>

      <h2>Data retention &amp; children&rsquo;s privacy</h2>
      <p>
        We retain data only as long as necessary for the purposes above. This
        site is not directed at children under 13 (or 16 in the EU), and we do
        not knowingly collect their data.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The date at the top of this
        page reflects the latest revision.
      </p>
    </LegalPage>
  );
}
