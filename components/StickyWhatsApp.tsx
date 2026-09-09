"use client";

import { useEffect, useState } from "react";
import WhatsAppLink from "@/components/WhatsAppLink";
import { nav, sticky } from "@/content/copy";

/**
 * Mobile-only. Appears once the availability section is behind you.
 *
 * It used to key off the hero, but the plan carries its own bottom bar for the selected
 * lot and two stacked bars on a phone is one too many. Availability sits directly below
 * the hero, so gating on it keeps the old behaviour everywhere else on the page.
 *
 * Deliberately not an IntersectionObserver. That only reports when the intersecting state
 * changes, and a jump from below the section to clear above it — an anchor link, a restored
 * scroll position — leaves that state unchanged at `false`, so no callback fires and the
 * button never appears. Reading the position answers correctly from any scroll position,
 * including the first paint after a restore.
 */
export default function StickyWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const gate =
      document.getElementById(nav.availabilityAnchor) ?? document.getElementById("hero");
    if (!gate) return;

    // Above the viewport, not merely out of it: scrolling back up hides it again, which
    // hands the screen back to the plan's own bar. One rect read per scroll event, and
    // React drops the re-render whenever the answer has not changed — no rAF throttle,
    // which would stall this behind a paused frame loop on a backgrounded tab.
    const measure = () => setVisible(gate.getBoundingClientRect().bottom < 0);

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
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
