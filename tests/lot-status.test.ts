import { describe, expect, it } from "vitest";
import { LOTS, totalSellableArea, type LotStatus } from "@/data/lots";
import { applyLiveStatus, parseStatusRows } from "@/lib/lot-status-core";

const statusOf = (lots: ReturnType<typeof applyLiveStatus>, id: string) =>
  lots.find((lot) => lot.id === id)?.status;

describe("parseStatusRows", () => {
  it("reads code and status from the database's rows", () => {
    const live = parseStatusRows([
      { code: "L-78", status: "disponible" },
      { code: "L-89", status: "vendido" },
    ]);
    expect(live?.get("L-78")).toBe("disponible");
    expect(live?.get("L-89")).toBe("vendido");
  });

  it("accepts every status the database's check constraint allows", () => {
    const live = parseStatusRows(
      ["disponible", "apartado", "vendido", "no_disponible"].map((status, i) => ({
        code: `L-8${i}`,
        status,
      })),
    );
    expect(live?.size).toBe(4);
  });

  it("skips rows with an unknown status or a malformed shape instead of trusting them", () => {
    const live = parseStatusRows([
      { code: "L-78", status: "reservado" },
      { code: 79, status: "disponible" },
      null,
      "L-80",
      { code: "L-81", status: "apartado" },
    ]);
    expect([...(live?.keys() ?? [])]).toEqual(["L-81"]);
  });

  it("returns null when the payload is not a list at all", () => {
    expect(parseStatusRows({ message: "permission denied" })).toBeNull();
    expect(parseStatusRows(null)).toBeNull();
  });
});

describe("applyLiveStatus", () => {
  it("keeps the page's fallback statuses when there is no live read", () => {
    expect(applyLiveStatus(LOTS, null)).toEqual([...LOTS]);
  });

  it("treats an empty read as a failure, not as every lot withdrawn", () => {
    expect(applyLiveStatus(LOTS, new Map())).toEqual([...LOTS]);
  });

  it("takes each lot's status from a live read", () => {
    const live = new Map<string, LotStatus>(LOTS.map((lot) => [lot.id, "disponible"]));
    live.set("L-83", "apartado");
    expect(statusOf(applyLiveStatus(LOTS, live), "L-83")).toBe("apartado");
  });

  it("marks a lot missing from a live read as no longer available", () => {
    // The view only returns published lots: absent means unpublished in the admin app.
    const live = new Map(LOTS.filter((l) => l.id !== "L-84").map((l) => [l.id, "disponible" as const]));
    expect(statusOf(applyLiveStatus(LOTS, live), "L-84")).toBe("no_disponible");
  });

  it("ignores codes the plan does not draw", () => {
    const live = new Map([
      ["L-78", "vendido" as const],
      ["L-99", "disponible" as const],
    ]);
    const lots = applyLiveStatus(LOTS, live);
    expect(lots.map((lot) => lot.id)).toEqual(LOTS.map((lot) => lot.id));
  });

  it("never lets the database change areas, anchors or ownership", () => {
    const live = new Map(LOTS.map((lot) => [lot.id, "vendido" as const]));
    const lots = applyLiveStatus(LOTS, live);
    lots.forEach((lot, i) => {
      expect(lot.area).toBe(LOTS[i].area);
      expect(lot.anchor).toEqual(LOTS[i].anchor);
      expect(lot.inInventory).toBe(LOTS[i].inInventory);
    });
    expect(totalSellableArea()).toBe(2220.76);
  });

  it("does not mutate the page's own lot list", () => {
    const before = JSON.stringify(LOTS);
    applyLiveStatus(LOTS, new Map([["L-78", "vendido" as const]]));
    expect(JSON.stringify(LOTS)).toBe(before);
  });
});
