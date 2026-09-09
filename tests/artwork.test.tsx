import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { PLOT_MAP_BASE, PLOT_MAP_VIEW_BOX, PlotMapArtwork } from "@/components/plot-map/artwork";
import { LOTS } from "@/data/lots";

/** Walks the artwork's element tree and collects every `<path id="…">`. */
function collectPathIds(node: ReactNode, found: string[] = []): string[] {
  if (Array.isArray(node)) {
    for (const child of node) collectPathIds(child, found);
    return found;
  }
  if (!isValidElement(node)) return found;

  const element = node as ReactElement<{ id?: string; d?: string; children?: ReactNode }>;
  if (element.type === "path" && element.props.id) found.push(element.props.id);
  collectPathIds(element.props.children, found);
  return found;
}

const viewBox = PLOT_MAP_VIEW_BOX.split(" ").map(Number);
const pathIds = collectPathIds(PlotMapArtwork());

describe("plot map artwork", () => {
  it("draws exactly one path per lot in the data module", () => {
    expect([...pathIds].sort()).toEqual(LOTS.map((lot) => lot.id).sort());
  });

  it("uses unique ids", () => {
    expect(new Set(pathIds).size).toBe(pathIds.length);
  });

  it("declares a viewBox anchored at the origin", () => {
    expect(viewBox).toHaveLength(4);
    expect(viewBox[0]).toBe(0);
    expect(viewBox[1]).toBe(0);
    expect(viewBox[2]).toBeGreaterThan(0);
    expect(viewBox[3]).toBeGreaterThan(0);
  });

  it("keeps every label anchor inside the artwork frame", () => {
    const [, , width, height] = viewBox;
    for (const lot of LOTS) {
      if (!lot.anchor) continue;
      expect(lot.anchor.x, `${lot.id} x`).toBeGreaterThan(0);
      expect(lot.anchor.x, `${lot.id} x`).toBeLessThan(width);
      expect(lot.anchor.y, `${lot.id} y`).toBeGreaterThan(0);
      expect(lot.anchor.y, `${lot.id} y`).toBeLessThan(height);
    }
  });

  it("keeps the base render in the same aspect ratio as the artwork frame", () => {
    if (!PLOT_MAP_BASE) return;
    const [, , width, height] = viewBox;
    const artworkRatio = width / height;
    const baseRatio = PLOT_MAP_BASE.width / PLOT_MAP_BASE.height;
    // Registration slips visibly past ~0.5%; the two frames must describe the same plan.
    expect(Math.abs(artworkRatio - baseRatio) / artworkRatio).toBeLessThan(0.005);
  });
});
