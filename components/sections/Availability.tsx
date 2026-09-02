import PlotMap from "@/components/plot-map/PlotMap";
import { eyebrow, headline, sectionShell } from "@/components/ui";
import { availability, nav } from "@/content/copy";
import { availableCount } from "@/data/lots";

export default function Availability() {
  const counter = availability.counter.replace("{available}", String(availableCount()));

  return (
    <section id={nav.availabilityAnchor} className="bg-cream-50">
      <div className={sectionShell}>
        <p className={eyebrow}>{availability.eyebrow}</p>
        <h2 className={headline}>{availability.headline}</h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-600">
          {availability.body}
        </p>

        <div className="mt-10">
          <PlotMap />
        </div>

        <p className="mt-6 text-sm text-ink-600">{counter}</p>
      </div>
    </section>
  );
}
