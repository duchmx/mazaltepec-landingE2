import { describe, expect, it } from "vitest";
import {
  effectiveStatus,
  getLot,
  LOTS,
  SELLABLE_LOTS,
  totalSellableArea,
} from "@/data/lots";

describe("lot inventory", () => {
  it("holds exactly 13 sellable lots", () => {
    expect(SELLABLE_LOTS).toHaveLength(13);
  });

  it("sums to exactly 2,220.76 m²", () => {
    expect(totalSellableArea()).toBe(2220.76);
  });

  it("excludes the third-party lot from inventory", () => {
    expect(SELLABLE_LOTS.map((lot) => lot.id)).not.toContain("L-77");
  });

  it("always renders the third-party lot as sold", () => {
    const lot = getLot("L-77");
    expect(lot).toBeDefined();
    expect(effectiveStatus(lot!)).toBe("vendido");
  });

  it("omits L-76, which falls outside the plan and has no artwork", () => {
    expect(getLot("L-76")).toBeUndefined();
  });

  it("uses unique ids that match the plot-map artwork convention", () => {
    const ids = LOTS.map((lot) => lot.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^L-\d{2}$/);
  });
});
