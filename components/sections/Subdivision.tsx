import MediaSlot from "@/components/MediaSlot";
import { buttonSecondary, eyebrow, headline, sectionShell } from "@/components/ui";
import { subdivision } from "@/content/copy";

export default function Subdivision() {
  return (
    <section id="el-fraccionamiento" className="bg-cream-50">
      <div className={sectionShell}>
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

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MediaSlot
            ratio="4/5"
            tone="pine-700"
            label={subdivision.mediaLabels[0]}
            className="rounded-[0.75rem]"
          />
          <MediaSlot
            ratio="4/5"
            tone="leaf-400"
            label={subdivision.mediaLabels[1]}
            className="rounded-[0.75rem]"
          />
        </div>

        <div className="mt-9">
          <a
            href={subdivision.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonSecondary}
          >
            {subdivision.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
