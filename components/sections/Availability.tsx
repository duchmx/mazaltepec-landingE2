import PlotMap from "@/components/plot-map/PlotMap";
import { eyebrow, headline } from "@/components/ui";
import { availability, nav } from "@/content/copy";

export default function Availability() {
  return (
    // Full bleed: the plan reaches the right edge of the page, so the section carries no
    // centred shell. The left column aligns its copy with every other section through
    // --page-gutter.
    <section id={nav.availabilityAnchor} className="overflow-hidden bg-cream-50 py-16 sm:py-24">
      <PlotMap
        header={
          <div>
            <p className={eyebrow}>{availability.eyebrow}</p>
            <h2 className={headline}>{availability.headline}</h2>
          </div>
        }
      />
    </section>
  );
}
