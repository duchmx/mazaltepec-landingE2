import WhatsAppLink from "@/components/WhatsAppLink";
import { buttonPrimary, eyebrow, headline, sectionShell } from "@/components/ui";
import { payment } from "@/content/copy";

export default function Payment() {
  return (
    <section id="credito-directo" className="bg-cream-100">
      <div className={sectionShell}>
        <p className={eyebrow}>{payment.eyebrow}</p>
        <h2 className={headline}>{payment.headline}</h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-600">{payment.body}</p>

        <p className="mt-8 max-w-2xl border-l-2 border-camel-500 pl-5 text-xl font-medium text-ink-900 sm:text-2xl">
          {payment.figure}
        </p>

        <div className="mt-9">
          <WhatsAppLink intent="payment" source="payment" className={buttonPrimary}>
            {payment.cta}
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
