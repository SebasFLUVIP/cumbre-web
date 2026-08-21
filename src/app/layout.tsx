import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getSettings } from "@/lib/store";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

// La misma fuente de verdad que sitemap.ts y robots.ts, para que el
// dominio nunca quede desincronizado entre las tres.
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cumbredeco.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Cumbre — Decoración y diseño de interiores en Colombia",
    template: "%s · Cumbre",
  },
  description:
    "Estudio de interiorismo y tienda de decoración. Proyectos integrales, muebles a medida y objetos pensados para sumar calidez a tu casa. Bogotá, Anapoima y Villeta.",
  keywords: [
    "diseño de interiores Bogotá",
    "decoración Colombia",
    "muebles a medida Bogotá",
    "interiorismo Anapoima",
    "remodelación casa de campo",
    "lámparas artesanales Colombia",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Cumbre",
    title: "Cumbre — Decoración y diseño de interiores",
    description:
      "Proyectos integrales de interiorismo, muebles a medida y objetos de decoración. Tu casa tiene que contar tu historia.",
    images: ["/img/proyectos/anapoima-comedor-wide.webp"],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();

  return (
    <html lang="es-CO" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        {/* Sin JavaScript, las animaciones de entrada dejarían el contenido
            invisible: se fuerza el estado final. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen antialiased">
        <CartProvider>
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-bone"
          >
            Saltar al contenido
          </a>
          <SiteHeader freeShippingThresholdCOP={settings.freeShippingThresholdCOP} />
          <main id="contenido">{children}</main>
          <SiteFooter />
          <CartDrawer freeShippingThresholdCOP={settings.freeShippingThresholdCOP} />
          <WhatsAppButton phone={settings.whatsapp} />
        </CartProvider>
      </body>
    </html>
  );
}
