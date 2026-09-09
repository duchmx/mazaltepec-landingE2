import { whatsappMessages } from "@/content/copy";
import type { Attribution } from "@/lib/attribution";

/** +52 993 228 2449 in wa.me form (Mexican mobile prefix "1"). */
export const WHATSAPP_NUMBER = "5219932282449";

export type WhatsAppIntent = "general" | "availableLots" | "payment" | "visit";

function toUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Appends the advisor code so the conversation lands with the right salesperson. */
function withAdvisor(message: string, advisor: string | null): string {
  return advisor ? `${message} (ref ${advisor})` : message;
}

export function whatsappUrl(intent: WhatsAppIntent, attribution?: Attribution): string {
  return toUrl(withAdvisor(whatsappMessages[intent], attribution?.advisor ?? null));
}

/**
 * Lot-specific message. The reference in parentheses is the advisor code; without one
 * the parenthetical is dropped rather than sent empty.
 */
export function whatsappLotUrl(lotId: string, attribution?: Attribution): string {
  const advisor = attribution?.advisor ?? null;
  const message = advisor
    ? whatsappMessages.lot.replace("{lot}", lotId).replace("{ref}", advisor)
    : whatsappMessages.lot
        .replace("{lot}", lotId)
        .replace(" (ref {ref})", "");
  return toUrl(message);
}
