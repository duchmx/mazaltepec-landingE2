import type { IconName } from "@/brand_system/integration/react/BrandIcon";

/**
 * A brand icon that takes the colour of the text around it.
 *
 * The vendored `BrandIcon` renders an `<img>`, and an SVG loaded as an image is its own
 * document — the file's `stroke="currentColor"` resolves against that document, not ours,
 * so the glyph would come out black on every button. Masking the same file instead keeps
 * the vendored asset as the single source and lets `bg-current` paint it, which is what
 * makes one icon work on pine, on cream and on the dark hero.
 *
 * Always decorative: the label beside it carries the meaning.
 */

type BrandGlyphProps = {
  name: IconName;
  /** Sized with utilities so it can track the button's text size. */
  className?: string;
};

export default function BrandGlyph({ name, className = "size-5" }: BrandGlyphProps) {
  const url = `url(/brand_system/assets/icons/${name}.svg)`;

  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        maskImage: url,
        WebkitMaskImage: url,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
