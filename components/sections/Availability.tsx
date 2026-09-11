import PlotMap from "@/components/plot-map/PlotMap";
import { getLots } from "@/lib/lot-status";
import { eyebrow, headline } from "@/components/ui";
import { availability, nav } from "@/content/copy";

export default async function Availability() {
  const lots = await getLots();

  return (
    // No bottom padding at any width: the plan's own bottom edge is the end of the section.
    // At lg it is unpadded entirely — the plan fills the right half edge to edge and its
    // locked ratio sets the section's height. The left column pads itself, aligning its
    // copy with every other section through --page-gutter.
    <section
      id={nav.availabilityAnchor}
      // overflow-x-clip, not overflow-hidden: `hidden` would make this a scroll container
      // and silently break the left column's position: sticky. `clip` does not.
      className="overflow-x-clip bg-cream-50 pt-16 sm:pt-24 lg:pt-0"
    >
      <PlotMap
        lots={lots}
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
