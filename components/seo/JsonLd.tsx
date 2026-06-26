/**
 * Injects JSON-LD structured data (SEO_REQUIREMENTS.md §2).
 * Accepts a single schema object or an array of them. Validate output with
 * Google's Rich Results Test before launch.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify output is safe to inject here.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
