# Healthy Logs — Project Brief for Claude Code

> Paste this whole file (plus the other files in this folder) into Claude Code as the project spec.
> Build it phase by phase. Do not skip the legal/SEO scaffolding — it is the point.

---

## 1. What we're building

**Healthy Logs** is a nutrition-focused content website that earns revenue through affiliate
marketing. It publishes two kinds of content:

1. **Informational articles** — evidence-based nutrition guides ("Is creatine safe for women?",
   "Magnesium glycinate vs citrate"). These build trust and topical authority.
2. **Commercial articles** — product roundups and reviews ("Best electrolyte powders") that
   contain affiliate links.

The site is NOT a thin affiliate farm. Every health claim is sourced, every author is named and
credentialed, and a reviewer byline signals editorial review. This is a deliberate response to
Google's Helpful Content updates, which have penalized low-trust affiliate sites.

**Brand personality:** clean, calm, credible. Think "a registered dietitian's notebook," not a
flashy supplement-bro store. The name "Logs" is the hook — content is framed as researched,
dated, revisited entries, not evergreen sales pages.

---

## 2. Tech stack (chosen for low cost + easy maintenance)

- **Next.js 14 (App Router)** + **TypeScript**
- **Content as MDX files** on disk (no database needed for v1 — keeps hosting free/cheap and
  makes Claude Code able to generate content directly). Use `contentlayer` or a custom
  `gray-matter` + `next-mdx-remote` pipeline.
- **Tailwind CSS** for styling
- **Deploy target:** Vercel (free tier works to start)
- No auth, no user accounts, no e-commerce in v1.

Why no DB: a nutrition content site is read-only for visitors. Files-on-disk + static generation
is faster, cheaper, more SEO-friendly, and far simpler than Supabase/Postgres for this use case.
Add a DB later only if you build newsletter signups with stored data or a comment system.

---

## 3. Core data model (frontmatter schema)

Every article is an `.mdx` file in `/content/articles/` with this frontmatter:

```yaml
title: "Magnesium Glycinate vs Citrate: Which Is Better for Sleep?"
slug: "magnesium-glycinate-vs-citrate"
excerpt: "A dietitian-reviewed comparison of the two most popular magnesium forms."
category: "minerals"            # see taxonomy below
type: "informational"           # "informational" | "commercial"
author: "jane-doe"              # references /content/authors/jane-doe.mdx
reviewer: "dr-smith-rd"         # optional; references an author with credentials
publishedAt: "2026-06-25"
updatedAt: "2026-06-25"
heroImage: "/images/magnesium.jpg"
heroAlt: "Two bottles of magnesium supplements on a wooden table"
tags: ["magnesium", "sleep", "minerals"]
affiliateProducts:              # only for type: commercial
  - name: "Brand X Magnesium Glycinate"
    asin: "B0XXXXXXX"           # Amazon, or use a generic affiliate URL
    rating: 4.5
    price: "$24.99"
    pros: ["High absorption", "Third-party tested"]
    cons: ["Pricier than citrate"]
    affiliateUrl: ""            # filled at build via affiliate config
faq:                            # optional, renders FAQ schema for SEO
  - q: "Can you take magnesium every day?"
    a: "For most healthy adults, yes, within recommended limits..."
medicallyReviewed: true
```

**Author** files (`/content/authors/jane-doe.mdx`):
```yaml
name: "Jane Doe"
slug: "jane-doe"
credentials: "MS, RD"           # shown next to byline
bio: "Jane is a registered dietitian with 8 years..."
avatar: "/images/authors/jane.jpg"
links:
  linkedin: ""
  twitter: ""
```

**Taxonomy (categories):** `vitamins`, `minerals`, `protein`, `gut-health`,
`weight-management`, `sports-nutrition`, `general-nutrition`. Make this a config array so it's
editable in one place.

---

## 4. Pages / routes to build

