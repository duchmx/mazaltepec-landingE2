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
  /*
   * The bare diamond isotype from the brand package, served out of public/ by the
   * asset sync. The vertical lockup carries the wordmark and turns to mush at 32px,
   * so it is deliberately not used here.
   */
  icons: {
    icon: [{ url: "/brand_system/assets/favicons/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand_system/assets/favicons/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#184A3A",
};

/**
 * `data-theme="light"` pins the theme. brand_system/tokens/tokens.css carries a dark theme
 * that repaints the page under prefers-color-scheme: dark; this landing is a fixed light
 * design — the plot map's base render is a light drawing — so the theme is held with the
 * brand file's own opt-out rather than by editing the vendored file.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" data-theme="light" className={poppins.variable}>
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
