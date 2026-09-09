import MediaMarquee from "@/components/MediaMarquee";
import { buttonSecondary, eyebrow, headline } from "@/components/ui";
import { subdivision } from "@/content/copy";

export default function Subdivision() {
  return (
    <section id="el-fraccionamiento" className="bg-cream-50 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <p className={eyebrow}>{subdivision.eyebrow}</p>
        <h2 className={headline}>{subdivision.headline}</h2>

        <ul className="mt-8 max-w-2xl space-y-3 text-lg leading-relaxed text-ink-600">
          {subdivision.points.map((point) => (
            <li key={point} className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-700" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

      </div>

      {/* Full-bleed: the marquee runs edge to edge, outside the centred text column. */}
      <div className="mt-10">
        <MediaMarquee
          labels={subdivision.mediaLabels}
          ariaLabel={subdivision.carouselLabel}
        />
      </div>

      <div className="mx-auto mt-10 w-full max-w-5xl px-5 sm:px-8">
        <a
          href={subdivision.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonSecondary}
        >
          {subdivision.cta}
        </a>
      </div>
    </section>
  );
}
