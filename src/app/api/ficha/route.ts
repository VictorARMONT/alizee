import { NextRequest, NextResponse } from "next/server";
import { encryptFicha } from "@/lib/ficha.server";
import { encodeFicha, type FichaPayload } from "@/lib/ficha";
import { checkRateLimit } from "@/lib/rate-limit";

const FICHA_SECRET = process.env.FICHA_SECRET ?? "";

/**
 * POST /api/ficha
 * Recibe el FichaPayload y devuelve { token } cifrado (AES-256-GCM) para
 * construir el link /ficha?d=<token>. Si no hay FICHA_SECRET (dev), cae al
 * fallback base64 sin cifrar (NO usar en prod con datos reales).
 */
export async function POST(req: NextRequest) {
  // Rate limit: 20 por IP por minuto (un pedido genera 1 ficha).
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const { allowed } = await checkRateLimit(`ficha:${ip}`, 20, 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "rate_limit_exceeded" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let payload: FichaPayload;
  try {
    payload = (await req.json()) as FichaPayload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Validación mínima de forma.
  if (!payload || typeof payload.archetypeKey !== "string") {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  if (FICHA_SECRET) {
    return NextResponse.json({ token: encryptFicha(payload, FICHA_SECRET) });
  }

  // Sin secreto: fail-closed en producción (no emitir PII sin cifrar).
  // Fallback base64 SOLO en desarrollo.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "ficha_not_configured" }, { status: 503 });
  }
  return NextResponse.json({ token: encodeFicha(payload) }); // dev only
}
