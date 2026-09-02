"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { availability } from "@/content/copy";
import { effectiveStatus, formatArea, getLot, LOTS, type LotStatus } from "@/data/lots";
import { PLOT_MAP_VIEW_BOX, PlotMapArtwork } from "@/components/plot-map/artwork";
import { trackWhatsAppClick } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { whatsappLotUrl } from "@/lib/whatsapp";

const MAP_ID = "plot-map";

const STATUS_FILL: Record<LotStatus, string> = {
  disponible: "var(--color-leaf-400)",
  apartado: "var(--color-camel-200)",
  vendido: "var(--color-ink-200)",
};

const LABEL_FILL: Record<LotStatus, string> = {
  disponible: "var(--color-pine-800)",
  apartado: "var(--color-camel-700)",
  vendido: "var(--color-ink-400)",
};

type LotLabel = { id: string; x: number; y: number; status: LotStatus };

/**
 * Status colors are emitted as CSS keyed on the artwork's own `id` attributes, so the map
 * is painted correctly on the server and stays correct after the artwork is swapped.
 */
function statusStyles(): string {
  const byStatus: Record<LotStatus, string[]> = { disponible: [], apartado: [], vendido: [] };
  for (const lot of LOTS) {
    byStatus[effectiveStatus(lot)].push(`#${MAP_ID} [id="${lot.id}"]`);
  }

  const fills = (Object.keys(byStatus) as LotStatus[])
    .filter((status) => byStatus[status].length > 0)
    .map(
      (status) =>
        `${byStatus[status].join(",")}{fill:${STATUS_FILL[status]};stroke:var(--color-cream-50);stroke-width:2}`,
    )
    .join("");

  // Interaction states come after the fills so they win at equal specificity.
  const states = [
    `#${MAP_ID} [data-lot-status]{outline:none}`,
    `#${MAP_ID} [data-lot-status="disponible"]{cursor:pointer;transition:fill 120ms cubic-bezier(0.2,0,0,1)}`,
    `#${MAP_ID} [data-lot-status="disponible"]:hover{fill:var(--color-pine-600)}`,
    `#${MAP_ID} [data-lot-selected="true"]{fill:var(--color-pine-800)}`,
    `#${MAP_ID} [data-lot-status]:focus-visible{stroke:var(--color-pine-800);stroke-width:4}`,
    `@media (prefers-reduced-motion: reduce){#${MAP_ID} [data-lot-status]{transition:none}}`,
  ].join("");

  return fills + states;
}

export default function PlotMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [labels, setLabels] = useState<LotLabel[]>([]);
  const styles = useMemo(statusStyles, []);

  const selectedLot = selected ? getLot(selected) : undefined;

  const select = useCallback((id: string) => {
    setSelected((current) => (current === id ? null : id));
  }, []);

  /**
   * Lots are bound by looking up the `id` in the artwork, so replacing the artwork file
   * needs no changes here. Attributes and listeners are applied imperatively because the
   * artwork is opaque to React.
   */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const cleanups: Array<() => void> = [];

    for (const lot of LOTS) {
      const node = svg.querySelector<SVGGraphicsElement>(`[id="${lot.id}"]`);
      if (!node) continue;

      const status = effectiveStatus(lot);
      const interactive = status !== "vendido";

      node.setAttribute("data-lot-status", status);
      node.setAttribute("role", "button");
      node.setAttribute(
        "aria-label",
        availability.lotAccessibleName
          .replace("{lot}", lot.id)
          .replace("{area}", formatArea(lot.area))
          .replace("{status}", availability.legend[status].toLowerCase()),
      );

      if (!interactive) {
        node.setAttribute("aria-disabled", "true");
        continue;
      }

      node.setAttribute("tabindex", "0");

      const onActivate = () => select(lot.id);
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onActivate();
        }
      };

      node.addEventListener("click", onActivate);
      node.addEventListener("keydown", onKeyDown);
      cleanups.push(() => {
        node.removeEventListener("click", onActivate);
        node.removeEventListener("keydown", onKeyDown);
      });
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [select]);

  /** Lot numbers are positioned from the artwork's geometry, never baked into it. */
  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const measured: LotLabel[] = [];
    for (const lot of LOTS) {
      const node = svg.querySelector<SVGGraphicsElement>(`[id="${lot.id}"]`);
      if (!node) continue;
      const box = node.getBBox();
      measured.push({
        id: lot.id,
        x: box.x + box.width / 2,
        y: box.y + box.height / 2,
        status: effectiveStatus(lot),
      });
    }
    setLabels(measured);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    for (const lot of LOTS) {
      const node = svg.querySelector<SVGGraphicsElement>(`[id="${lot.id}"]`);
      if (!node) continue;
      if (lot.id === selected) node.setAttribute("data-lot-selected", "true");
      else node.removeAttribute("data-lot-selected");
    }
  }, [selected]);

  const status = selectedLot ? effectiveStatus(selectedLot) : null;

  return (
    <div>
      <style>{styles}</style>

      <svg
        id={MAP_ID}
        ref={svgRef}
        viewBox={PLOT_MAP_VIEW_BOX}
        className="w-full rounded-[0.75rem] border border-cream-300 bg-cream-100"
        role="group"
        aria-label={availability.mapTitle}
      >
        <title>{availability.mapTitle}</title>
        <desc>{availability.mapDescription}</desc>

        <PlotMapArtwork />

        {/* Lot numbers, drawn over the artwork. The paths carry the accessible names. */}
        <g aria-hidden="true" pointerEvents="none">
          {labels.map((label) => (
            <text
              key={label.id}
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="26"
              fontWeight="500"
              fill={label.id === selected ? "var(--color-cream-50)" : LABEL_FILL[label.status]}
            >
              {label.id.replace("L-", "")}
            </text>
          ))}
        </g>
      </svg>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-600">
        {(Object.keys(STATUS_FILL) as LotStatus[]).map((key) => (
          <li key={key} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-3 w-3 rounded-sm border border-cream-300"
              style={{ background: STATUS_FILL[key] }}
            />
            {availability.legend[key]}
          </li>
        ))}
      </ul>

      {/* Detail panel. Announced when a lot is chosen. */}
      <div
        aria-live="polite"
        className="mt-6 rounded-[0.75rem] border border-cream-300 bg-cream-100 p-5"
      >
        {selectedLot && status ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-medium text-ink-900">
                {availability.lotLabel} {selectedLot.id}
              </p>
              <p className="text-sm text-ink-600">
                {availability.detail.surface}: {formatArea(selectedLot.area)}{" "}
                {availability.areaUnit} · {availability.legend[status]}
              </p>
            </div>

            {status === "disponible" ? (
              <a
                href={whatsappLotUrl(selectedLot.id, getAttribution())}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("lot", { lot: selectedLot.id })}
                className="inline-flex shrink-0 items-center justify-center rounded-[0.75rem] bg-pine-800 px-5 py-3 text-sm font-medium text-cream-50 hover:bg-pine-700"
              >
                {availability.detail.cta}
              </a>
            ) : (
              <p className="text-sm text-ink-600">{availability.detail.unavailable}</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-ink-600">{availability.detail.emptyState}</p>
        )}
      </div>
    </div>
  );
}
