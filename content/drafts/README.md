# Drafts (not published)

Nothing in this folder appears on the site. The site only reads
`content/articles/` and `content/authors/`.

## What's here

These are **sample posts written while the site was being built**. They were
moved here before launch because they were credited to made-up experts
("Jane Doe, MS RD" and "Dr. Alex Smith, PhD, RD"). Publishing invented health
credentials would be misleading, so they stay hidden until a real person
reviews them.

| File | Topic | Still to do before publishing |
| --- | --- | --- |
| `articles/magnesium-glycinate-vs-citrate.mdx` | Magnesium for sleep | Replace the 2 "TODO (writer)" citations with real sources |
| `articles/is-creatine-safe-for-women.mdx` | Creatine | Replace the 2 "TODO (writer)" citations with real sources |
| `articles/best-electrolyte-powders.mdx` | Electrolyte roundup (affiliate) | Check every product, price and rating is real and current |
| `authors/jane-doe.mdx`, `authors/dr-smith-rd.mdx` | Fake profiles | Do not republish. Use real author profiles instead |

## How to publish one

1. Read it through and fix anything that isn't right.
2. Change `author:` to a real author's slug, and `reviewer:` to the person who
   actually reviewed it (or remove the `reviewer:` line if nobody has).
3. Set `medicallyReviewed:` to `true` only if a real reviewer is named.
4. Move the file from `content/drafts/articles/` to `content/articles/` and
   push. The site redeploys on its own.

Or paste the text into the `/admin` uploader, which does steps 2 to 4 for you.
