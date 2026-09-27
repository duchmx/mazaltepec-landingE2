import PlotMap from "@/components/plot-map/PlotMap";
import WhatsAppLink from "@/components/WhatsAppLink";
import { getLots } from "@/lib/lot-status";
import { buttonPrimary, eyebrow, headline } from "@/components/ui";
import { availability, nav } from "@/content/copy";
import type { Lot } from "@/data/lots";

/**
 * The database is the only source of truth for lot status (lib/lot-status.ts), so a read
 * that fails must not invent statuses — but it also must not take the rest of the page down
 * with it. Caught here, once, so every other section still renders when this one can't.
 */
async function safeGetLots(): Promise<Lot[] | null> {
  try {
    return await getLots();
  } catch (error) {
    console.error("Availability: live lot status unavailable.", error);
    return null;
  }
}

export default async function Availability() {
  const lots = await safeGetLots();

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
      {lots ? (
        <PlotMap
          lots={lots}
          header={
            <div>
              <p className={eyebrow}>{availability.eyebrow}</p>
              <h2 className={headline}>{availability.headline}</h2>
            </div>
          }
        />
      ) : (
        <div className="px-5 pl-(--page-gutter) sm:px-8 sm:pl-(--page-gutter)">
          <p className={eyebrow}>{availability.eyebrow}</p>
          <h2 className={headline}>{availability.headline}</h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-600">
            {availability.loadError}
          </p>
          <div className="mt-6">
            <WhatsAppLink intent="availableLots" source="availability-error" className={buttonPrimary}>
              {availability.detail.ctaUnavailable}
            </WhatsAppLink>
          </div>
        </div>
      )}
    </section>
  );
}
