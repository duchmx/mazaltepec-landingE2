"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { availability } from "@/content/copy";
import { effectiveStatus, formatArea, getLot, LOTS, type LotStatus } from "@/data/lots";
import {
  PLOT_MAP_BASE,
  PLOT_MAP_VIEW_BOX,
  PlotMapArtwork,
} from "@/components/plot-map/artwork";
import { trackWhatsAppClick } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { whatsappLotUrl } from "@/lib/whatsapp";

const MAP_ID = "plot-map";

/**
 * Lot tinting sits ON TOP of the rendered plan, so an available lot is left alone and the
 * artwork's own green shows through. Sold lots are washed back toward the page surface;
 * reserved lots take the camel accent. Never a full-strength fill — the drawing must read.
 */
const STATUS_TINT: Record<LotStatus, { fill: string; opacity: number }> = {
  disponible: { fill: "transparent", opacity: 0 },
  apartado: { fill: "var(--color-camel-500)", opacity: 0.5 },
  vendido: { fill: "var(--color-cream-50)", opacity: 0.72 },
};

/** Legend swatches approximate what each status looks like over the plan's green. */
const LEGEND_SWATCH: Record<LotStatus, string> = {
  disponible: "#8CA85F",
  apartado: "#A8A177",
  vendido: "#DCE0D2",
};

const LABEL_FILL: Record<LotStatus, string> = {
  disponible: "var(--color-cream-50)",
  apartado: "var(--color-ink-900)",
  vendido: "var(--color-ink-600)",
};

type LotLabel = { id: string; x: number; y: number; status: LotStatus };

/**
 * Status paint is emitted as CSS keyed on the artwork's own `id` attributes, so the map is
 * correct on the server and stays correct after the artwork is swapped.
 */
function statusStyles(): string {
  const byStatus: Record<LotStatus, string[]> = { disponible: [], apartado: [], vendido: [] };
  for (const lot of LOTS) {
    byStatus[effectiveStatus(lot)].push(`#${MAP_ID} [id="${lot.id}"]`);
  }

  const fills = (Object.keys(byStatus) as LotStatus[])
    .filter((status) => byStatus[status].length > 0)
    .map((status) => {
      const tint = STATUS_TINT[status];
      return `${byStatus[status].join(",")}{fill:${tint.fill};fill-opacity:${tint.opacity};stroke:var(--color-cream-50);stroke-opacity:0.55;stroke-width:0.4}`;
    })
    .join("");

  // Interaction states come after the fills so they win at equal specificity.
  const states = [
    `#${MAP_ID} [data-lot-status]{outline:none}`,
    `#${MAP_ID} [data-lot-status="disponible"]{cursor:pointer;transition:fill-opacity 120ms cubic-bezier(0.2,0,0,1)}`,
    `#${MAP_ID} [data-lot-status="disponible"]:hover{fill:var(--color-pine-800);fill-opacity:0.28}`,
    `#${MAP_ID} [data-lot-selected="true"]{fill:var(--color-pine-800);fill-opacity:0.55;stroke:var(--color-cream-50);stroke-opacity:1;stroke-width:0.9}`,
    `#${MAP_ID} [data-lot-status]:focus-visible{stroke:var(--color-ink-900);stroke-opacity:1;stroke-width:1.4}`,
    `@media (prefers-reduced-motion: reduce){#${MAP_ID} [data-lot-status]{transition:none}}`,
  ].join("");

  return fills + states;
}

export default function PlotMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [measured, setMeasured] = useState<LotLabel[]>([]);
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

  /**
   * Lot numbers are positioned from the data's anchors, never baked into the artwork.
   * Anchors are optional, so anything without one falls back to its path's bounding box —
   * which keeps a freshly swapped drawing readable before the anchors are retuned.
   */
  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (LOTS.every((lot) => lot.anchor)) return;

    const found: LotLabel[] = [];
    for (const lot of LOTS) {
      if (lot.anchor) continue;
      const node = svg.querySelector<SVGGraphicsElement>(`[id="${lot.id}"]`);
      if (!node) continue;
      const box = node.getBBox();
      found.push({
        id: lot.id,
        x: box.x + box.width / 2,
        y: box.y + box.height / 2,
        status: effectiveStatus(lot),
      });
    }
    setMeasured(found);
  }, []);

  const labels: LotLabel[] = useMemo(() => {
    const fallback = new Map(measured.map((label) => [label.id, label]));
    return LOTS.flatMap((lot) => {
      const point = lot.anchor ?? fallback.get(lot.id);
      if (!point) return [];
      return [{ id: lot.id, x: point.x, y: point.y, status: effectiveStatus(lot) }];
    });
  }, [measured]);

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

      <div className="relative mx-auto w-full max-w-[36rem] overflow-hidden rounded-[0.75rem] border border-cream-300 bg-cream-100">
        {PLOT_MAP_BASE ? (
          <Image
            src={PLOT_MAP_BASE.src}
            width={PLOT_MAP_BASE.width}
            height={PLOT_MAP_BASE.height}
            alt=""
            aria-hidden="true"
            sizes="(min-width: 640px) 36rem, 100vw"
            className="block h-auto w-full select-none"
            priority={false}
          />
        ) : null}

        <svg
          id={MAP_ID}
          ref={svgRef}
          viewBox={PLOT_MAP_VIEW_BOX}
          className="absolute inset-0 h-full w-full"
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
                dominantBaseline="central"
                fontSize="7"
                fontWeight="500"
                fill={label.id === selected ? "var(--color-cream-50)" : LABEL_FILL[label.status]}
              >
                {label.id.replace("L-", "")}
              </text>
            ))}
          </g>
        </svg>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-600">
        {(Object.keys(STATUS_TINT) as LotStatus[]).map((key) => (
          <li key={key} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-3 w-3 rounded-sm border border-cream-300"
              style={{ background: LEGEND_SWATCH[key] }}
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
