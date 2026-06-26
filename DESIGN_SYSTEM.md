# Healthy Logs — Design System

> The goal: look like a credible, calm, dietitian-run publication — NOT a flashy supplement
> store and NOT a generic AI-template site. Spend the one bold move on the "log entry"
> signature, keep everything else quiet.

## Design thesis

The brand metaphor is a **research log / field notebook**: every article is a dated, revisited
entry. Trust comes from looking measured and edited, not loud. The signature element is the
**"log entry" treatment** — each article header reads like a notebook entry with a monospace
entry-date stamp, an "updated" marker, and a fine ruled baseline, evoking a nutritionist's
working journal.

Avoid all three current AI-design defaults: (1) cream + serif + terracotta, (2) near-black +
acid accent, (3) broadsheet hairline columns. We are doing something quieter and more clinical-
warm than any of those.

## Color tokens

Set as CSS custom properties in `globals.css`. Light, clean, with a single grounded accent.

```css
:root {
  --bg:           #FBFBF9;   /* soft off-white, slightly warm */
  --surface:      #FFFFFF;   /* cards */
  --ink:          #1C2520;   /* near-black with a green undertone */
  --ink-soft:     #4A554E;   /* secondary text */
  --line:         #E4E6E1;   /* hairline borders / rules */
  --accent:       #2F6B4F;   /* deep, calm green — "nutrition" without being neon */
  --accent-soft:  #EAF2EC;   /* accent wash for tags/badges */
  --highlight:    #C9A24B;   /* muted brass — used ONLY for the log-date stamp + ratings */
}
```

Rules:
- `--accent` (deep green) for links, primary buttons, category labels.
- `--highlight` (brass) is rare: log-date stamps and star ratings only. Do not spread it.
- Never use pure black (#000) or pure red. Pros = green check, cons = muted slate, not red.

## Typography

Two real roles + one utility. Use Google Fonts via `next/font`.

- **Display / headings:** `Fraunces` (a characterful serif with optical sizing) — used with
  restraint, only for h1/h2 and the wordmark. It gives editorial credibility without being the
  overused high-contrast Playfair look.
- **Body:** `Inter` — clean, highly legible at small sizes for long nutrition articles.
- **Utility / data:** `IBM Plex Mono` — for the log-date stamp, "updated" markers, citation
  numbers, and product data (price, rating). This monospace is the thread that ties the
  "log" concept together.

Type scale (rem): 0.8 / 0.9 / 1 / 1.125 / 1.375 / 1.75 / 2.25 / 3. Body 1.0625rem, line-height
1.7 for article bodies (long-form readability matters here).

## The signature: "log entry" article header

```
┌───────────────────────────────────────────────┐
│  MINERALS                          [mono]       │  <- category eyebrow
│                                                 │
│  Magnesium Glycinate vs Citrate:                │  <- Fraunces h1
│  Which Is Better for Sleep?                     │
│                                                 │
│  ── LOG 2026-06-25  ·  UPD 2026-06-25 ──────    │  <- IBM Plex Mono, brass date, ruled line
│                                                 │
│  [avatar] Jane Doe, MS RD                       │  <- byline
│  ✓ Medically reviewed by Dr. Smith, RD          │  <- reviewer badge, green check
└───────────────────────────────────────────────┘
```

The ruled "LOG / UPD" line is the memorable element. It appears once per article header and is
echoed subtly as section dividers (thin --line rules) through the body.

## Layout

- Max content width 720px for article bodies (optimal reading measure ~70 chars).
- Homepage and index pages use a wider 1140px container with a responsive card grid.
- Generous vertical rhythm. Whitespace is the luxury here.
- Cards: white surface, 1px --line border, subtle radius (8px), no heavy shadows.

## Components styling notes

- **Tags/categories:** small, --accent-soft background, --accent text, mono, uppercase, tracked.
- **Buttons:** primary = --accent fill, white text; secondary = --ink outline. Sentence case
  labels that say what happens ("Read the guide", "Subscribe").
- **Product card:** white, bordered, rating in brass mono, pros with green checks, cons with
  slate dashes, clear "View price" affiliate button (which routes through AffiliateLink).
- **Affiliate disclosure banner:** quiet, --accent-soft background, small text, dismissible-
  optional but always present on commercial pages.

## Motion (restrained)

- Subtle fade-up on article cards as they enter viewport (respect `prefers-reduced-motion`).
- Link underline grows on hover. Nothing bouncy. No parallax. This is a credibility brand.

## Accessibility floor (non-negotiable)

- Contrast: --ink on --bg and --accent on white both pass WCAG AA.
- Visible keyboard focus ring (--accent, 2px offset).
- All images need alt text (frontmatter `heroAlt`, enforce in component).
- Responsive to 360px. Touch targets ≥ 44px.
