/**
 * Rate limiting con Upstash Redis (durable, sirve en serverless).
 *
 * Producción: provisiona un KV/Upstash Redis en Vercel → inyecta las envs.
 * Soporta los dos juegos de nombres comunes:
 *   - KV_REST_API_URL / KV_REST_API_TOKEN        (integración Vercel KV)
 *   - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (Upstash directo)
 *
 * Sin esas envs (dev/local), cae a un limitador en memoria. OJO: el de memoria
 * NO es fiable en serverless (se reinicia por instancia) — es solo fallback.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/* ── Conexión Redis (singleton) ─────────────────────────────────────────
   Vercel KV/Upstash a veces prefija las vars con el nombre del store
   (p.ej. `alizee_KV_REST_API_URL`). Resolvemos por sufijo para no depender
   del prefijo exacto. Excluye el token READ_ONLY (necesitamos escritura). */
function resolveEnvBySuffix(suffix: string): string {
  const exact = process.env[suffix];
  if (exact) return exact;
  for (const [key, value] of Object.entries(process.env)) {
    if (value && key.endsWith("_" + suffix)) return value;
  }
  return "";
}

const REDIS_URL =
  resolveEnvBySuffix("KV_REST_API_URL") ||
  resolveEnvBySuffix("UPSTASH_REDIS_REST_URL");
const REDIS_TOKEN =
  resolveEnvBySuffix("KV_REST_API_TOKEN") ||
  resolveEnvBySuffix("UPSTASH_REDIS_REST_TOKEN");

const redis =
  REDIS_URL && REDIS_TOKEN
    ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
    : null;

/* Cache de instancias Ratelimit por (limit|windowMs) — crear una vez. */
const limiters = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowMs: number): Ratelimit | null {
  if (!redis) return null;
  const cacheKey = `${limit}|${windowMs}`;
  let rl = limiters.get(cacheKey);
  if (!rl) {
    rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
      prefix: "alizee/rl",
      analytics: false,
    });
    limiters.set(cacheKey, rl);
  }
  return rl;
}

/* ── Fallback en memoria (solo dev) ─────────────────────────────────── */
interface MemEntry {
  count: number;
  resetAt: number;
}
const memStore = new Map<string, MemEntry>();

function checkMemory(
  identifier: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  let entry = memStore.get(identifier);
  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + windowMs };
    memStore.set(identifier, entry);
  }
  entry.count += 1;
  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
  };
}

/**
 * Verifica el rate limit. Usa Redis si está configurado; si no, memoria (dev).
 * @param identifier IP, email, session, etc.
 * @param limit máximo de requests
 * @param windowMs ventana de tiempo en ms
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000,
): Promise<{ allowed: boolean; remaining: number }> {
  const limiter = getLimiter(limit, windowMs);
  if (limiter) {
    try {
      const { success, remaining } = await limiter.limit(identifier);
      return { allowed: success, remaining };
    } catch {
      // Redis caído → no bloquear al usuario, degradar a memoria.
      return checkMemory(identifier, limit, windowMs);
    }
  }
  return checkMemory(identifier, limit, windowMs);
}
