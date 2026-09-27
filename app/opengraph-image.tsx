import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/copy";

/** Solid pine-800 card carrying the official isotype. No photography exists yet. */

export const alt = site.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
 * The vertical lockup, read from the vendored brand package and inlined — Satori cannot
 * resolve a React component or a relative URL. `blanco` because the card ground is
 * pine-800: the `color` variant's own pine would disappear into it, which is the same rule
 * the hero and footer follow.
 *
 * Read at module scope, which normally runs once per cold start — but Next also calls this
 * route's default export directly (not just over HTTP) to resolve `og:image` while
 * rendering the page's own metadata, in a context that does not carry the same file
 * tracing as a direct request to this route. A logo that fails to load there must not take
 * the whole page down with it: same rule as the font load below, just for the image.
 */
const logo = (() => {
  try {
    return readFileSync(join(process.cwd(), "brand_system/assets/logo/jm-vertical-blanco.svg"), "utf8");
  } catch (error) {
    console.error("opengraph-image: logo not found; card will render without it.", error);
    return null;
  }
})();
const logoDataUri = logo ? `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}` : null;

/**
 * Satori has no access to next/font, so the card would otherwise render in its default
 * face. Pull the two Poppins weights the card uses as TrueType — the old User-Agent is
 * what makes Google serve ttf instead of woff2, which Satori cannot parse.
 *
 * A failure here must never break the build: the card falls back to the default font,
 * which is a cosmetic loss on social previews and nothing more.
 */
async function loadPoppins(weight: 300 | 500): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Poppins:wght@${weight}`,
      { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0)" } },
    ).then((response) => response.text());

    const url = css.match(/src:\s*url\((.+?)\)/)?.[1];
    if (!url) return null;

    return await fetch(url).then((response) => response.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const [light, medium] = await Promise.all([loadPoppins(300), loadPoppins(500)]);
  const fonts = [
    light && { name: "Poppins", data: light, weight: 300 as const, style: "normal" as const },
    medium && { name: "Poppins", data: medium, weight: 500 as const, style: "normal" as const },
  ].filter((font) => font !== null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#184A3A",
          color: "#F7F8F1",
          padding: 80,
          fontSize: 60,
          fontFamily: fonts.length > 0 ? "Poppins" : undefined,
          fontWeight: 300,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 700 }}>
          <div style={{ fontSize: 24, letterSpacing: 6, color: "#E8DCC7" }}>ETAPA 2</div>
          {/* The wordmark is the title itself; repeating it below only crowds the card. */}
          <div style={{ marginTop: 24, lineHeight: 1.15, fontWeight: 500 }}>
            {site.ogTitle}
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        {logoDataUri ? <img src={logoDataUri} alt="" width={260} height={289} /> : null}
      </div>
    ),
    { ...size, ...(fonts.length > 0 ? { fonts } : {}) },
  );
}
