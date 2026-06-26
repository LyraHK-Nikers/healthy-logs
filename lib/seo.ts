import type { Metadata } from "next";
import type { Article, Author } from "@/lib/content";
import type { Crumb } from "@/components/seo/Breadcrumbs";
import { siteConfig } from "@/config/site";

/**
 * Metadata builders. Phase 2 ships basic per-page metadata (title, description,
 * canonical, basic OpenGraph). Phase 5 expands this with full OG images,
 * Twitter cards, and JSON-LD structured data (SEO_REQUIREMENTS.md).
 */

export function articleMetadata(article: Article): Metadata {
  const { frontmatter: fm } = article;
  const url = `${siteConfig.url}/articles/${fm.slug}`;
  return {
    title: fm.title,
    description: fm.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: fm.title,
      description: fm.excerpt,
      url,
      publishedTime: fm.publishedAt,
      modifiedTime: fm.updatedAt,
      // og:image comes from app/articles/[slug]/opengraph-image.tsx (generated
      // per-article). Swap to fm.heroImage here once real hero photos exist.
    },
    twitter: {
      card: "summary_large_image",
      title: fm.title,
      description: fm.excerpt,
    },
  };
}

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${siteConfig.url}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
    },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD structured data (SEO_REQUIREMENTS.md §2)
// ---------------------------------------------------------------------------

const abs = (path: string) =>
  path.startsWith("http") ? path : `${siteConfig.url}${path}`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: abs("/logo.svg"),
    description: siteConfig.description,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

function personJsonLd(author: Author | null, fallbackSlug: string) {
  const fm = author?.frontmatter;
  return {
    "@type": "Person",
    name: fm?.name ?? fallbackSlug,
    ...(fm?.credentials ? { jobTitle: fm.credentials } : {}),
    url: abs(`/authors/${fm?.slug ?? fallbackSlug}`),
  };
}

export function articleJsonLd(
  article: Article,
  author: Author | null,
  reviewer: Author | null,
) {
  const { frontmatter: fm } = article;
  const url = abs(`/articles/${fm.slug}`);
  return {
    "@context": "https://schema.org",
    // Strongly medical content can be marked MedicalWebPage; Article is the safe
    // default for general nutrition guides.
    "@type": fm.medicallyReviewed ? "MedicalWebPage" : "Article",
    headline: fm.title,
    description: fm.excerpt,
    author: personJsonLd(author, fm.author),
    ...(reviewer || fm.reviewer
      ? { reviewedBy: personJsonLd(reviewer, fm.reviewer ?? "") }
      : {}),
    datePublished: fm.publishedAt,
    dateModified: fm.updatedAt || fm.publishedAt,
    ...(fm.heroImage ? { image: abs(fm.heroImage) } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: abs("/logo.svg") },
    },
  };
}

export function faqJsonLd(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: abs(c.href) } : {}),
    })),
  };
}

/** ItemList of Product+Review for commercial roundups. Only honest ratings. */
export function productListJsonLd(
  products: {
    name: string;
    rating?: number;
    price?: string;
  }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        ...(typeof p.rating === "number"
          ? {
              review: {
                "@type": "Review",
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: p.rating,
                  bestRating: 5,
                },
                author: { "@type": "Organization", name: siteConfig.name },
              },
            }
          : {}),
        ...(p.price
          ? {
              offers: {
                "@type": "Offer",
                price: p.price.replace(/[^0-9.]/g, ""),
                priceCurrency: "USD",
              },
            }
          : {}),
      },
    })),
  };
}
