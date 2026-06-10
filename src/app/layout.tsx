import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  },
  twitter: {
    card: "summary_large_image",
    title: "alizee — El regalo perfecto",
    description: "Un regalo ritual, hecho a su medida.",
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
