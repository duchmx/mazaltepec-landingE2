"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { availability, whatsappHint } from "@/content/copy";
import { effectiveStatus, formatArea, getLot, LOTS, type LotStatus } from "@/data/lots";
import {
  PLOT_MAP_BASE,
  PLOT_MAP_VIEW_BOX,
  PlotMapArtwork,
} from "@/components/plot-map/artwork";
import { trackWhatsAppClick } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { whatsappLotUrl } from "@/lib/whatsapp";
import { buttonPrimary } from "@/components/ui";
import BrandGlyph from "@/components/BrandGlyph";

const MAP_ID = "plot-map";

/** Aligns the left column's copy with the centred sections above and below it. */
const COLUMN_PADDING = "px-5 pl-(--page-gutter) sm:px-8 sm:pl-(--page-gutter) lg:pr-0";

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

type PlotMapProps = {
  /**
   * The section's eyebrow and headline. Rendered on the server and passed in, because the
   * two-column layout is the map's own — the header sits in its left column, above the
   * selected lot, and the plan runs flush to the page edge on the right.
   */
  header: ReactNode;
};

export default function PlotMap({ header }: PlotMapProps) {
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
    /*
     * Source order is header, detail, plan, legend. On a phone that puts the hint — and the
     * lot's surface and call to action once one is chosen — directly under the headline, so
     * the answer always appears in the same place. On large screens explicit grid placement
     * collects those three into a left column and spans the plan down the right, so the
     * source order never has to fight the layout.
     */
    <div className="grid gap-y-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:grid-rows-[auto_auto_1fr] lg:gap-x-12 lg:gap-y-0">
      <style>{styles}</style>

      <div className={`${COLUMN_PADDING} lg:col-start-1 lg:row-start-1`}>{header}</div>

      {/* Sits high in the left column rather than centred in it, which is where the
          reference composition puts it against the plan's diagonal top edge.

          The reserved height is what keeps the plan still on a phone, where this slot sits
          above it: the selected state is 140px against the hint's 59px, so without it the
          plan would drop 81px on the tap and slide the lot out from under the finger that
          chose it. Raise it if the selected state ever grows taller. */}
      <div
        aria-live="polite"
        className={`${COLUMN_PADDING} min-h-[8.75rem] lg:col-start-1 lg:row-start-2 lg:mt-24 lg:min-h-0 lg:self-start`}
      >
        {selectedLot && status ? (
          <div>
            <p className="text-2xl font-medium text-ink-900">
              {availability.lotLabel} {selectedLot.id}
            </p>
            <p className="mt-1 text-lg text-ink-600">
              {formatArea(selectedLot.area)} {availability.areaUnit} ·{" "}
              {availability.legend[status]}
            </p>

            {status === "disponible" ? (
              <a
                href={whatsappLotUrl(selectedLot.id, getAttribution())}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("lot", { lot: selectedLot.id })}
                className={`${buttonPrimary} mt-6 w-full gap-2.5 sm:w-auto`}
              >
                <BrandGlyph name="whats" />
                {availability.detail.cta}{" "}
                <span className="sr-only">{whatsappHint}</span>
              </a>
            ) : (
              <p className="mt-6 text-base text-ink-600">{availability.detail.unavailable}</p>
            )}
          </div>
        ) : (
          <p className="max-w-sm text-lg leading-relaxed text-ink-600">
            {availability.detail.emptyState}
          </p>
        )}
      </div>

      {/* The plan runs to the right edge of the page and down to the section's bottom edge,
          so it reads as sitting on that corner. Height is the only thing driving its size
          and the locked ratio derives the width. That matters more than it looks: the SVG
          is stretched over this box, so a container that could take a different ratio would
          slide every lot off the drawing. Do not add a max-width or max-height here. */}
      <div className="relative w-full lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:h-[min(108vh,64rem)] lg:w-auto lg:self-end lg:[aspect-ratio:211/265.224]">
        {PLOT_MAP_BASE ? (
          <Image
            src={PLOT_MAP_BASE.src}
            width={PLOT_MAP_BASE.width}
            height={PLOT_MAP_BASE.height}
            alt=""
            aria-hidden="true"
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="block h-full w-full select-none object-cover"
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

      <ul
        className={`${COLUMN_PADDING} flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-600 lg:col-start-1 lg:row-start-3 lg:mt-10 lg:self-start lg:pb-16`}
      >
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
    </div>
  );
}
