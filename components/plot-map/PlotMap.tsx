"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { availability, whatsappHint } from "@/content/copy";
import { effectiveStatus, formatArea, type Lot, type LotStatus } from "@/data/lots";
import {
  PLOT_MAP_BASE,
  PLOT_MAP_VIEW_BOX,
  PlotMapArtwork,
} from "@/components/plot-map/artwork";
import { trackWhatsAppClick } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { whatsappLotUrl, whatsappUrl } from "@/lib/whatsapp";
import { buttonPrimary } from "@/components/ui";
import BrandGlyph from "@/components/BrandGlyph";

const MAP_ID = "plot-map";

/** Aligns the left column's copy with the centred sections above and below it. */
const COLUMN_PADDING = "px-5 pl-(--page-gutter) sm:px-8 sm:pl-(--page-gutter) lg:pr-0";

/**
 * Lot tinting sits ON TOP of the rendered plan. Available lots are left alone — the
 * artwork's own green shows through, which already reads as "go" — so this only has to
 * carry apartado and vendido, and it has one job: whichever of the two a lot is must be
 * legible at a glance, not just technically distinguishable in the legend.
 *
 * A translucent wash failed at that. camel-over-green and cream-over-green both landed as
 * variations on brown, close enough in hue that the plan looked like it had one taken
 * status, not two. brand_system's own semantic scale (warning/danger — literally "Estados"
 * in the token file) is used near-opaque instead: amber for apartado, a deeper red for
 * vendido. Verified: blended over the plan's green these read at ~2.5:1 contrast from each
 * other, against ~1.2:1 at the old 50% wash — the difference between a glance and a squint.
 */
const STATUS_TINT: Record<LotStatus, { fill: string; opacity: number }> = {
  disponible: { fill: "transparent", opacity: 0 },
  apartado: { fill: "var(--color-warning-400)", opacity: 0.92 },
  vendido: { fill: "var(--color-danger-600)", opacity: 0.92 },
  no_disponible: { fill: "var(--color-danger-600)", opacity: 0.92 },
};

/** Legend swatches. Disponible approximates the plan's own green; the other two are the
 *  literal tokens above, so the key and the map always agree exactly. */
const LEGEND_SWATCH: Record<LotStatus, string> = {
  disponible: "#8CA85F",
  apartado: "var(--color-warning-400)",
  vendido: "var(--color-danger-600)",
  no_disponible: "var(--color-danger-600)",
};

/** Number colour per status, chosen for contrast against that status's near-opaque fill. */
const LABEL_FILL: Record<LotStatus, string> = {
  disponible: "var(--color-cream-50)",
  apartado: "var(--color-ink-900)",
  vendido: "var(--color-cream-50)",
  no_disponible: "var(--color-cream-50)",
};

/** The key shows the three states people ask about; a withdrawn lot looks like a sold one. */
const LEGEND_STATUSES: readonly LotStatus[] = ["disponible", "apartado", "vendido"];

type LotLabel = { id: string; x: number; y: number; status: LotStatus };

/**
 * The call to action for a selected lot. Available lots start a conversation about that
 * lot; taken ones start a conversation about what is still free, so a reserved or sold
 * lot is still a way in rather than a dead end.
 */
function LotCta({ lot, status, className = "" }: { lot: Lot; status: LotStatus; className?: string }) {
  const available = status === "disponible";

  return (
    <a
      href={
        available
          ? whatsappLotUrl(lot.id, getAttribution())
          : whatsappUrl("availableLots", getAttribution())
      }
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackWhatsAppClick(available ? "lot" : "lot-unavailable", { lot: lot.id })
      }
      className={`${buttonPrimary} w-full gap-2.5 ${className}`}
    >
      <BrandGlyph name="whats" />
      {available ? availability.detail.cta : availability.detail.ctaUnavailable}{" "}
      <span className="sr-only">{whatsappHint}</span>
    </a>
  );
}

/**
 * Status paint is emitted as CSS keyed on the artwork's own `id` attributes, so the map is
 * correct on the server and stays correct after the artwork is swapped.
 */
