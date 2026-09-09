"use client";

import type { ReactNode } from "react";
import BrandGlyph from "@/components/BrandGlyph";
import { whatsappHint } from "@/content/copy";
import { trackWhatsAppClick } from "@/lib/analytics";
import { useAttribution } from "@/lib/useAttribution";
import { whatsappUrl, type WhatsAppIntent } from "@/lib/whatsapp";

type WhatsAppLinkProps = {
  intent: WhatsAppIntent;
  /** Where on the page the click came from, sent with the analytics event. */
  source: string;
  children: ReactNode;
  className?: string;
};

/**
 * The WhatsApp mark carries the destination visually, so the label itself does not have to
 * say "WhatsApp". The hint keeps that information for anyone not seeing the icon: it is
 * read as part of the link's accessible name and never shown.
 */

export default function WhatsAppLink({
  intent,
  source,
  children,
  className = "",
}: WhatsAppLinkProps) {
  const attribution = useAttribution();

  return (
    <a
      href={whatsappUrl(intent, attribution)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick(source, { advisor: attribution.advisor ?? undefined })}
      className={`${className} gap-2.5`}
    >
      <BrandGlyph name="whats" />
      {children}{" "}
      <span className="sr-only">{whatsappHint}</span>
    </a>
  );
}
