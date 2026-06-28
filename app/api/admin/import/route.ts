import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  isAuthed,
  parseUpload,
  deriveExcerpt,
  slugify,
  buildMdx,
  commitArticle,
  commitImage,
  ghConfigured,
} from "@/lib/admin";
import { getArticleBySlug } from "@/lib/content";
import { marked } from "marked";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAuthed(cookies().get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected a form upload." }, { status: 400 });
  }

  const str = (k: string) => String(form.get(k) ?? "").trim();
  const mode = str("mode") === "edit" ? "edit" : "create";
  const explicitSlug = str("slug");
  const isPreview = str("preview") === "true";

  // --- resolve the body: uploaded file, else the pasted textarea ---
  const file = form.get("file");
  let parsedTitle: string | null = null;
  let body = "";

  if (file instanceof File && file.size > 0) {
    if (!/\.(docx|md|markdown|txt)$/i.test(file.name)) {
      return NextResponse.json(
        { error: "Unsupported file type. Use .docx, .md, or .txt." },
        { status: 400 },
      );
    }
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const parsed = await parseUpload(file.name, buffer);
      parsedTitle = parsed.title;
      body = parsed.body;
    } catch (err) {
      console.error("[admin/import] parse error:", err);
      return NextResponse.json({ error: "Could not read that document." }, { status: 422 });
    }
  } else {
    body = str("body");
  }

  // Normalize CRLF (multipart uses \r\n) so paragraph splitting + output are clean.
  body = body.replace(/\r\n/g, "\n").trim();

  if (!body) {
    return NextResponse.json(
      { error: "No content — upload a file or write the body." },
      { status: 422 },
    );
  }

  // --- existing article (edit mode) to preserve publishedAt / hero image ---
  const slugForLookup = explicitSlug || "";
  const existing =
    mode === "edit" && slugForLookup
      ? getArticleBySlug(slugForLookup)?.frontmatter ?? null
      : null;

  const title =
    str("title") ||
    parsedTitle ||
    existing?.title ||
    (file instanceof File
      ? file.name.replace(/\.(docx|md|markdown|txt)$/i, "").replace(/[-_]+/g, " ")
      : "Untitled");

  const slug = explicitSlug || slugify(title);

  const type = str("type") === "commercial" ? "commercial" : "informational";
  const tags = str("tags")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // --- hero image: new upload (if GitHub configured) else keep existing ---
  let heroImage = existing?.heroImage;
  let heroAlt = str("heroAlt") || existing?.heroAlt;
  const image = form.get("image");
  if (image instanceof File && image.size > 0) {
    const m = image.name.toLowerCase().match(/\.(png|jpe?g|webp)$/);
    if (!m) {
      return NextResponse.json(
        { error: "Image must be png, jpg, or webp." },
        { status: 400 },
      );
    }
    // Commit the image only on a real publish (not preview / not dry-run).
    if (!isPreview && ghConfigured()) {
      const ext = m[1] === "jpeg" ? "jpg" : m[1];
      const buffer = Buffer.from(await image.arrayBuffer());
      heroImage = await commitImage(slug, ext, buffer);
      if (!heroAlt) heroAlt = title;
    }
  }

  const category = str("category") || existing?.category || "general-nutrition";
  const excerpt = str("excerpt") || deriveExcerpt(body);

  const mdx = buildMdx({
    title,
    slug,
    excerpt,
    category,
    type: type as "informational" | "commercial",
    author: str("author") || existing?.author || "jane-doe",
    reviewer: str("reviewer") || existing?.reviewer || undefined,
    tags: tags.length ? tags : existing?.tags ?? [],
    featured: str("featured") === "true",
    body,
    heroImage,
    heroAlt,
    publishedAt: existing?.publishedAt,
  });

  // --- Preview: render the body, return everything, commit nothing ---
  if (isPreview) {
    const bodyHtml = String(await marked.parse(body));
    return NextResponse.json({
      ok: true,
      preview: true,
      slug,
      title,
      category,
      excerpt,
      bodyHtml,
      mdx,
    });
  }

  try {
    const result = await commitArticle(slug, mdx);
    return NextResponse.json({ ok: true, slug, ...result });
  } catch (err) {
    console.error("[admin/import] commit error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Publish failed." },
      { status: 502 },
    );
  }
}
