import MediaSlot from "@/components/MediaSlot";
import WhatsAppLink from "@/components/WhatsAppLink";
import { buttonOnDark, buttonPrimaryInverse } from "@/components/ui";
import { hero, nav } from "@/content/copy";

export default function Hero() {
  return (
    <section id="hero" className="relative isolate flex min-h-[100svh] items-end">
      <MediaSlot
        ratio="16/9"
        fill
        tone="pine-800"
        label={hero.mediaLabel}
        className="-z-10"
      />

      <div className="mx-auto w-full max-w-5xl px-5 pt-28 pb-16 sm:px-8 sm:pt-32 sm:pb-24">
        <p className="text-xs font-medium tracking-[0.18em] text-camel-200 uppercase">
          {hero.eyebrow}
        </p>

        <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-normal text-cream-50 sm:text-5xl">
          {hero.headline}
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-pine-100">
          {hero.body.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        <p className="mt-8 text-2xl font-medium text-cream-50 sm:text-3xl">{hero.price}</p>
        <p className="mt-1 text-sm text-pine-100">{hero.priceNote}</p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <WhatsAppLink intent="general" source="hero" className={buttonPrimaryInverse}>
            {hero.ctaWhatsApp}
          </WhatsAppLink>

          <a href={`#${nav.availabilityAnchor}`} className={buttonOnDark}>
            {hero.ctaAvailability}
          </a>
        </div>
      </div>
    </section>
  );
}
