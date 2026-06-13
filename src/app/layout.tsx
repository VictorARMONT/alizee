import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import Script from "next/script";
import { ConditionalFooter } from "@/components/ConditionalFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
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
  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID; // Meta Pixel ID — sin valor, no carga fbq
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
        <WhatsAppFab />
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
            `}</Script>
          </>
        )}

        {FB_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}</Script>
        )}

        {(GA_ID || FB_PIXEL_ID) && (
          <Script id="analytics-bridge" strategy="afterInteractive">{`
            (function(){
              // Mapa de eventos ALIZEE → eventos estándar de Meta Pixel.
              var FB_STD = { AddToCart:'AddToCart', InitiateCheckout:'InitiateCheckout',
                CompleteQuiz:'Lead', ViewRecommendation:'ViewContent', Purchase:'Purchase' };
              window.__analyticsDispatch = function(event){
                var name = event.name;
                var params = Object.assign({}, event); delete params.name;
                if (typeof window.gtag === 'function') { window.gtag('event', name, params); }
                if (typeof window.fbq === 'function') {
                  if (FB_STD[name]) { window.fbq('track', FB_STD[name], params); }
                  else { window.fbq('trackCustom', name, params); }
                }
              };
            })();
          `}</Script>
        )}
      </body>
    </html>
  );
}
