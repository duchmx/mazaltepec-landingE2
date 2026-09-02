/**
 * Lot inventory and status. Hand-edited — there is no database and no API.
 *
 * To change what the plot map shows, edit `status` below and redeploy:
 *   "disponible" | "apartado" | "vendido"
 *
 * `inInventory: false` lots belong to third parties. They always render as sold and
 * never count toward the availability counter — do not flip them.
 * Areas are legal figures from the subdivision plan. Do not round or invent them.
 */

export type LotStatus = "disponible" | "apartado" | "vendido";

export type Lot = {
  /** Matches the `id` attribute of the lot's `<path>` in the plot map artwork. */
  id: string;
  /** Surface in square metres. */
  area: number;
  /** False for third-party-owned lots, which are excluded from the counter. */
  inInventory: boolean;
  status: LotStatus;
};

export const LOTS: readonly Lot[] = [
  { id: "L-76", area: 337.76, inInventory: false, status: "vendido" },
  { id: "L-77", area: 170.0, inInventory: false, status: "vendido" },
  // PLACEHOLDER: confirm the live status of every lot below before launch.
  { id: "L-78", area: 182.78, inInventory: true, status: "disponible" },
  { id: "L-79", area: 185.12, inInventory: true, status: "disponible" },
  { id: "L-80", area: 175.94, inInventory: true, status: "disponible" },
  { id: "L-81", area: 165.89, inInventory: true, status: "disponible" },
  { id: "L-82", area: 168.74, inInventory: true, status: "disponible" },
  { id: "L-83", area: 168.74, inInventory: true, status: "disponible" },
  { id: "L-84", area: 168.74, inInventory: true, status: "disponible" },
  { id: "L-85", area: 163.22, inInventory: true, status: "disponible" },
  { id: "L-86", area: 158.58, inInventory: true, status: "disponible" },
  { id: "L-87", area: 168.74, inInventory: true, status: "disponible" },
  { id: "L-88", area: 168.74, inInventory: true, status: "disponible" },
  { id: "L-89", area: 168.74, inInventory: true, status: "disponible" },
  { id: "L-90", area: 176.79, inInventory: true, status: "disponible" },
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

export function availableCount(): number {
  return SELLABLE_LOTS.filter((lot) => lot.status === "disponible").length;
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
