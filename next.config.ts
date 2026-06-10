import type { NextConfig } from "next";
import path from "node:path";

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",          // Next.js hydration requiere unsafe-inline
  "style-src 'self' 'unsafe-inline'",            // Framer Motion + Tailwind inline styles
  "img-src 'self' data: https:",                 // imágenes Shopify y locales
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self'",
  "frame-ancestors 'none'",                      // anti-clickjacking
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options",        value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",     value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: CSP },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
