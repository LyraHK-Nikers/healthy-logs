import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Affiliate disclosure",
  description:
    "How Healthy Logs earns affiliate commissions, and our commitment that commissions never influence our editorial judgment.",
  path: "/disclosure",
});

export default function DisclosurePage() {
  return (
    <LegalPage title="Affiliate disclosure" notice>
      <p>
        Healthy Logs ({siteConfig.url}) is a reader-supported publication. Some
        of the links on this site are affiliate links, which means that if you
        click them and make a purchase, we may earn a commission — at no
        additional cost to you.
      </p>
      <p>
        We are a participant in the Amazon Services LLC Associates Program, an
        affiliate advertising program designed to provide a means for sites to
        earn advertising fees by advertising and linking to Amazon.com. We may
        also participate in other affiliate programs and earn commissions on
        qualifying purchases made through links to those retailers.
      </p>
      <p>
        Affiliate commissions never influence our editorial judgment. We
        recommend products based on research and our editorial standards, not on
        commission rates. Where we rank or compare products, our methodology is
        described in the article.
      </p>
    </LegalPage>
  );
}
