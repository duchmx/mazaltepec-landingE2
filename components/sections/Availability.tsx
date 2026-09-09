import PlotMap from "@/components/plot-map/PlotMap";
import { eyebrow, headline, sectionShell } from "@/components/ui";
import { availability, nav } from "@/content/copy";

export default function Availability() {
  return (
    <section id={nav.availabilityAnchor} className="bg-cream-50">
      <div className={sectionShell}>
        <p className={eyebrow}>{availability.eyebrow}</p>
        <h2 className={headline}>{availability.headline}</h2>

        <div className="mt-10">
          <PlotMap />
        </div>
      </div>
    </section>
  );
}
