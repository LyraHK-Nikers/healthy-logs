# Adding content to Healthy Logs

Everything is MDX files on disk — no CMS, no database. To publish, add a file and
deploy. This guide covers authors, articles, the affiliate components, and the
compliance rules that keep the site safe.

---

## 1. Add an author

Create `content/authors/<slug>.mdx`:

```mdx
---
name: "Jane Doe"
slug: "jane-doe"          # must match the filename
credentials: "MS, RD"     # shown next to the byline
role: "writer"            # "writer" | "reviewer"
placeholder: false        # set false for real people (true shows a dev warning)
bio: "One or two sentences. Real, verifiable background."
avatar: "/images/authors/jane.jpg"   # optional (initials shown until added)
links:
  linkedin: ""
  twitter: ""
---

Optional longer bio in Markdown here.
```

> Use real, credentialed people before launch. Named expertise is the ranking
> strategy for health content — invented credentials hurt more than they help.

---

## 2. Add an article

Create `content/articles/<slug>.mdx`. Two kinds: `informational` and `commercial`.

### Frontmatter reference

```mdx
---
title: "Magnesium Glycinate vs Citrate: Which Is Better for Sleep?"
slug: "magnesium-glycinate-vs-citrate"   # match filename; lowercase, hyphenated
excerpt: "One-line summary (≤155 chars) — used for cards + meta description."
category: "minerals"        # see config/categories.ts for the allowed list
type: "informational"       # "informational" | "commercial"
author: "jane-doe"          # an author slug
reviewer: "dr-smith-rd"     # optional reviewer slug → "Medically reviewed by…"
publishedAt: "2026-06-20"   # YYYY-MM-DD
updatedAt: "2026-06-25"     # bump when you revise → shows as the UPD stamp
heroImage: "/images/magnesium.jpg"   # optional
heroAlt: "Describe the image for screen readers + SEO"
tags: ["magnesium", "sleep"]
medicallyReviewed: true     # shows the reviewed badge + uses MedicalWebPage schema
featured: true              # surfaces it on the homepage
faq:                        # optional → renders an FAQ block + FAQPage schema
  - q: "Can you take magnesium every day?"
    a: "For most healthy adults, within recommended limits, yes…"
affiliateProducts:          # commercial only (see §3)
  - name: "Brand A Electrolyte Mix"
    asin: "B0XXXXXXXX"
    rating: 4.5
    price: "$24.99"
    pros: ["High sodium", "Third-party tested"]
    cons: ["Strong flavor"]
---

Body in MDX...
```

### What you get automatically

- The "log entry" header, byline, reviewer line, reading time, hero art.
- A table of contents from your `##`/`###` headings.
- Per-article social image, JSON-LD, sitemap entry, related articles.
- Commercial articles auto-show the FTC affiliate-disclosure banner.

---

## 3. Affiliate components (use in commercial article bodies)

The products in `affiliateProducts` are available in the body as `products`:

```mdx
<ProductComparison products={products} />
```

Or place a single card inline with literal props:

```mdx
<ProductCard
  name="Brand A Electrolyte Mix"
  asin="B0XXXXXXXX"
  rating={4.5}
  price="$24.99"
  pros={["High sodium", "Third-party tested"]}
  cons={["Strong flavor"]}
/>
```

For a one-off text link, use `<AffiliateLink asin="B0XXXXXXXX">see it on Amazon</AffiliateLink>`.

**Never paste an Amazon tracking tag or a raw store URL into an article.** All
links route through `AffiliateLink`, which adds `rel="sponsored nofollow noopener"`
and the tag from `config/affiliates.ts`, and cloaks the click via `/go/amazon/<asin>`.

---

## 4. Citations

Use Markdown footnotes — they render as a "References" section with clickable
back-links:

```md
Creatine is associated with strength gains. [^1]

[^1]: Author, Journal, Year. Link to PubMed/NIH/.gov/.edu.
```

Cite an authoritative source for every health claim.

---

## 5. Compliance (non-negotiable)

- **No disease claims.** Never say a food/supplement "treats", "cures", or
  "prevents" a disease. Use "may support", "is associated with".
- **Cite health claims** (§4).
- **State methodology** for any "best"/ranking — don't assert "best" without basis.
- Prices are manual; the cards show "Price may vary".

---

## 6. Publish

1. Add your `.mdx` file(s).
2. `npm run build` locally to check (regenerates the OG index automatically).
3. Commit and push — Vercel deploys. New article = one file.

Change the affiliate tag in `config/affiliates.ts`; categories in
`config/categories.ts`; site name/URL/nav in `config/site.ts`.
