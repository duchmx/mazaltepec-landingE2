"use client";

import { useEffect, useState } from "react";
import WhatsAppLink from "@/components/WhatsAppLink";
import { sticky } from "@/content/copy";

/** Mobile-only. Appears once the hero — and its own WhatsApp CTA — has scrolled away. */
export default function StickyWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById("hero");
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(heroEl);

    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-pine-700 bg-cream-50/95 p-3 backdrop-blur sm:hidden">
      <WhatsAppLink
        intent="general"
        source="sticky"
        className="flex w-full items-center justify-center rounded-[0.75rem] bg-pine-800 px-6 py-3.5 text-base font-medium text-cream-50"
      >
        {sticky.cta}
      </WhatsAppLink>
    </div>
  );
}
