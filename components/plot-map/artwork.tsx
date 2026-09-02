/**
 * PLACEHOLDER: provisional plot-map artwork. Replace this file wholesale with the
 * architect's SVG — it is the only file that needs to change. See README, "Swapping in
 * the architect's SVG".
 *
 * Contract with the rest of the app:
 *  - one closed `<path>` per lot, carrying `id="L-78"` … `id="L-90"`;
 *  - no lot numbers, areas or status colors baked in — our code renders and paints those;
 *  - `PLOT_MAP_VIEW_BOX` matches the artwork's own viewBox.
 *
 * Geometry here is schematic and does not represent the real subdivision layout.
 */

export const PLOT_MAP_VIEW_BOX = "0 0 900 560";

export function PlotMapArtwork() {
  return (
    <g>
      {/* Street and block context — decorative, never interactive. */}
      <rect x="0" y="0" width="900" height="560" fill="var(--color-cream-100)" />
      <rect x="0" y="220" width="900" height="80" fill="var(--color-cream-300)" />
      <rect x="0" y="256" width="900" height="2" fill="var(--color-cream-50)" />
      <rect x="40" y="20" width="828" height="24" fill="var(--color-leaf-100)" />
      <rect x="40" y="476" width="724" height="24" fill="var(--color-leaf-100)" />

      {/* Lots. Top row. */}
      <path id="L-76" d="M40 60 H140 V220 H40 Z" />
      <path id="L-77" d="M144 60 H244 V220 H144 Z" />
      <path id="L-78" d="M248 60 H348 V220 H248 Z" />
      <path id="L-79" d="M352 60 H452 V220 H352 Z" />
      <path id="L-80" d="M456 60 H556 V220 H456 Z" />
      <path id="L-81" d="M560 60 H660 V220 H560 Z" />
      <path id="L-82" d="M664 60 H764 V220 H664 Z" />
      <path id="L-83" d="M768 60 H868 V220 H768 Z" />

      {/* Lots. Bottom row. */}
      <path id="L-84" d="M40 300 H140 V460 H40 Z" />
      <path id="L-85" d="M144 300 H244 V460 H144 Z" />
      <path id="L-86" d="M248 300 H348 V460 H248 Z" />
      <path id="L-87" d="M352 300 H452 V460 H352 Z" />
      <path id="L-88" d="M456 300 H556 V460 H456 Z" />
      <path id="L-89" d="M560 300 H660 V460 H560 Z" />
      <path id="L-90" d="M664 300 H764 V460 H664 Z" />
    </g>
  );
}
