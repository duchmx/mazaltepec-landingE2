"use client";

import type { ReactNode } from "react";
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
      className={className}
    >
      {children}
    </a>
  );
}