function statusStyles(lots: readonly Lot[]): string {
  const byStatus: Record<LotStatus, string[]> = {
    disponible: [],
    apartado: [],
    vendido: [],
    no_disponible: [],
  };
  for (const lot of lots) {
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
    `#${MAP_ID} [data-lot-status]{outline:none;cursor:pointer;transition:fill-opacity 120ms cubic-bezier(0.2,0,0,1)}`,
    `#${MAP_ID} [data-lot-status="disponible"]:hover{fill:var(--color-pine-800);fill-opacity:0.28}`,
    // Hover darkens within the same hue rather than jumping to camel/ink, so the status
    // colour never wavers — only its shade does.
    `#${MAP_ID} [data-lot-status="apartado"]:hover{fill:var(--color-warning-600);fill-opacity:0.92}`,
    `#${MAP_ID} [data-lot-status="vendido"]:hover,#${MAP_ID} [data-lot-status="no_disponible"]:hover{fill:var(--color-danger-700);fill-opacity:0.92}`,
    `#${MAP_ID} [data-lot-selected="true"]{fill:var(--color-pine-800);fill-opacity:0.55;stroke:var(--color-cream-50);stroke-opacity:1;stroke-width:0.9}`,
    `#${MAP_ID} [data-lot-status]:focus-visible{stroke:var(--color-ink-900);stroke-opacity:1;stroke-width:1.4}`,
    `@media (prefers-reduced-motion: reduce){#${MAP_ID} [data-lot-status]{transition:none}}`,
  ].join("");

  return fills + states;
}

type PlotMapProps = {
  /**
   * Every lot with its current status, resolved on the server — from the admin database
   * when it answers, from data/lots.ts when it does not. This component never fetches.
   */
  lots: readonly Lot[];
  /**
   * The section's eyebrow and headline. Rendered on the server and passed in, because the
   * two-column layout is the map's own — the header sits in its left column, above the
   * selected lot, and the plan runs flush to the page edge on the right.
   */
  header: ReactNode;
};

