import LeadForm from "@/components/LeadForm";
import MediaSlot from "@/components/MediaSlot";
import WhatsAppLink from "@/components/WhatsAppLink";
import { buttonPrimary, buttonSecondary, eyebrow, headline, sectionShell } from "@/components/ui";
import { nav, visit } from "@/content/copy";
import { effectiveStatus } from "@/data/lots";
import { getLots } from "@/lib/lot-status";

export default async function Visit() {
  // Same read as the plan — Next dedupes the request — so the picker never offers a lot
  // the plan shows as taken.
  const availableLotIds = (await getLots())
    .filter((lot) => effectiveStatus(lot) === "disponible")
    .map((lot) => lot.id);

  return (
    <section id={nav.visitAnchor} className="bg-cream-100">
      <div className={sectionShell}>
        <p className={eyebrow}>{visit.eyebrow}</p>
        <h2 className={headline}>{visit.headline}</h2>

        <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-600">
          {visit.body.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        <div className="mt-8">
          <WhatsAppLink intent="visit" source="visit" className={buttonPrimary}>
            {visit.ctaWhatsApp}
          </WhatsAppLink>
        </div>

        <p className="mt-10 text-base text-ink-600">{visit.formIntro}</p>
        <div className="mt-4">
          <LeadForm availableLotIds={availableLotIds} />
        </div>

        <div className="mt-12">
          {/*
           * The sketch's street names are small — about 7px at full column width, and far
           * less on a phone — so the image opens at full size, where pinch-zoom makes them
           * readable. The link's accessible name is the alt text followed by where it goes.
           */}
          <a
            href={visit.map.src}
            target="_blank"
            rel="noopener noreferrer"
            className="block cursor-zoom-in rounded-[0.75rem]"
          >
            <MediaSlot
              ratio={visit.map.ratio}
              tone="cream-200"
              label={visit.map.alt}
              src={visit.map.src}
              alt={visit.map.alt}
              sizes="(min-width: 1024px) 960px, 100vw"
              className="rounded-[0.75rem] border border-cream-300"
            />
            <span className="sr-only"> {visit.map.zoomLabel}</span>
          </a>
          <p className="mt-2 text-xs text-ink-400">{visit.map.zoomHint}</p>

          <div className="mt-5">
            <a
              href={visit.directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonSecondary}
            >
              {visit.directions}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
