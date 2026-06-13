/**
 * ALIZEE — Ficha de diseño (producción)
 * Payload que viaja en el token de la URL /ficha?d=<token>
 * El link se incluye en el mensaje de WhatsApp al confirmar pedido.
 *
 * SEGURIDAD: la ficha contiene PII (dirección, GPS, fecha de nacimiento).
 *  - En producción se CIFRA server-side (AES-256-GCM) vía /api/ficha →
 *    token con prefijo "v1.". Ver `ficha.server.ts`. Requiere FICHA_SECRET.
 *  - `encodeFicha` (base64, abajo) es SOLO fallback de desarrollo cuando no
 *    hay FICHA_SECRET. NO es cifrado — no usar en prod con datos reales.
 */

import type { Answers } from "@/store/funnel";

export interface FichaAddress {
  street: string;
  colonia: string;
  cityState: string;
  zip: string;
  references: string;
  formattedAddress?: string;
  lat?: number;
  lng?: number;
  deliveryTime?: string;
}

export interface FichaPayload {
  archetypeKey: string;
  tierIdx: number;
  total: number;
  relationship: string | null;
  answers: Answers;
  birthDate: string | null;
  birthTime: string | null;
  sign: string | null;
  address: FichaAddress;
  createdAt: string; // ISO
}

/**
 * Fallback de desarrollo — codifica (NO cifra) browser-safe.
 * Usar solo si no hay FICHA_SECRET. Produce token sin prefijo "v1.".
 */
export function encodeFicha(payload: FichaPayload): string {
  return btoa(encodeURIComponent(JSON.stringify(payload)));
}

/** Decodifica el fallback de desarrollo (token sin prefijo). */
export function decodeFichaPlain(token: string): FichaPayload | null {
  try {
    const json =
      typeof window === "undefined"
        ? Buffer.from(token, "base64").toString("utf8")
        : atob(token);
    return JSON.parse(decodeURIComponent(json)) as FichaPayload;
  } catch {
    return null;
  }
}
