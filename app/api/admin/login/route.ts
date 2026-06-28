import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  adminToken,
  credentialsMatch,
  isAdminConfigured,
} from "@/lib/admin";

export const runtime = "nodejs";

// Simple in-memory rate limit: lock an IP for 15 min after 5 failed attempts.
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; until: number }>();

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") || "";
  return fwd.split(",")[0].trim() || "global";
}

export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin not configured." }, { status: 503 });
  }

  const key = clientKey(req);
  const now = Date.now();
  const rec = attempts.get(key);
  if (rec && rec.until > now) {
    const mins = Math.ceil((rec.until - now) / 60000);
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${mins} min.` },
      { status: 429 },
    );
  }

  let username = "";
  let password = "";
  try {
    const body = await req.json();
    username = String(body?.username ?? "");
    password = String(body?.password ?? "");
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (!credentialsMatch(username, password)) {
    const count = (rec?.count ?? 0) + 1;
    attempts.set(key, {
      count,
      until: count >= MAX_FAILS ? now + LOCK_MS : 0,
    });
    const left = MAX_FAILS - count;
    return NextResponse.json(
      {
        error:
          left > 0
            ? `Wrong username or password. ${left} attempt${left === 1 ? "" : "s"} left.`
            : `Too many attempts. Locked for 15 min.`,
      },
      { status: count >= MAX_FAILS ? 429 : 401 },
    );
  }

  // success — clear any failure record
  attempts.delete(key);

  const token = adminToken();
  cookies().set(ADMIN_COOKIE, token ?? "", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  cookies().delete(ADMIN_COOKIE);
  return NextResponse.json({ ok: true });
}
