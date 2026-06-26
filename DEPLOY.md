# Deploying Healthy Logs to Vercel

A start-to-finish checklist. ~15 minutes once the prerequisites are done.

> Deploying on a **Hostinger VPS** instead? See **[DEPLOY_HOSTINGER.md](DEPLOY_HOSTINGER.md)**.

---

## 0. Before you deploy (blockers)

These aren't optional — skipping them ships a broken or untrustworthy site:

- [ ] **Set the production domain** in `config/site.ts` → `url`. Everything
      (canonicals, sitemap, OG images, JSON-LD) is built from this. The current
      `https://www.healthylogs.com` is a placeholder.
- [ ] **Replace the placeholder authors** in `content/authors/` with real,
      credentialed people, and set `placeholder: false`.
- [ ] **Add your real Amazon Associates tag** in `config/affiliates.ts`.
- [ ] **Have the legal pages reviewed** and fill `jurisdiction` in `config/site.ts`.
- [ ] (Recommended) add **real images** (hero + author photos) under `public/images/`.

---

## 1. Push to GitHub

```bash
cd C:\Users\csven\healthy-logs
git init
git add .
git commit -m "Initial commit: Healthy Logs"
# create an empty repo on github.com, then:
git remote add origin https://github.com/<you>/healthy-logs.git
git branch -M main
git push -u origin main
```

`.gitignore` already excludes `node_modules`, `.next`, `.env*`, and the generated
OG index.

## 2. Import into Vercel

1. Go to vercel.com → **Add New… → Project** → import the GitHub repo.
2. Framework preset auto-detects **Next.js**. Leave build settings default
   (`npm run build`, output handled automatically — `prebuild` runs the OG index
   generator for you).
3. Click **Deploy**. First build takes ~1–2 min; you'll get a `*.vercel.app` URL.

## 3. Environment variables (optional)

Project → **Settings → Environment Variables**. See `.env.example` for the list.
Add these only when you're ready:

- Newsletter: `NEWSLETTER_PROVIDER` + that provider's keys.

Redeploy after adding env vars (Deployments → ⋯ → Redeploy).

## 4. Custom domain

1. Project → **Settings → Domains** → add `yourdomain.com` and `www.yourdomain.com`.
2. Point DNS at Vercel (it shows the exact records — usually an A record and/or
   a CNAME). Pick one canonical host (www or apex) and let Vercel redirect the other.
3. **Update `config/site.ts` `url` to the final domain** and redeploy so
   canonicals/sitemap/OG match. HTTPS is automatic.

## 5. Post-deploy checks

- [ ] `https://yourdomain.com/sitemap.xml` lists your pages.
- [ ] `https://yourdomain.com/robots.txt` points to the sitemap (and disallows
      `/go/`, `/search`).
- [ ] Paste an article URL into the
      [Rich Results Test](https://search.google.com/test/rich-results) — Article /
      FAQ / Breadcrumb should validate.
- [ ] Check an article link in a social debugger (e.g.
      [opengraph.xyz](https://www.opengraph.xyz)) — the per-article image renders.
- [ ] Lighthouse (Chrome DevTools) — aim for 90+ across the board.
- [ ] Click a "Check price" button → lands on Amazon with `?tag=...`.
- [ ] Add the site to **Google Search Console**, verify (paste the token into
      `config/site.ts` → `googleSiteVerification`, redeploy), and **submit the
      sitemap**.
- [ ] Vercel **Analytics** + **Speed Insights** tabs start showing data.

## 6. Ongoing

- Add content by dropping `.mdx` files — see `ADDING_CONTENT.md`. Each push
  auto-deploys.
- Per `CONTENT_STRATEGY.md`: consistent, trustworthy content over 6–12 months is
  what actually drives traffic and revenue. The build was the easy part.
