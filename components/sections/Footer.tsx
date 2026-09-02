import { footer } from "@/content/copy";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="bg-pine-800 text-cream-50">
      {/* Extra bottom padding on mobile so the sticky WhatsApp bar covers nothing. */}
      <div className="mx-auto w-full max-w-5xl px-5 pt-14 pb-32 sm:px-8 sm:pb-14">
        <p className="text-xl font-medium">{footer.brand}</p>
        {/* Subordinate to the Mazaltepec mark: lighter weight, smaller, lower contrast. */}
        <p className="mt-1 text-sm font-light text-pine-100/80">{footer.developer}</p>

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
