/**
 * Facebook and Instagram marks.
 *
 * These are the only icons on the page that do not come from `brand_system/` — the
 * vendored set has no social glyphs. They are third-party marks, drawn as the plain
 * one-colour outlines each platform publishes for linking, and they inherit
 * `currentColor` so they sit beside the brand icons without a colour of their own.
 *
 * Always decorative: the link around one carries the accessible name.
 */

export type SocialName = "facebook" | "instagram";

const PATHS: Record<SocialName, React.ReactNode> = {
  facebook: (
    <path d="M14 8.5h2.5V5.6A32 32 0 0 0 13.9 5.5C11.4 5.5 9.7 7 9.7 9.8v2.2H7v3.3h2.7V24h3.3v-8.7h2.7l.4-3.3h-3.1v-1.9c0-1 .3-1.6 1.6-1.6z" />
  ),
  instagram: (
    <>
      <rect x="4.5" y="4.5" width="20" height="20" rx="5.5" />
      <circle cx="14.5" cy="14.5" r="5" />
      <circle cx="20.4" cy="8.6" r="1.2" />
    </>
  ),
};

/** Instagram reads as outlines; Facebook is a solid glyph. */
const STROKED: Record<SocialName, boolean> = { facebook: false, instagram: true };

type SocialGlyphProps = {
  name: SocialName;
  className?: string;
};

export default function SocialGlyph({ name, className = "size-5" }: SocialGlyphProps) {
  const stroked = STROKED[name];

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 29 29"
      className={className}
      fill={stroked ? "none" : "currentColor"}
      stroke={stroked ? "currentColor" : "none"}
      strokeWidth={stroked ? 2 : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </svg>
  );
}
