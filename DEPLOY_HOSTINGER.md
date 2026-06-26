# Deploying Healthy Logs on Hostinger

Two paths, depending on your plan:

- **Path A — Business/Cloud "Node.js Web Apps" (managed).** Hostinger builds and
  runs the full app (SSR, API routes, dynamic OG) from your GitHub repo. No server
  admin. **This is what your Business plan has — recommended.**
- **Path B — VPS (self-managed).** Full control with Node + PM2 + nginx + SSL.

Do the **blockers** first (both paths), then jump to your path.

---

## 0. Pre-deploy blockers (do first)

- [ ] Set the production domain in `config/site.ts` → `url` (e.g.
      `https://yourdomain.com`). Canonicals, sitemap, OG, and JSON-LD are built
      from it.
- [ ] Replace placeholder authors in `content/authors/` (set `placeholder: false`).
- [ ] Put your real Amazon Associates tag in `config/affiliates.ts`.
- [ ] Have the legal pages reviewed; fill `jurisdiction` in `config/site.ts`.
- [ ] (Recommended) add real images under `public/images/`.
- [ ] Push the project to GitHub (needed for both paths).

---

## Path A — Business plan: Node.js Web Apps (recommended)

Your Business plan includes **Node.js Web Apps**, which runs the full Next.js app
(SSR, API routes, dynamic OG) and **builds it for you** from GitHub. No server admin.

### A1. Push your code to GitHub
The repo is already committed locally. Create an **empty** repo at
[github.com/new](https://github.com/new) (no README/.gitignore), then:

```bash
cd C:\Users\csven\healthy-logs
git remote add origin https://github.com/<you>/healthy-logs.git
git branch -M main
git push -u origin main
```

### A2. Create the app in hPanel
1. **hPanel → Websites → Add website → Node.js** (or use the **Node.js** item in
   the sidebar).
2. **Import Git repository** → authorize GitHub → pick `healthy-logs`, branch `main`.
3. If prompted, set: **Node 20**, install `npm install`, build `npm run build`
   (Next.js is auto-detected — start command + output are handled for you).
4. Add any **environment variables** (newsletter keys from `.env.example`) — optional.
5. **Deploy.** The first build takes a few minutes.

### A3. Domain
It goes live on the temporary `*.hostingersite.com` URL first. To use your own
domain, click **Connect domain** and follow the DNS steps, then set
`config/site.ts` → `url` to the final `https://` domain and push a commit to redeploy.

### A4. Verify
Run the **post-deploy checks** in §7 below. Redeploys: push to `main` (enable
auto-deploy in the app settings, or redeploy from hPanel).

> If the dynamic OG images ever fail on the managed runtime, the fallback is to
> remove `export const runtime = "edge"` from the three image files — the build
> runs on Linux there, so the Node build of `@vercel/og` works fine.

---

## Path B — Hostinger VPS (self-managed)

Assumes an **Ubuntu 22.04/24.04** VPS. Commands are copy-pasteable; replace
`yourdomain.com` and paths as needed.

## 1. Create the VPS + point your domain

1. Hostinger **hPanel → VPS** → buy/select a plan (≥ 2 GB RAM recommended so
   `next build` doesn't run out of memory). Choose an **Ubuntu** OS template.
   Note the VPS **IP address**.
2. Hostinger **hPanel → Domains → DNS** for your domain, add A records pointing
   to the VPS IP:
   - `@` → `VPS_IP`
   - `www` → `VPS_IP`
   DNS can take a little while to propagate.

## 2. First-time server setup

SSH in (Hostinger gives you the root login), then:

```bash
ssh root@VPS_IP

# update + basics
apt update && apt upgrade -y
apt install -y git nginx ufw

# firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# Node.js 20 LTS (Next 14 needs >=18.17)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v   # should print v20.x

# PM2 (process manager)
npm install -g pm2
```

> **Small VPS?** If `next build` gets killed (OOM) on a 1 GB plan, add swap:
> ```bash
> fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
> echo '/swapfile none swap sw 0 0' >> /etc/fstab
> ```

## 3. Get the code + secrets

```bash
mkdir -p /var/www && cd /var/www
git clone https://github.com/<you>/healthy-logs.git
cd healthy-logs

# secrets (gitignored). Only needed if you use the newsletter — see .env.example.
nano .env.local
# e.g.
#   NEWSLETTER_PROVIDER=convertkit
#   CONVERTKIT_API_KEY=...
#   CONVERTKIT_FORM_ID=...
```

## 4. Build + run with PM2

```bash
npm ci
npm run build          # prebuild generates the OG index automatically
pm2 start ecosystem.config.js
pm2 save               # remember the process list
pm2 startup            # run the command it prints, so PM2 restarts on reboot
```

The app is now live on `127.0.0.1:3000` (not public yet — nginx is next).
Check it: `curl -I http://127.0.0.1:3000` → `200`.

## 5. nginx reverse proxy

```bash
cp deploy/nginx-healthy-logs.conf /etc/nginx/sites-available/healthy-logs
# edit the file: replace yourdomain.com with your real domain
nano /etc/nginx/sites-available/healthy-logs

ln -s /etc/nginx/sites-available/healthy-logs /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default   # optional: drop the welcome page
nginx -t && systemctl reload nginx
```

Visit `http://yourdomain.com` — the site should load.

## 6. Free SSL (HTTPS)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
# choose "redirect HTTP → HTTPS" when asked. Auto-renews via a systemd timer.
```

Now `https://yourdomain.com` works. If you hadn't already, make sure
`config/site.ts` `url` is the `https://` domain, then rebuild + reload:

```bash
npm run build && pm2 reload ecosystem.config.js
```

## 7. Post-deploy checks

- [ ] `https://yourdomain.com/sitemap.xml` and `/robots.txt` load.
- [ ] An article validates in the
      [Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Article link preview renders in [opengraph.xyz](https://www.opengraph.xyz).
- [ ] A "Check price" button → `/go/amazon/...` → redirects to Amazon with `?tag=`.
- [ ] Newsletter form returns success (demo, or real once keys are set).
- [ ] Lighthouse 90+; add the site to **Google Search Console** + submit the sitemap.

> Note: Vercel Analytics/Speed Insights only report on Vercel — off-Vercel they're
> harmless no-ops. For VPS analytics use Plausible, Umami, or GA4 instead.

## 8. Shipping updates later

From your machine: commit + push. On the VPS:

```bash
cd /var/www/healthy-logs
bash scripts/deploy.sh      # git pull + npm ci + build + pm2 reload
```

(Optionally automate this with a GitHub Actions SSH deploy or a webhook.)

---

### Quick reference
- Logs: `pm2 logs healthy-logs`  ·  Status: `pm2 list`  ·  Restart: `pm2 reload healthy-logs`
- nginx: `nginx -t && systemctl reload nginx`  ·  errors: `tail -f /var/log/nginx/error.log`
- Changing `config/*` or content requires a **rebuild** (`npm run build` → `pm2 reload`).
  Server-only env in `.env.local` is picked up on reload without a rebuild.