| Route | Purpose |
|---|---|
| `/` | Homepage — hero, featured articles, category grid, newsletter CTA |
| `/articles` | All articles, paginated, filterable by category |
| `/articles/[slug]` | Single article (the core template) |
| `/category/[category]` | Category landing page |
| `/authors/[slug]` | Author profile + their articles (E-E-A-T signal) |
| `/about` | Who we are, editorial process, why trust us |
| `/contact` | Simple contact (mailto or form) |
| `/disclosure` | **Affiliate disclosure** (FTC-required) |
| `/medical-disclaimer` | **Medical disclaimer** |
| `/privacy` | Privacy policy |
| `/terms` | Terms of use |
| `/editorial-policy` | How content is researched + reviewed (trust signal) |

---

## 5. Build phases (do these in order)

### Phase 1 — Scaffolding
- Init Next.js 14 + TS + Tailwind. Set up the folder structure (see ARCHITECTURE.md).
- Build the MDX content pipeline (gray-matter + next-mdx-remote, or contentlayer).
- Create 2 sample authors and 3 sample articles (2 informational, 1 commercial) so there's
  real content to render.
- Confirm `npm run dev` serves the homepage on port 3000.

### Phase 2 — Core templates
- Article template (`/articles/[slug]`) with byline, reviewer line, publish/update dates,
  table of contents, body, citations section, FAQ block.
- Homepage, /articles index, category pages, author pages.
- Global header + footer (footer must link all legal pages).

### Phase 3 — Affiliate system
- A `<ProductCard>` and `<ProductComparison>` MDX component.
- Central affiliate config (`/config/affiliates.ts`) that maps an ASIN or product key to a
  final affiliate URL with the tracking tag appended in ONE place. Never hardcode tracking
  tags in content.
- Auto-inject `rel="sponsored nofollow"` on all affiliate links (required by Google + FTC best
  practice).
- An automatic disclosure banner that renders at the top of any `type: commercial` article.

### Phase 4 — Legal + trust pages
- Generate all pages in section 4's legal block from the templates in LEGAL_TEMPLATES.md.
- Cookie consent banner (use `vanilla-cookieconsent` or a small custom one).
- "Medically reviewed by / Fact-checked" component near the byline.

### Phase 5 — SEO
- Per-page metadata (title, description, OpenGraph, Twitter cards) via Next metadata API.
- JSON-LD structured data: `Article`, `FAQPage`, `BreadcrumbList`, and for product roundups
  `ItemList` / `Product` + `Review`. (See SEO_REQUIREMENTS.md.)
- Auto-generated `sitemap.xml` and `robots.txt`.
- Canonical URLs. Clean semantic HTML headings (one h1 per page).

### Phase 6 — Polish + performance
- Optimize images with `next/image`. Lazy-load below the fold.
- Lighthouse pass: target 90+ on Performance, Accessibility, SEO, Best Practices.
- Responsive down to 360px. Keyboard focus visible. `prefers-reduced-motion` respected.
- Newsletter signup component (stub the backend — wire to a real provider like Beehiiv/
  ConvertKit/Mailchimp later).

### Phase 7 (later, optional) — Growth features
- Search (client-side with `fuse.js` over a generated index, or Algolia).
- Related articles.
- RSS feed.
- Move content to a CMS (Sanity/Contentful) or DB only if a non-technical editor needs it.

---

## 6. Non-negotiable rules for the build

1. **Every affiliate link** gets `rel="sponsored nofollow"` and `target="_blank"
   rel="noopener"`.
2. **Every commercial article** auto-renders the FTC disclosure banner above the fold.
3. **No disease/cure claims.** Supplement content must not say a product "treats," "cures," or
   "prevents" any disease. Use compliant phrasing ("may support," "is associated with"). Add a
   lint note / TODO comment where the writer must stay compliant.
4. **Every health claim** in body content should be followed by a citation reference. Build a
   citations component so this is easy.
5. **Tracking tags live in config only** — never paste an Amazon Associates tag into an article.
6. Don't invent fake credentials for authors. The sample authors are placeholders clearly
   marked as such.

---

## 7. What success looks like for v1

A deployable, fast, accessible nutrition content site where:
- A new article = dropping one `.mdx` file in `/content/articles/`.
- All legal/FTC/SEO scaffolding is automatic, not manual per-article.
- The affiliate tag can be changed in one config file.
- It passes Lighthouse 90+ and renders valid structured data.

Start with Phase 1. After each phase, summarize what you built and what's next.
