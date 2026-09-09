import BrandLogo from "@/brand_system/integration/react/BrandLogo";
import MediaSlot from "@/components/MediaSlot";
import WhatsAppLink from "@/components/WhatsAppLink";
import { buttonOnDark, buttonPrimaryInverse } from "@/components/ui";
import { hero, nav, topBar } from "@/content/copy";

export default function Hero() {
  return (
    <section id="hero" className="relative isolate flex min-h-[100svh] flex-col">
      <MediaSlot
        ratio="16/9"
        fill
        tone="pine-800"
        label={hero.mediaLabel}
        className="-z-10"
      />

      {/* Static top bar: part of the hero, scrolls away with it. Never sticky or fixed —
          the mobile WhatsApp bar is the only fixed element on the page.
          Padding is the brand clear-space rule: one rhombus of the isotype, which is 12.4%
          of the lockup's width, so 14px at h-9 and 16px at h-10. px-4/py-4 clears both. */}
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <a
          href={topBar.homeHref}
          aria-label={topBar.homeLabel}
          className="inline-flex rounded-[0.75rem]"
        >
          {/* Hero sits on pine-800; the brand rule takes `blanco` over dark grounds. */}
          <BrandLogo
            orientation="horizontal"
            variant="blanco"
            /* max-w-none: Tailwind's preflight caps images at 100% of their container,
               which collapses the lockup to 0 inside a shrink-to-fit anchor. */
            className="h-9 w-auto max-w-none md:h-10"
          />
        </a>
      </div>

      <div className="mx-auto mt-auto w-full max-w-5xl px-5 pt-16 pb-16 sm:px-8 sm:pt-20 sm:pb-24">
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
