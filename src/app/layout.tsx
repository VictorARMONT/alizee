import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { ProductSchemaScript } from "@/components/ProductSchema";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alizee.mx"),
  title: "alizee — El regalo perfecto",
  description:
    "Un regalo ritual, hecho a su medida. Análisis personalizado + objeto impreso en 3D.",
  openGraph: {
    title: "alizee — El regalo perfecto",
    description: "Un regalo ritual, hecho a su medida. Análisis personalizado + objeto impreso en 3D.",
    url: "https://alizee.mx",
    siteName: "alizee",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/logo-primary-crop.png",
        width: 1200,
        height: 630,
        alt: "alizee — El regalo perfecto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "alizee — El regalo perfecto",
    description: "Un regalo ritual, hecho a su medida.",
    images: ["/logo-primary-crop.png"],
  },
  alternates: {
    canonical: "https://alizee.mx",
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
  return (
    <html
      lang="es-MX"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Schema JSON-LD */}
        <ProductSchemaScript />

        {/* GA4 Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                page_path: window.location.pathname,
                anonymize_ip: true,
              });
              window.__analyticsDispatch = (event) => {
                const { name, ...params } = event;
                gtag('event', name, params);
              };
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
