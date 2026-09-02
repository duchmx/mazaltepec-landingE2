"use client";

import { useEffect, useState } from "react";
import { captureAttribution, type Attribution } from "@/lib/attribution";

const EMPTY: Attribution = { advisor: null, utm: {} };

/**
 * Attribution is only available in the browser, so the first client render matches the
 * server (no advisor code) and links are upgraded immediately after mount.
 */
export function useAttribution(): Attribution {
  const [attribution, setAttribution] = useState<Attribution>(EMPTY);

  useEffect(() => {
    setAttribution(captureAttribution());
  }, []);

  return attribution;
}
