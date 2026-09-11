import Image from "next/image";

/**
 * Placeholder for photography and video that has not been produced yet.
 *
 * Without `src` it renders a flat brand-color block at a locked aspect ratio, so nothing
 * reflows when real media arrives. Passing `src` (and `alt`) is the only change needed.
 * The dev-only label names the intended asset and never ships to production.
 */

export type MediaTone = "pine-800" | "pine-700" | "leaf-400" | "cream-200";

const TONE_CLASS: Record<MediaTone, string> = {
  "pine-800": "bg-pine-800",
  "pine-700": "bg-pine-700",
  "leaf-400": "bg-leaf-400",
  "cream-200": "bg-cream-200",
};

/** Label color that stays legible on each tone. */
const LABEL_CLASS: Record<MediaTone, string> = {
  "pine-800": "text-pine-100",
  "pine-700": "text-pine-100",
  "leaf-400": "text-pine-800",
  "cream-200": "text-ink-600",
};

type MediaSlotProps = {
  /** Locked aspect ratio, e.g. "16/9", "4/5", "1/1". Ignored when `fill` is set. */
  ratio: string;
  /** Stretch to the nearest positioned ancestor instead of holding a ratio (hero). */
  fill?: boolean;
  tone: MediaTone;
  /** What the asset will be, e.g. "HERO — aerial video loop". Dev-only. */
  label: string;
  /** When real media arrives. Empty blocks stay decorative. */
  src?: string;
  /** Required alongside `src`; ignored while the slot is a color block. */
  alt?: string;
  /** True for the block that is largest in the mobile viewport on first paint. */
  priority?: boolean;
  /**
   * How wide the slot renders, for next/image to pick a file. The default suits a slot
   * that spans a column; anything narrower should say so or it downloads too much.
   */
  sizes?: string;
  className?: string;
};

export default function MediaSlot({
  ratio,
  fill = false,
  tone,
  label,
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
}: MediaSlotProps) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div
      className={`overflow-hidden ${fill ? "absolute inset-0" : "relative"} ${TONE_CLASS[tone]} ${className}`}
      style={fill ? undefined : { aspectRatio: ratio.replace("/", " / ") }}
      // A color block carries no information; real media below gets a real alt.
      {...(src ? {} : { role: "presentation" as const, "aria-hidden": true })}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        isDev && (
          <span
            className={`absolute inset-0 flex px-4 py-3 text-center text-[11px] font-medium tracking-[0.12em] uppercase opacity-70 ${
              // A fill slot sits behind copy, so its label goes to the corner — the
              // bottom one, since the hero's top bar now occupies the top of that block.
              fill ? "items-end justify-end" : "items-center justify-center"
            }`}
          >
            <span className={LABEL_CLASS[tone]}>{label}</span>
          </span>
        )
      )}
    </div>
  );
}
