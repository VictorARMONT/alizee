import { NextRequest, NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY ?? "";
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID ?? "0");

export async function POST(req: NextRequest) {
  if (!BREVO_API_KEY) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let email: string;
  try {
    const body = await req.json() as { email?: string };
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: BREVO_LIST_ID > 0 ? [BREVO_LIST_ID] : [],
        updateEnabled: true,
      }),
    });

    if (res.status === 204 || res.status === 201 || res.status === 200) {
      return NextResponse.json({ ok: true });
    }

    // 400 "Contact already exist" — tratar como éxito
    const data = await res.json() as { code?: string };
    if (data.code === "duplicate_parameter") {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "brevo_error", code: data.code }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "network_error" }, { status: 502 });
  }
}
