# Healthy Logs — Legal Page Templates

> ⚠️ These are STARTER templates, not legal advice. They cover the structural requirements
> (FTC affiliate disclosure, medical disclaimer, privacy, terms). Before going live with real
> traffic — especially in the US/EU — have a lawyer or a vetted generator (Termly, iubenda)
> review them. Fill every [BRACKET].

---

## /disclosure — Affiliate Disclosure (FTC-required)

**Affiliate Disclosure**

Healthy Logs ([SITE_URL]) is a reader-supported publication. Some of the links on this site are
affiliate links, which means that if you click them and make a purchase, we may earn a
commission — at no additional cost to you.

We are a participant in the Amazon Services LLC Associates Program, an affiliate advertising
program designed to provide a means for sites to earn advertising fees by advertising and
linking to Amazon.com. We may also participate in other affiliate programs and earn commissions
on qualifying purchases made through links to those retailers.

Affiliate commissions never influence our editorial judgment. We recommend products based on
research and our editorial standards, not on commission rates. Where we rank or compare
products, our methodology is described in the article.

Last updated: [DATE]

---

## /medical-disclaimer — Medical Disclaimer

**Medical Disclaimer**

The content on Healthy Logs is provided for general informational and educational purposes only.
It is **not** medical advice and is not a substitute for professional medical advice, diagnosis,
or treatment.

Always seek the advice of your physician, registered dietitian, or another qualified health
provider with any questions you may have regarding a medical condition, your diet, or before
starting any supplement. Never disregard professional medical advice or delay seeking it because
of something you have read on this site.

Statements about supplements and foods have not been evaluated by the [FDA / relevant authority]
and are not intended to diagnose, treat, cure, or prevent any disease.

If you think you may have a medical emergency, call your doctor or emergency services
immediately.

Last updated: [DATE]

---

## /privacy — Privacy Policy (structure)

Include sections for:
1. **Who we are** and contact email.
2. **What data we collect** — analytics (e.g., Google Analytics), cookies, newsletter email if
   you add signup, server logs.
3. **How we use it** — site improvement, measuring affiliate performance, sending newsletters.
4. **Cookies & tracking** — analytics cookies, affiliate cookies (note that retailers like
   Amazon set their own cookies when you click through).
5. **Third parties** — Amazon Associates, ad networks (later), email provider, hosting (Vercel).
6. **Your rights** — GDPR (access, deletion, objection) for EU visitors; CCPA for California.
7. **Data retention**, **children's privacy** (not directed at under-13/16), **changes to
   policy**, **contact**.

> Recommend generating the full text with Termly/iubenda once you know exactly which
> analytics/ad/email tools you use, then linking it here.

---

## /terms — Terms of Use (structure)

Include: acceptance of terms; intellectual property (your content is yours, no scraping);
acceptable use; **disclaimer of warranties** (info "as is"); **limitation of liability**;
affiliate relationships reference; external links disclaimer; governing law ([JURISDICTION]);
changes to terms; contact.

---

## /editorial-policy — Editorial Policy (trust + E-E-A-T)

Not legally required, but a strong ranking and trust signal. Cover:
- How we choose topics.
- Our research standards (peer-reviewed sources, NIH, etc.).
- Who writes and who reviews content (link to author pages).
- How and how often we update articles (the "log" model).
- How we handle product recommendations and affiliate relationships.
- How to report an error or request a correction.

---

## Cookie consent

Render a consent banner (`vanilla-cookieconsent` lib or small custom). For EU/GDPR you need
opt-IN for non-essential (analytics/ads) cookies; for US, opt-out is generally acceptable. Gate
analytics scripts behind consent. Store the choice in a first-party cookie (not localStorage if
you want it readable server-side — but a simple client cookie is fine).

---

## Footer requirement

The site footer MUST link: Disclosure, Medical Disclaimer, Privacy, Terms, Editorial Policy,
About, Contact. These links are themselves a trust signal Google looks for on YMYL sites.