export default function PlotMap({ lots, header }: PlotMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [measured, setMeasured] = useState<LotLabel[]>([]);
  const styles = useMemo(() => statusStyles(lots), [lots]);

  const selectedLot = selected ? lots.find((lot) => lot.id === selected) : undefined;

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

    for (const lot of lots) {
      const node = svg.querySelector<SVGGraphicsElement>(`[id="${lot.id}"]`);
      if (!node) continue;

      const status = effectiveStatus(lot);

      node.setAttribute("data-lot-status", status);
      node.setAttribute("role", "button");
      node.setAttribute(
        "aria-label",
        availability.lotAccessibleName
          .replace("{lot}", lot.id)
          .replace("{area}", formatArea(lot.area))
          .replace("{status}", availability.legend[status].toLowerCase()),
      );
      // Reserved and sold lots answer too: people ask about the lot they liked, and the
      // reply is what is still free rather than a dead end.
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
  }, [lots, select]);

  /**
   * Lot numbers are positioned from the data's anchors, never baked into the artwork.
   * Anchors are optional, so anything without one falls back to its path's bounding box —
   * which keeps a freshly swapped drawing readable before the anchors are retuned.
   */
  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (lots.every((lot) => lot.anchor)) return;

    const found: LotLabel[] = [];
    for (const lot of lots) {
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
  }, [lots]);

  const labels: LotLabel[] = useMemo(() => {
    const fallback = new Map(measured.map((label) => [label.id, label]));
    return lots.flatMap((lot) => {
      const point = lot.anchor ?? fallback.get(lot.id);
      if (!point) return [];
      return [{ id: lot.id, x: point.x, y: point.y, status: effectiveStatus(lot) }];
    });
  }, [lots, measured]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    for (const lot of lots) {
      const node = svg.querySelector<SVGGraphicsElement>(`[id="${lot.id}"]`);
      if (!node) continue;
      if (lot.id === selected) node.setAttribute("data-lot-selected", "true");
      else node.removeAttribute("data-lot-selected");
    }
  }, [lots, selected]);

  const status = selectedLot ? effectiveStatus(selectedLot) : null;

  return (
    /*
     * Two equal halves at lg: the plan owns the right one and sets the section's height
     * through its locked ratio, the copy owns the left. Source order keeps the copy first
     * so a phone reads headline, answer, key, plan.
     */
    <div className="grid lg:grid-cols-2">
      <style>{styles}</style>

      {/*
       * Pinned to the top of the viewport while the plan — which is taller than a screen —
       * scrolls past, so the lot you just chose stays readable the whole way down.
       */}
      <div
        className={`${COLUMN_PADDING} lg:sticky lg:top-0 lg:col-start-1 lg:row-start-1 lg:self-start lg:pt-[14vh] lg:pb-16`}
      >
        {header}

        {/*
         * Reserved height keeps the plan still on a phone, where this slot sits above it:
         * the selected state is 140px against the hint's 59px, so without it the plan would
         * drop 81px on the tap and slide the lot out from under the finger that chose it.
         */}
        {/*
         * Desktop only. Below lg the bar pinned over the plan carries all of this, so the
         * column stays short and the plan starts higher up the screen. Nothing above the
         * plan changes on selection there, which is also why it can no longer shift.
         *
         * Two live regions, one per breakpoint: whichever is display:none is not announced,
         * so a selection is read out once, from whichever of the two is actually on screen.
         */}
        <div aria-live="polite" className="max-lg:hidden lg:mt-28 lg:min-h-[10rem]">
          {selectedLot && status ? (
            <div>
              <p className="text-2xl font-medium text-ink-900">
                {availability.lotLabel} {selectedLot.id}
              </p>
              <p className="mt-1 text-lg text-ink-600">
                {formatArea(selectedLot.area)} {availability.areaUnit} ·{" "}
                {availability.legend[status]}
              </p>

              {status !== "disponible" && (
                <p className="mt-3 text-base text-ink-600">{availability.detail.unavailable}</p>
              )}

              <LotCta lot={selectedLot} status={status} className="mt-6 sm:w-auto" />
            </div>
          ) : (
            <p className="max-w-sm text-lg leading-relaxed text-ink-600">
              {availability.detail.emptyState}
            </p>
          )}
        </div>

        {/* The same prompt on a phone, kept quiet: the plan answers, this only points at it. */}
        <p className="mt-5 max-w-[16rem] text-xs leading-relaxed text-ink-400 lg:hidden">
          {availability.detail.emptyState}
        </p>

        <ul className="mt-5 flex flex-col gap-1.5 text-sm text-ink-600 lg:mt-10 lg:flex-row lg:flex-wrap lg:gap-x-5 lg:gap-y-2">
          {LEGEND_STATUSES.map((key) => (
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

      {/*
       * Fills the right half exactly, and the locked ratio turns that width into the
       * section's height. Height must stay derived from width here: the SVG is stretched
       * over this same box, so a container that could take a different ratio would slide
       * every lot off the drawing. Do not add a max-width or max-height.
       */}
      <div className="relative mt-8 w-full lg:col-start-2 lg:row-start-1 lg:mt-0 lg:[aspect-ratio:211/265.224]">
        {PLOT_MAP_BASE ? (
          <Image
            src={PLOT_MAP_BASE.src}
            width={PLOT_MAP_BASE.width}
            height={PLOT_MAP_BASE.height}
            alt=""
            aria-hidden="true"
            sizes="(min-width: 1024px) 50vw, 100vw"
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

        {/*
         * Small screens only. While you are inside the plan the selected lot rides the
         * bottom of the viewport, so you can keep scrolling and tapping other lots without
         * losing what you picked — the copy at the top of the section is long gone by then.
         *
         * It is sticky, not fixed, and its containing block is the plan's lower half. That
         * is what gives it both limits for free: it can never rise above the middle of the
         * plan when you scroll back up, and it can never outlive the plan when you scroll
         * past — no scroll listeners, and nothing that keeps hold of the screen once this
         * section is behind you.
         */}
        {selectedLot && status ? (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 bottom-0 flex items-end p-4 lg:hidden">
            <div
              className="pointer-events-auto sticky bottom-4 w-full rounded-[0.75rem] border border-cream-300 bg-cream-50/95 p-4 backdrop-blur"
              style={{ boxShadow: "var(--shadow-elev-raised)" }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-lg font-medium text-ink-900">
                  {availability.lotLabel} {selectedLot.id}{" "}
                  {/* The space is a real text node: without it the accessible name runs
                      the number and the status together as "L-77Vendido". */}
                  <span className="text-sm font-light text-ink-600">
                    {availability.legend[status]}
                  </span>
                </p>
                <p className="shrink-0 text-sm text-ink-600">
                  {formatArea(selectedLot.area)} {availability.areaUnit}
                </p>
              </div>

              <LotCta lot={selectedLot} status={status} className="mt-3" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
