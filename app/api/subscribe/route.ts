import { NextResponse } from "next/server";

/**
 * Newsletter subscribe endpoint — provider-agnostic.
 *
 * Set NEWSLETTER_PROVIDER (+ that provider's keys) in your env to go live.
 * Supported out of the box: convertkit | beehiiv | mailchimp.
 * With nothing configured it runs in "demo" mode (accepts + logs, sends nothing)
 * so the form works locally and pre-launch. See .env.example.
 */
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const provider = process.env.NEWSLETTER_PROVIDER?.toLowerCase();

  try {
    if (provider === "convertkit") {
      const r = await fetch(
        `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: process.env.CONVERTKIT_API_KEY,
            email,
          }),
        },
      );
      if (!r.ok) throw new Error(`convertkit ${r.status}`);
    } else if (provider === "beehiiv") {
      const r = await fetch(
        `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
          },
          body: JSON.stringify({
            email,
            reactivate_existing: false,
            send_welcome_email: true,
          }),
        },
      );
      if (!r.ok) throw new Error(`beehiiv ${r.status}`);
    } else if (provider === "mailchimp") {
      const dc = process.env.MAILCHIMP_SERVER_PREFIX;
      const auth = Buffer.from(
        `anystring:${process.env.MAILCHIMP_API_KEY}`,
      ).toString("base64");
      const r = await fetch(
        `https://${dc}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({ email_address: email, status: "subscribed" }),
        },
      );
      // 400 with "Member Exists" is fine — treat as success.
      if (!r.ok && r.status !== 400) throw new Error(`mailchimp ${r.status}`);
    } else {
      // No provider configured — demo mode.
      console.log(`[newsletter] demo mode, would subscribe: ${email}`);
      return NextResponse.json({ ok: true, demo: true });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter] provider error:", err);
    return NextResponse.json(
      { error: "Subscription failed. Please try again later." },
      { status: 502 },
    );
  }
}
