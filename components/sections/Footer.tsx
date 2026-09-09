import BrandLogo from "@/brand_system/integration/react/BrandLogo";
import BrandGlyph from "@/components/BrandGlyph";
import SocialGlyph from "@/components/SocialGlyph";
import { footer } from "@/content/copy";
import { WHATSAPP_NUMBER, whatsappUrl } from "@/lib/whatsapp";

/** Dial-able form of the sales line: +52 993 228 2449. */
const TEL_HREF = `tel:+${WHATSAPP_NUMBER.replace(/^521/, "52")}`;

const ICON_LINK =
  "inline-flex size-11 items-center justify-center rounded-[0.75rem] text-cream-50 hover:bg-cream-50/10";

export default function Footer() {
  return (
    <footer className="bg-pine-800 text-cream-50">
      {/* Extra bottom padding on mobile so the sticky WhatsApp bar covers nothing. */}
      <div className="mx-auto w-full max-w-5xl px-5 pt-10 pb-32 sm:px-8 sm:pb-10">
        {/* One thin band: the mark on the left, the ways to reach us on the right. */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
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
          </div>

          <ul className="-mx-2 flex items-center gap-1">
            <li>
              <a
                href={whatsappUrl("general")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={footer.contact.whatsapp}
                className={ICON_LINK}
              >
                <BrandGlyph name="whats" className="size-6" />
              </a>
            </li>
            <li>
              <a href={TEL_HREF} aria-label={`${footer.contact.phone}: ${footer.phone}`} className={ICON_LINK}>
                <BrandGlyph name="telefono" className="size-6" />
              </a>
            </li>
            <li>
              <a
                href={footer.facebookHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={footer.contact.facebook}
                className={ICON_LINK}
              >
                <SocialGlyph name="facebook" className="size-6" />
              </a>
            </li>
            <li>
              <a
                href={footer.instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={footer.contact.instagram}
                className={ICON_LINK}
              >
                <SocialGlyph name="instagram" className="size-6" />
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-pine-700 pt-6 text-xs text-pine-100/70 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl leading-relaxed">{footer.disclaimer}</p>

          <div className="flex shrink-0 items-center gap-5">
            <a href={TEL_HREF} className="hover:text-cream-50">
              {footer.phone}
            </a>
            <a
              href={footer.privacyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream-50"
            >
              {footer.privacy}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
