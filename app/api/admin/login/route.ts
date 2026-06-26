import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  adminToken,
  credentialsMatch,
  isAdminConfigured,
} from "@/lib/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin not configured." }, { status: 503 });
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
    return NextResponse.json(
      { error: "Wrong username or password." },
      { status: 401 },
    );
  }

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
