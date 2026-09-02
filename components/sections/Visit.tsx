import LeadForm from "@/components/LeadForm";
import MediaSlot from "@/components/MediaSlot";
import WhatsAppLink from "@/components/WhatsAppLink";
import { buttonPrimary, buttonSecondary, eyebrow, headline, sectionShell } from "@/components/ui";
import { nav, visit } from "@/content/copy";

export default function Visit() {
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
          <LeadForm />
        </div>

        <div className="mt-12">
          <MediaSlot
            ratio="16/9"
            tone="cream-200"
            label={visit.mediaLabel}
            className="rounded-[0.75rem]"
          />
          <div className="mt-4">
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
