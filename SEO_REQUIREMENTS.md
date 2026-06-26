# Healthy Logs — SEO Requirements

> A nutrition affiliate site lives or dies on search traffic. This is built-in, not bolted on.
> Modern ranking for health content = E-E-A-T (Experience, Expertise, Authoritativeness,
> Trust) + technical hygiene + genuinely useful content.

## 1. Per-page metadata (Next.js Metadata API)

Every page exports `generateMetadata`. For articles, derive from frontmatter:

- `title`: `{article.title} | Healthy Logs` (≤ 60 chars ideal)
- `description`: from `excerpt` (≤ 155 chars)
- `openGraph`: title, description, type `article`, `publishedTime`, `modifiedTime`, `authors`,
  `images` (heroImage)
- `twitter`: `summary_large_image`
- `alternates.canonical`: absolute URL of the page

Site-wide defaults in `config/site.ts`.

## 2. Structured data (JSON-LD) — `components/seo/JsonLd.tsx`

Emit the right schema per page type. This is what wins rich results.

**Informational article →** `Article` (or `MedicalWebPage` if strongly medical) with:
`headline`, `author` (Person w/ name + credentials + url to author page), `reviewedBy`
(if reviewer set), `datePublished`, `dateModified`, `publisher` (Organization w/ logo),
`image`, `mainEntityOfPage`.

**Article with FAQ →** add `FAQPage` schema from the `faq` frontmatter array.

**Commercial roundup →** `ItemList` of `Product`, each `Product` with `Review`
(`reviewRating`), `offers` (price/currency), `brand`. Be honest — only mark up real ratings.

**All pages →** `BreadcrumbList` matching the visible breadcrumb.

**Site →** `Organization` + `WebSite` (with `SearchAction` once search exists) on the homepage.

> Validate everything with Google's Rich Results Test before launch.

## 3. Technical SEO

- `app/sitemap.ts` — auto-generate from all articles, categories, authors, static pages.
- `app/robots.ts` — allow all, point to sitemap. Disallow nothing sensitive in v1.
- One `<h1>` per page; logical h2/h3 nesting (articles use h2 for sections).
- Clean URLs: `/articles/[slug]`, lowercase, hyphenated. No query-string routing.
- Internal linking: article template shows related articles (same category/tags) — builds
  topical clusters, which is how you rank in YMYL niches.
- Fast: static generation, `next/image`, lazy loading, minimal JS. Core Web Vitals matter for
  ranking. Target LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Mobile-first; Google indexes mobile.

## 4. E-E-A-T signals (critical for "Your Money or Your Life" health content)

Google holds health/nutrition content to a higher trust bar. Build these in:

- **Named authors with real credentials** on every article (`Byline` + author page).
- **Reviewer byline** ("Medically reviewed by …") where applicable, with a visible date.
- **Citations** to authoritative sources (PubMed, NIH, peer-reviewed journals, .gov/.edu) —
  the `Citations` component makes this systematic.
- **Editorial policy page** explaining the research + review process.
- **Updated dates** shown prominently (the "UPD" log stamp) — freshness is a trust + ranking
  signal for health content.
- **About page** establishing who is behind the site.
- Avoid auto-generated, unreviewed bulk content — that's exactly what Helpful Content updates
  penalize.

## 5. Content SEO patterns (for the content workflow)

- Each article targets ONE primary keyword + a cluster of related questions (the FAQ block
  doubles as long-tail capture + FAQ schema).
- Informational articles build authority; interlink them to commercial articles ("we compared
  the best magnesium supplements →").
- Don't keyword-stuff. Write for the reader; the schema + structure handle the machines.

## 6. Launch SEO checklist

- [ ] Sitemap submitted to Google Search Console
- [ ] All articles validate in Rich Results Test
- [ ] Canonicals correct, no duplicate content
- [ ] OG images render in social debuggers
- [ ] Lighthouse SEO score 100
- [ ] robots.txt not accidentally blocking anything
- [ ] HTTPS, no mixed content
