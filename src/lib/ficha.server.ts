/**
 * ALIZEE — Cifrado server-side de la ficha de diseño.
 *
 * AES-256-GCM con llave derivada de FICHA_SECRET (SHA-256).
 * El token resultante (prefijo "v1.") viaja en la URL /ficha?d=… sin exponer
 * PII: sin la llave no se puede leer ni manipular (GCM autentica el contenido).
 *
 * server-only: importa node:crypto. NO importar desde componentes cliente.
 */

import crypto from "node:crypto";
import type { FichaPayload } from "@/lib/ficha";

const PREFIX = "v1.";

function getKey(secret: string): Buffer {
  return crypto.createHash("sha256").update(secret, "utf8").digest();
}

/** Cifra el payload → token "v1.<base64url(iv|tag|ciphertext)>". */
export function encryptFicha(payload: FichaPayload, secret: string): string {
  const key = getKey(secret);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(payload), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  const blob = Buffer.concat([iv, tag, ciphertext]).toString("base64url");
  return PREFIX + blob;
}

/** Descifra un token "v1.…". Devuelve null si no es válido o fue manipulado. */
export function decryptFicha(token: string, secret: string): FichaPayload | null {
  if (!token.startsWith(PREFIX)) return null;
  try {
    const blob = Buffer.from(token.slice(PREFIX.length), "base64url");
    const iv = blob.subarray(0, 12);
    const tag = blob.subarray(12, 28);
    const ciphertext = blob.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(secret), iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return JSON.parse(plaintext.toString("utf8")) as FichaPayload;
  } catch {
    return null;
  }
}

export function isEncryptedToken(token: string): boolean {
  return token.startsWith(PREFIX);
}
