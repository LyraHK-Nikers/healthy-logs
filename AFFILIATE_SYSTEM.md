# Healthy Logs — Affiliate System Spec

> This is the money engine. Build it so links are compliant by default and tags live in ONE
> place. The single biggest mistake affiliate sites make is hardcoding tracking tags and
> forgetting `rel` attributes — both are solved structurally here.

## 1. Central affiliate config — `config/affiliates.ts`

```ts
export const AFFILIATE = {
  amazon: {
    // Your Amazon Associates tracking tag. Change here, applies everywhere.
    trackingTag: "healthylogs-20",
    domain: "https://www.amazon.com",
  },
  // Add brand-direct / network programs as you sign up:
  // iherb: { template: "https://www.iherb.com/pr/{id}?rcode=XXXX" },
};

// Build a final Amazon URL from an ASIN.
export function amazonUrl(asin: string): string {
  return `${AFFILIATE.amazon.domain}/dp/${asin}?tag=${AFFILIATE.amazon.trackingTag}`;
}

// Generic resolver used by product frontmatter.
export function resolveAffiliateUrl(p: {
  asin?: string;
  affiliateUrl?: string;
}): string {
  if (p.asin) return amazonUrl(p.asin);
  if (p.affiliateUrl) return p.affiliateUrl;
  return "#";
}
```

## 2. The only outbound-link component — `components/affiliate/AffiliateLink.tsx`

Every external product/store link MUST go through this. It guarantees compliance.

```tsx
import { resolveAffiliateUrl } from "@/config/affiliates";

type Props = {
  asin?: string;
  url?: string;
  children: React.ReactNode;
  className?: string;
};

export function AffiliateLink({ asin, url, children, className }: Props) {
  const href = resolveAffiliateUrl({ asin, affiliateUrl: url });
  return (
    <a
      href={href}
      target="_blank"
      // sponsored + nofollow = Google compliant; noopener = security
      rel="sponsored nofollow noopener"
      className={className}
      data-affiliate="true"            // hook for analytics
    >
      {children}
    </a>
  );
}
```

**Rule:** No raw `<a>` to an external store anywhere else. (Add an ESLint custom rule or at
minimum a code-review checklist item.)

## 3. Auto disclosure on commercial articles

`components/article/AffiliateDisclosure.tsx` renders this banner. The article template checks
`frontmatter.type === "commercial"` (or `affiliateProducts` present) and injects it ABOVE the
content automatically — never relying on the writer to remember.

Banner copy (FTC-compliant, plain language):

> **Disclosure:** Healthy Logs is reader-supported. When you buy through links on our site, we
> may earn an affiliate commission at no extra cost to you. This never affects which products we
> recommend or how we rate them. [Learn more](/disclosure)

## 4. Product components

- `ProductCard` — single product: image, name, brass star rating, price (mono), pros (green ✓),
  cons (slate –), and a "Check price" button that is an `AffiliateLink`.
- `ProductComparison` — table/grid of multiple products for roundups; same compliance routing.

These are exposed as MDX components so writers use them in `.mdx` like:

```mdx
<ProductCard
  name="Brand X Magnesium Glycinate"
  asin="B0XXXXXXX"
  rating={4.5}
  price="$24.99"
  pros={["High absorption", "Third-party tested"]}
  cons={["Pricier than citrate"]}
/>
```

## 5. Monetization roadmap (informational — for the owner, not code)

Phase your revenue, don't expect day-one income:

1. **Amazon Associates** — easiest to get in, low commission (health ~1–4%), but huge catalog
   and high trust = high conversion. Start here. Note: you must make a qualifying sale within
   180 days of approval or the account is closed.
2. **Brand-direct programs** — iHerb, Thorne, Transparent Labs, Vitacost, etc. Higher commission
   (10–30%). Apply once you have published content + traffic.
3. **Affiliate networks** — Impact, ShareASale, CJ Affiliate, Awin. Aggregate many brands.
4. **Display ads (later)** — once traffic is real: Google AdSense early, then Mediavine
   (~50k sessions/mo) or Raptive/AdThrive (~100k) for much higher RPMs.
5. **Own products (much later)** — ebooks, meal plans, a newsletter sponsorship.

## 6. Compliance guardrails baked into the build

- `rel="sponsored nofollow"` on 100% of affiliate links (Google requirement since 2019).
- FTC disclosure visible BEFORE the first affiliate link on every commercial page.
- A persistent `/disclosure` page linked in the footer.
- No price scraping promises — prices in frontmatter are manual and may be marked "as of [date]";
  consider a "prices may vary" note near product cards.
- Never auto-claim "best" without basis — roundup methodology should be stated (see
  CONTENT_STRATEGY.md).
