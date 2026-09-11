import "server-only";
import { LOTS, type Lot } from "@/data/lots";
import { applyLiveStatus, parseStatusRows } from "@/lib/lot-status-core";

/**
 * Live lot status from the admin database — the same one the admin app writes and
 * precios.mazaltepec.com reads — so marking a lot apartado or vendido there updates this
 * page too, with no redeploy.
 *
 * Read-only, server-only. `server-only` makes importing this from a client component a build
 * error, so neither the key nor the query can reach the browser.
 *
 * It reads the `public_lots` view, which the anonymous role is already allowed to select,
 * and asks for exactly two columns: `code` and `status`. That view also carries list price
 * and the premium/estándar tier, and this page may publish neither — so they are never
 * requested, and never leave the database on this request.
 *
 * Every failure — no credentials, network error, bad response — falls back to the statuses
 * in data/lots.ts and logs why. The page never breaks over this.
 */

/** Seconds a status can be stale. The page regenerates in the background at most this often. */
export const LOT_STATUS_REVALIDATE = 60;

const QUERY = new URLSearchParams({
  select: "code,status",
  development_slug: "eq.jardines-de-mazaltepec",
  phase: "eq.2",
  type: "eq.lote",
}).toString();

export async function getLots(): Promise<Lot[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.warn("Lot status: SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY not set; using data/lots.ts.");
    return [...LOTS];
  }

  try {
    const response = await fetch(`${url}/rest/v1/public_lots?${QUERY}`, {
      headers: { apikey: key, Accept: "application/json" },
      next: { revalidate: LOT_STATUS_REVALIDATE, tags: ["lot-status"] },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(`Lot status: database answered ${response.status}; using data/lots.ts.`);
      return [...LOTS];
    }

    const live = parseStatusRows(await response.json());
    if (!live || live.size === 0) {
      console.error("Lot status: database returned no Etapa 2 lots; using data/lots.ts.");
      return [...LOTS];
    }

    return applyLiveStatus(LOTS, live);
  } catch (error) {
    console.error("Lot status: read failed; using data/lots.ts.", error);
    return [...LOTS];
  }
}
