import MediaSlot, { type MediaTone } from "@/components/MediaSlot";

/**
 * Edge-to-edge strip of media slots that drifts sideways on a slow, continuous loop.
 *
 * The track holds the slides twice and translates by exactly -50%, so the second copy
 * lands where the first began and the seam is invisible. Only `transform` animates, which
 * the compositor handles without layout or paint work.
 *
 * It is decorative: the duplicate set is hidden from assistive technology, and the whole
 * strip carries a group label rather than announcing each slide. When real photography
 * arrives, passing `src` to the slots is the only change.
 *
 * Under `prefers-reduced-motion` the animation stops and the strip becomes an ordinary
 * horizontal scroller, so nothing is unreachable.
 */

/** Cycled so the strip reads as one intentional, monochrome-ish run of colour. */
const TONES: MediaTone[] = ["pine-800", "leaf-400", "pine-700", "cream-200"];

type MediaMarqueeProps = {
  labels: readonly string[];
  /** Accessible name for the strip as a whole. */
  ariaLabel: string;
  /** Seconds for one full pass. Longer is slower; the default is a slow drift. */
  duration?: number;
};

export default function MediaMarquee({ labels, ariaLabel, duration = 80 }: MediaMarqueeProps) {
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
          labels.map((label, index) => (
            <div
              key={`${pass.key}-${label}`}
              aria-hidden={pass.hidden || undefined}
              className="relative aspect-4/5 h-[22rem] shrink-0 overflow-hidden rounded-[0.75rem] sm:h-[26rem] lg:h-[36rem]"
            >
              <MediaSlot ratio="4/5" fill tone={TONES[index % TONES.length]} label={label} />
            </div>
          )),
        )}
      </div>
    </div>
  );
}
