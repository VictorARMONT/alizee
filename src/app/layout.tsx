import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import Script from "next/script";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { ProductSchemaScript } from "@/components/ProductSchema";
import { BackgroundLayers } from "@/components/BackgroundLayers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "variable",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alizee.mx"),
  title: {
    default: "Regalo de Día del Padre personalizado | ALIZEE México",
    template: "%s | ALIZEE",
  },
  description:
    "Diseña el regalo perfecto para papá: un paquete secreto personalizado según su personalidad, con una pieza de arte hecha a su medida y dossier de análisis. Envíos a todo México.",
  openGraph: {
    title: "Regalo de Día del Padre personalizado | ALIZEE México",
    description: "Un paquete secreto personalizado según su personalidad: pieza de arte y dossier de análisis. Pide antes del 17 de junio.",
    url: "https://alizee.mx",
    siteName: "ALIZEE",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/portada-hero.jpg",
        width: 1200,
        height: 630,
        alt: "ALIZEE — Regalo personalizado para Día del Padre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Regalo de Día del Padre personalizado | ALIZEE",
    description: "Paquete secreto según su personalidad: pieza de arte y dossier de análisis. Envíos a todo México.",
    images: ["/portada-hero.jpg"],
  },
  alternates: {
    canonical: "./",
  },
  icons: {
    icon: [
      { url: "/logo-a.webp", type: "image/webp" },
    ],
    apple: "/logo-dark.png",
  },
  robots: "index, follow",
  keywords: "regalo ritual, análisis personalizado, arquetipo, astrología, signo zodiacal",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f0e8",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // GA4 Measurement ID (G-…) — sin valor, no carga gtag
  return (
    <html
      lang="es-MX"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        {/* Schema JSON-LD */}
        <ProductSchemaScript />
      </head>
      <body className="min-h-full flex flex-col">
        <BackgroundLayers />
        <div className="flex-1 relative z-10">{children}</div>
        <ConditionalFooter />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname, anonymize_ip: true });
              window.__analyticsDispatch = (event) => { var n=event.name,p=Object.assign({},event); delete p.name; gtag('event',n,p); };
            `}</Script>
          </>
        )}
      </body>
    </html>
  );
}
