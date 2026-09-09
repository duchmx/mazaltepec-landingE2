import PlotMap from "@/components/plot-map/PlotMap";
import { eyebrow, headline } from "@/components/ui";
import { availability, nav } from "@/content/copy";

export default function Availability() {
  return (
    // Full bleed and, at lg, unpadded: the plan fills the right half edge to edge and its
    // locked ratio sets the section's height, so the drawing meets the section's top and
    // bottom exactly. The left column pads itself, aligning its copy with every other
    // section through --page-gutter.
    <section
      id={nav.availabilityAnchor}
      // overflow-x-clip, not overflow-hidden: `hidden` would make this a scroll container
      // and silently break the left column's position: sticky. `clip` does not.
      className="overflow-x-clip bg-cream-50 py-16 sm:py-24 lg:py-0"
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
