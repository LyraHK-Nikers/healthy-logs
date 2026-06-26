# Healthy Logs

A nutrition content website monetized through affiliate marketing — built to be fast, credible,
and compliant by default. Next.js 14 + MDX content + Tailwind.

## 📦 What's in this package

| File | What it is |
|---|---|
| `PROJECT_BRIEF.md` | **Start here.** The full spec, data model, routes, and 7 build phases. |
| `ARCHITECTURE.md` | Folder structure + content pipeline + key functions. |
| `DESIGN_SYSTEM.md` | Colors, type, layout, and the "log entry" signature look. |
| `AFFILIATE_SYSTEM.md` | The monetization engine — compliant-by-default link system. |
| `SEO_REQUIREMENTS.md` | Metadata, JSON-LD, E-E-A-T, technical SEO. |
| `LEGAL_TEMPLATES.md` | FTC disclosure, medical disclaimer, privacy, terms templates. |
| `CONTENT_STRATEGY.md` | How to actually get traffic and revenue (for the owner). |

## 🚀 How to use this with Claude Code

1. Drop this whole folder into your project directory.
2. Open Claude Code in that directory.
3. Paste this kickoff prompt:

> Read PROJECT_BRIEF.md, ARCHITECTURE.md, DESIGN_SYSTEM.md, AFFILIATE_SYSTEM.md,
> SEO_REQUIREMENTS.md, and LEGAL_TEMPLATES.md. Then build **Phase 1** only: initialize a
> Next.js 14 (App Router, TypeScript) project with Tailwind, set up the MDX content pipeline
> using gray-matter + next-mdx-remote, create the folder structure from ARCHITECTURE.md, add
> 2 sample authors and 3 sample articles (2 informational, 1 commercial), and get the homepage
> rendering on `npm run dev`. Follow DESIGN_SYSTEM.md for all styling. When done, summarize what
> you built and confirm the dev server runs, then stop and wait before starting Phase 2.

4. After each phase, review, then tell it to proceed to the next phase.

## ✅ Build phases (see PROJECT_BRIEF.md for detail)

1. Scaffolding + content pipeline + sample content
2. Core templates (article, home, category, author)
3. Affiliate system (compliant links + auto disclosure)
4. Legal + trust pages + cookie consent
5. SEO (metadata, JSON-LD, sitemap, robots)
6. Polish + performance + accessibility (Lighthouse 90+)
7. (Later) search, RSS, related posts, CMS

## ⚠️ Three things not to skip

1. **Compliance is structural, not manual.** Every affiliate link is `rel="sponsored nofollow"`
   via one component; every commercial page auto-shows the FTC disclosure.
2. **E-E-A-T is the ranking strategy.** Named credentialed authors, reviewer bylines, citations,
   editorial policy — health content is held to a high trust bar.
3. **The site is 10% of the work.** Read CONTENT_STRATEGY.md — traffic and revenue come from
   consistent, trustworthy content over 6–12+ months, not from the build.

## Legal note

The legal templates are starting points, not legal advice. Have them reviewed before launch,
especially if you target US or EU traffic.
