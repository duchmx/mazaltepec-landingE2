/**
 * Lot inventory and status. Hand-edited — there is no database and no API.
 *
 * To change what the plot map shows, edit `status` below and redeploy:
 *   "disponible" | "apartado" | "vendido"
 *
 * `inInventory: false` lots belong to third parties. They always render as sold and
 * never count toward the availability counter — do not flip them.
 *
 * Areas are the published figures from the authorised lotification plan. They are never
 * derived from the artwork's geometry. Do not round or invent them.
 *
 * L-76 is deliberately absent: it falls outside the plan's polygon, so it has no path in
 * the artwork and nothing to render. The 13 sellable lots below sum to 2,220.76 m².
 */

export type LotStatus = "disponible" | "apartado" | "vendido";

export type Lot = {
  /** Matches the `id` attribute of the lot's `<path>` in the plot map artwork. */
  id: string;
  /** Surface in square metres, as published on the plan. */
  area: number;
  /** False for third-party-owned lots, which are excluded from the counter. */
  inInventory: boolean;
  status: LotStatus;
  /**
   * Where the lot number is drawn, in artwork viewBox units. Area centroid of the path,
   * checked visually. Optional: when absent — as it will be right after the artwork is
   * swapped — the map measures the path's bounding box instead. See README.
   */
  anchor?: { x: number; y: number };
};

export const LOTS: readonly Lot[] = [
  { id: "L-77", area: 170.0, inInventory: false, status: "vendido", anchor: { x: 44.8, y: 78.5 } },
  // PLACEHOLDER: confirm the live status of every lot below before launch.
  { id: "L-78", area: 182.78, inInventory: true, status: "disponible", anchor: { x: 69.7, y: 68.7 } },
  { id: "L-79", area: 185.12, inInventory: true, status: "disponible", anchor: { x: 94.5, y: 58.7 } },
  { id: "L-80", area: 175.94, inInventory: true, status: "disponible", anchor: { x: 120.2, y: 50.0 } },
  { id: "L-81", area: 165.89, inInventory: true, status: "disponible", anchor: { x: 51.7, y: 143.6 } },
  { id: "L-82", area: 168.74, inInventory: true, status: "disponible", anchor: { x: 79.0, y: 133.2 } },
  { id: "L-83", area: 168.74, inInventory: true, status: "disponible", anchor: { x: 106.3, y: 122.4 } },
  { id: "L-84", area: 168.74, inInventory: true, status: "disponible", anchor: { x: 132.4, y: 111.9 } },
  { id: "L-85", area: 163.22, inInventory: true, status: "disponible", anchor: { x: 158.2, y: 100.5 } },
  { id: "L-86", area: 158.58, inInventory: true, status: "disponible", anchor: { x: 161.8, y: 138.1 } },
  { id: "L-87", area: 168.74, inInventory: true, status: "disponible", anchor: { x: 136.7, y: 149.1 } },
  { id: "L-88", area: 168.74, inInventory: true, status: "disponible", anchor: { x: 110.0, y: 160.1 } },
  { id: "L-89", area: 168.74, inInventory: true, status: "disponible", anchor: { x: 83.5, y: 170.9 } },
  { id: "L-90", area: 176.79, inInventory: true, status: "disponible", anchor: { x: 54.3, y: 176.2 } },
];

/** Lots offered for sale by the developer. */
export const SELLABLE_LOTS = LOTS.filter((lot) => lot.inInventory);

/** Third-party lots always read as sold, whatever their `status` says. */
export function effectiveStatus(lot: Lot): LotStatus {
  return lot.inInventory ? lot.status : "vendido";
}

export function getLot(id: string): Lot | undefined {
  return LOTS.find((lot) => lot.id === id);
}

export function totalSellableArea(): number {
  // Cents-level rounding: the figures carry two decimals and must sum to 2,220.76.
  const sum = SELLABLE_LOTS.reduce((total, lot) => total + Math.round(lot.area * 100), 0);
  return sum / 100;
}

/** "182.78" — always two decimals, no thousands separator needed at these sizes. */
export function formatArea(area: number): string {
  return area.toFixed(2);
}
