import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Analytics from "@/components/Analytics";
import { site } from "@/content/copy";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.ogTitle,
    description: site.description,
    url: site.url,
    siteName: site.ogTitle,
    locale: site.locale,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#184A3A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={poppins.variable}>
      <body className="font-sans antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-[0.75rem] focus:bg-pine-800 focus:px-4 focus:py-2 focus:text-cream-50"
        >
          {site.skipToContent}
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
