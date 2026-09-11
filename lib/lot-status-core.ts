import { LOT_STATUSES, type Lot, type LotStatus } from "@/data/lots";

/**
 * Pure half of the live lot-status read: turning the admin database's rows into a status
 * per lot, and laying that over the page's own lot list. No network and no environment,
 * so it is unit-tested directly. The fetch lives in lib/lot-status.ts.
 */

function isLotStatus(value: unknown): value is LotStatus {
  return typeof value === "string" && (LOT_STATUSES as readonly string[]).includes(value);
}

/**
 * `[{ code: "L-78", status: "disponible" }, …]` → a status per lot code.
 * Rows that are malformed, or carry a status outside the vocabulary, are skipped rather
 * than trusted. Anything that is not an array at all returns null: the read failed.
 */
export function parseStatusRows(rows: unknown): Map<string, LotStatus> | null {
  if (!Array.isArray(rows)) return null;

  const statuses = new Map<string, LotStatus>();
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const { code, status } = row as { code?: unknown; status?: unknown };
    if (typeof code === "string" && isLotStatus(status)) statuses.set(code, status);
  }
  return statuses;
}

/**
 * The page's lots, with status taken from the database wherever it has spoken.
 *
 * - No live read (null), or an empty one: the page's own fallback statuses stand. An empty
 *   result is far likelier to be a broken filter than every lot withdrawn at once.
 * - A non-empty read is authoritative. The view only returns *published* lots, so a lot
 *   missing from it has been unpublished or removed in the admin app, and must not keep
 *   showing as available on the strength of this file's fallback. It reads `no_disponible`.
 *
 * Areas, anchors and the third-party flag always come from the page's own list: they are
 * geometry-facing facts, and the published areas must sum to 2,220.76 m².
 */
export function applyLiveStatus(lots: readonly Lot[], live: Map<string, LotStatus> | null): Lot[] {
  if (!live || live.size === 0) return [...lots];
  return lots.map((lot) => ({ ...lot, status: live.get(lot.id) ?? "no_disponible" }));
}
