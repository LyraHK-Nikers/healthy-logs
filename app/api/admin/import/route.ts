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
} from "@/lib/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAuthed(cookies().get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected a file upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const name = file.name || "article.md";
  if (!/\.(docx|md|markdown|txt)$/i.test(name)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use .docx, .md, or .txt." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let parsed;
  try {
    parsed = await parseUpload(name, buffer);
  } catch (err) {
    console.error("[admin/import] parse error:", err);
    return NextResponse.json(
      { error: "Could not read that document." },
      { status: 422 },
    );
  }

  const str = (k: string) => String(form.get(k) ?? "").trim();

  const title =
    str("title") ||
    parsed.title ||
    name.replace(/\.(docx|md|markdown|txt)$/i, "").replace(/[-_]+/g, " ");

  if (!parsed.body) {
    return NextResponse.json(
      { error: "The document appears to be empty." },
      { status: 422 },
    );
  }

  const slug = slugify(title);
  const typeRaw = str("type");
  const type = typeRaw === "commercial" ? "commercial" : "informational";
  const tags = str("tags")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const fields = {
    title,
    slug,
    excerpt: str("excerpt") || deriveExcerpt(parsed.body),
    category: str("category") || "general-nutrition",
    type: type as "informational" | "commercial",
    author: str("author") || "jane-doe",
    reviewer: str("reviewer") || undefined,
    tags,
    featured: str("featured") === "true",
    body: parsed.body,
  };

  const mdx = buildMdx(fields);

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
