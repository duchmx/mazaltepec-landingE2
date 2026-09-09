import PlotMap from "@/components/plot-map/PlotMap";
import { eyebrow, headline } from "@/components/ui";
import { availability, nav } from "@/content/copy";

export default function Availability() {
  return (
    // Full bleed: the plan reaches the right edge of the page, so the section carries no
    // centred shell — the left column aligns its copy with every other section through
    // --page-gutter. No bottom padding at lg either: the plan runs to the section's bottom
    // edge so it reads as sitting on the corner, and the left column pads itself instead.
    <section
      id={nav.availabilityAnchor}
      className="overflow-hidden bg-cream-50 py-16 sm:py-24 lg:pb-0"
    >
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
