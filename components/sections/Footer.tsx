import BrandLogo from "@/brand_system/integration/react/BrandLogo";
import { footer } from "@/content/copy";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="bg-pine-800 text-cream-50">
      {/* Extra bottom padding on mobile so the sticky WhatsApp bar covers nothing. */}
      <div className="mx-auto w-full max-w-5xl px-5 pt-14 pb-32 sm:px-8 sm:pb-14">
        {/* Footer ground is pine-800, so the mark is `blanco` — never color or negro.
            mt-4 on the Arvore line clears one rhombus of the isotype (12.8px at h-8). */}
        <BrandLogo
          orientation="horizontal"
          variant="blanco"
          alt={footer.brand}
          className="h-8 w-auto max-w-none"
        />
        {/* Subordinate to the Mazaltepec mark: lighter weight, smaller, lower contrast. */}
        <p className="mt-4 text-sm font-light text-pine-100/80">{footer.developer}</p>

        <div className="mt-8 flex flex-col gap-2 text-base sm:flex-row sm:gap-8">
          <a href={`tel:+${WHATSAPP_NUMBER.replace(/^521/, "52")}`} className="hover:text-pine-100">
            {footer.phone}
          </a>
          <a
            href={footer.privacyHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pine-100"
          >
            {footer.privacy}
          </a>
        </div>

        <p className="mt-10 max-w-xl text-xs leading-relaxed text-pine-100/70">
          {footer.disclaimer}
        </p>
      </div>
    </footer>
  );
}
