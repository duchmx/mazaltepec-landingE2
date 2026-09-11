import MediaSlot, { type MediaTone } from "@/components/MediaSlot";

/**
 * Edge-to-edge strip of media slots that drifts sideways on a slow, continuous loop.
 *
 * The track holds the slides twice and translates by exactly -50%, so the second copy
 * lands where the first began and the seam is invisible. Only `transform` animates, which
 * the compositor handles without layout or paint work.
 *
 * The first pass carries the photographs' alt text; the duplicate pass is a visual
 * continuation only and is hidden from assistive technology, so nothing is read twice. A
 * slide without `src` falls back to a flat brand-colour block.
 *
 * Under `prefers-reduced-motion` the animation stops and the strip becomes an ordinary
 * horizontal scroller, so nothing is unreachable.
 */

/** Cycled so the strip reads as one intentional, monochrome-ish run of colour. */
const TONES: MediaTone[] = ["pine-800", "leaf-400", "pine-700", "cream-200"];

/** Tile widths at each breakpoint: 22/26/36rem tall at 4/5. */
const TILE_SIZES = "(min-width: 1024px) 461px, (min-width: 640px) 333px, 282px";

export type MarqueeSlide = { src?: string; alt: string };

type MediaMarqueeProps = {
  slides: readonly MarqueeSlide[];
  /** Accessible name for the strip as a whole. */
  ariaLabel: string;
  /** Seconds for one full pass. Longer is slower; the default is a slow drift. */
  duration?: number;
};

export default function MediaMarquee({ slides, ariaLabel, duration = 80 }: MediaMarqueeProps) {
  // Two passes of the same slides. The second is a visual continuation, not content.
  const passes = [
    { key: "lead", hidden: false },
    { key: "tail", hidden: true },
  ];

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="media-marquee relative w-full overflow-x-hidden"
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      <div className="media-marquee__track flex w-max gap-4 pl-4 sm:gap-5 sm:pl-5">
        {passes.map((pass) =>
          slides.map((slide, index) => (
            <div
              key={`${pass.key}-${slide.src ?? slide.alt}`}
              aria-hidden={pass.hidden || undefined}
              className="relative aspect-4/5 h-[22rem] shrink-0 overflow-hidden rounded-[0.75rem] sm:h-[26rem] lg:h-[36rem]"
            >
              <MediaSlot
                ratio="4/5"
                fill
                tone={TONES[index % TONES.length]}
                label={slide.alt}
                src={slide.src}
                // The duplicate pass is aria-hidden already; an empty alt keeps it silent
                // even to tools that read images directly.
                alt={pass.hidden ? "" : slide.alt}
                sizes={TILE_SIZES}
              />
            </div>
          )),
        )}
      </div>
    </div>
  );
}
