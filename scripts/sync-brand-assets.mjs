/**
 * Copies brand_system/assets into public/ so Next serves them.
 *
 * BrandLogo and BrandIcon render <img src="/brand_system/assets/..."> — absolute URLs —
 * and Next only serves static files from public/. The brand system is vendored read-only,
 * so rather than editing it or hand-duplicating files, this mirrors the assets on every
 * dev start and build. public/brand_system is generated and git-ignored; update the
 * vendored package and the copy follows.
 */

import { cp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "brand_system", "assets");
const destination = join(root, "public", "brand_system", "assets");

if (!existsSync(source)) {
  console.error(`Brand assets not found at ${source}. Is brand_system/ vendored in?`);
  process.exit(1);
}

await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });
console.log(`Synced brand assets → ${destination.replace(root + "/", "")}`);
