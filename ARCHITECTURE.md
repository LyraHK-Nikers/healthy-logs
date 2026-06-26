# Healthy Logs — Architecture & Folder Structure

```
healthy-logs/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # root layout: header, footer, cookie banner
│   ├── page.tsx                  # homepage
│   ├── globals.css               # Tailwind + custom CSS vars
│   ├── sitemap.ts                # generated sitemap
│   ├── robots.ts                 # generated robots.txt
│   ├── articles/
│   │   ├── page.tsx              # /articles index (paginated, filterable)
│   │   └── [slug]/page.tsx       # single article template
│   ├── category/
│   │   └── [category]/page.tsx
│   ├── authors/
│   │   └── [slug]/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── disclosure/page.tsx
│   ├── medical-disclaimer/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   └── editorial-policy/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx            # MUST link all legal pages
│   │   └── CookieConsent.tsx
│   ├── article/
│   │   ├── Byline.tsx            # author + credentials + dates
│   │   ├── ReviewerBadge.tsx     # "Medically reviewed by..."
│   │   ├── TableOfContents.tsx
│   │   ├── Citations.tsx
│   │   ├── FaqBlock.tsx          # renders + emits FAQ schema
│   │   └── AffiliateDisclosure.tsx
│   ├── affiliate/
│   │   ├── ProductCard.tsx       # single product w/ pros/cons/rating
│   │   ├── ProductComparison.tsx # table of multiple products
│   │   └── AffiliateLink.tsx     # wraps every outbound link, adds rel attrs
│   ├── cards/
│   │   ├── ArticleCard.tsx
│   │   └── CategoryCard.tsx
│   ├── seo/
│   │   ├── JsonLd.tsx            # injects structured data
│   │   └── Breadcrumbs.tsx
│   └── ui/                       # buttons, inputs, pagination, etc.
│
├── content/
│   ├── articles/                 # *.mdx — the actual content
│   ├── authors/                  # *.mdx — author profiles
│   └── legal/                    # *.mdx — legal page bodies (editable)
│
├── config/
│   ├── site.ts                   # site name, url, social, nav
│   ├── categories.ts             # taxonomy array
│   └── affiliates.ts             # tracking tag + URL builder (SINGLE source)
│
├── lib/
│   ├── content.ts                # read/parse MDX, list articles, get by slug
│   ├── mdx.ts                    # MDX components mapping
│   ├── seo.ts                    # metadata + JSON-LD builders
│   └── utils.ts
│
├── public/
│   └── images/
│
├── PROJECT_BRIEF.md
├── ARCHITECTURE.md
├── DESIGN_SYSTEM.md
├── SEO_REQUIREMENTS.md
├── LEGAL_TEMPLATES.md
├── AFFILIATE_SYSTEM.md
├── CONTENT_STRATEGY.md
└── README.md
```

## Content pipeline (lib/content.ts)

Use `gray-matter` to parse frontmatter and `next-mdx-remote/rsc` to render MDX in React Server
Components. Key functions to implement:

- `getAllArticles()` → sorted by `publishedAt` desc, returns frontmatter + slug
- `getArticleBySlug(slug)` → full parsed article incl. compiled MDX source
- `getArticlesByCategory(category)`
- `getArticlesByAuthor(authorSlug)`
- `getAllAuthors()` / `getAuthorBySlug(slug)`
- `getAllSlugs()` → for `generateStaticParams`

All pages use `generateStaticParams` + static rendering (SSG). No runtime DB calls.

## Affiliate link enforcement

`AffiliateLink.tsx` is the ONLY way outbound product links render. It:
1. Takes a product key or raw URL.
2. Resolves the final URL via `config/affiliates.ts` (appends tracking tag).
3. Always sets `rel="sponsored nofollow noopener"` and `target="_blank"`.
4. Optionally fires an analytics event.

Lint rule (or code review note): no `<a href>` to an external store should exist outside this
component.
