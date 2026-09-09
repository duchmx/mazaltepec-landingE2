# Etapa 2 — Jardines de Mazaltepec

Single-page conversion landing for the last lots of Etapa 2. Its only job is to start a
WhatsApp conversation or capture a short form. The full subdivision story lives at
[mazaltepec.com](https://mazaltepec.com).

Next.js (App Router) + TypeScript + Tailwind CSS v4. No database. Deployed to Vercel at
`e2.mazaltepec.com`.

---

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Other scripts:

```bash
npm run build      # production build
npm test           # lot inventory, WhatsApp links, phone validation
npm run typecheck  # tsc --noEmit
```

## Environment variables

All optional — with none set, the page works and the extras become no-ops. Set them in
Vercel under Project → Settings → Environment Variables. See `.env.example`.

| Variable | Scope | Missing behavior |
|---|---|---|
| `N8N_LEAD_WEBHOOK_URL` | server only | The lead is logged to the server console; the visitor still sees the confirmation. |
| `NEXT_PUBLIC_META_PIXEL_ID` | public | Pixel is not loaded; tracking calls are no-ops. |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | public | gtag is not loaded; tracking calls are no-ops. |

`N8N_LEAD_WEBHOOK_URL` is only ever read inside `app/api/lead/route.ts` and never reaches
the browser. Do not prefix it with `NEXT_PUBLIC_`.

---

## Editing lot status

Lot status is a hand-edited record — no database, no admin, no API.

1. Open `data/lots.ts`.
2. Change a lot's `status` to `"disponible"`, `"apartado"` or `"vendido"`.
3. Commit and push. Vercel redeploys; the plot map tints and the form's lot dropdown both
   follow automatically.

Rules baked in:

- L-77 is third-party owned (`inInventory: false`). It always renders as sold and is never
  offered in the form's lot picker. Leave it alone.
- L-76 is not in the file at all: it falls outside the plan's polygon, so it has no path in
  the artwork and nothing to render. Do not add it back without artwork to match.
- Areas are legal figures. The 13 sellable lots must sum to 2,220.76 m² — `npm test` fails if
  an edit breaks that.

---

## Brand system

`brand_system/` is vendored, read-only, and shared with the sibling Mazaltepec projects.
Do not edit anything inside it — update it at the source and re-copy.

- **Tokens** are imported by `app/globals.css` and own the colour scale. Do not redeclare
  colours anywhere else.
- **Assets** are mirrored into `public/` by `scripts/sync-brand-assets.mjs`, which runs on
  `predev` and `prebuild`. `public/brand_system` is generated and git-ignored.
- **The logo** is `BrandLogo` from `@/brand_system/integration/react/BrandLogo`. It appears
  twice: the hero top bar and the footer, both `variant="blanco"` because both sit on
  pine-800. Never `color` or `negro` over a dark ground.
- **Clear space** is one rhombus of the isotype — 12.4% of the lockup's rendered width, so
  about 14px at `h-9` and 16px at `h-10`. The existing padding already clears it; keep that
  in mind if you resize the mark.
- **Minimum size** is 100px wide for the horizontal lockup. It renders 116px at `h-9`,
  129px at `h-10` and 103px at `h-8` — do not go below `h-8`.
- **`max-w-none` is required** on both logos. Tailwind's preflight caps images at 100% of
  their container, which collapses the lockup to zero width inside a shrink-to-fit anchor.
- **Theme** is pinned to `data-theme="light"` on `<html>`. The brand tokens ship a dark
  theme, and this page is a fixed light design.

---

## Swapping in the architect's SVG

The plot map is two layers, both declared in **one file**, `components/plot-map/artwork.tsx`:

- `PLOT_MAP_BASE` — the rendered plan drawing (`public/plano-base.webp`), drawn underneath
  via `next/image` and marked decorative.
- `PlotMapArtwork()` — one invisible `<path>` per lot, drawn on top, registered to the base
  render in the same `PLOT_MAP_VIEW_BOX` frame.

Status tints, lot numbers, click handling and accessibility are applied by
`components/plot-map/PlotMap.tsx`, which finds each lot by `id`. Replacing the artwork does
not touch that file.

Available lots are left untinted so the drawing's own green shows through; reserved lots take
a half-strength camel wash and sold lots a cream wash. Nothing ever fills a lot solid — the
plan has to stay readable underneath.

The artwork the architect delivers must satisfy three things:

1. **One closed `<path>` per lot**, each with `id="L-78"` … `id="L-90"`, plus `L-77`.
2. **No lot numbers, areas or status colors baked in** — our code draws those. Fills may be
   left off entirely; ours override them.
3. The paths must share one coordinate frame with whatever drawing sits under them.

### If the delivery is paths plus a separate rendered plan (today's setup)

1. Optimise the render and put it in `public/`. From the repo root:

   ```bash
   node -e "require('sharp')('/path/to/plan.png').resize({width:1600}).webp({quality:82}).toFile('public/plano-base.webp').then(i=>console.log(i.width,i.height,i.size))"
   ```

2. Update `PLOT_MAP_BASE` in `artwork.tsx` with the new `src` and the printed `width`/
   `height`. `npm test` fails if its aspect ratio drifts from `PLOT_MAP_VIEW_BOX` by more
   than 0.5%, which is what keeps the paths registered to the drawing.
3. Copy the paths' own `viewBox` into `PLOT_MAP_VIEW_BOX`.
4. Replace the `<path>` elements inside `PlotMapArtwork()` with the delivered ones.

### If the delivery is a single SVG containing the drawing

1. Set `PLOT_MAP_BASE` to `null` and delete the old render from `public/`.
2. Copy the file's `viewBox` into `PLOT_MAP_VIEW_BOX`.
3. Replace the contents of `PlotMapArtwork()` with everything *inside* the root `<svg>` —
   drop the `<svg>` wrapper, and drop any `<title>`/`<desc>` (`PlotMap.tsx` supplies those
   in Spanish). Keep the lot `<path>` elements last so they sit above the drawing.

### Either way

Convert SVG attributes to JSX: `stroke-width` → `strokeWidth`, `fill-rule` → `fillRule`,
`class` → `className`, `xlink:href` → `href`. Self-close empty elements. Then retune the lot
number positions: each lot in `data/lots.ts` carries an `anchor` in viewBox units, the area
centroid of its path. Delete the stale anchors and the map falls back to measuring each
path's bounding box, which is close enough to check registration; add them back for
irregular lots, where a bounding-box centre can land outside the polygon.

Finally run `npm run dev` and check: all 14 lots carry a number that sits inside their own
outline, available lots respond to click and to Enter/Space when focused, L-77 reads as sold
and is not focusable.

If a lot id is missing from the artwork, that lot is simply skipped — the page still renders,
so check for all 14. `npm test` asserts the artwork and `data/lots.ts` name exactly the same
set of lots.

## Replacing a MediaSlot with real media

Every image slot is a `<MediaSlot>` rendering a flat brand-color block at a locked aspect
ratio, so nothing reflows when the real asset arrives. In development each block shows a
small label naming the intended asset; it never renders in production.

To go live with an asset:

1. Put the file in `public/media/` (e.g. `public/media/parque.jpg`).
2. Add `src` and `alt` to that slot. Nothing else changes:

   ```tsx
   <MediaSlot
     ratio="4/5"
     tone="pine-700"
     label={subdivision.mediaLabels[0]}
     src="/media/parque.jpg"
     alt="Parque central del fraccionamiento"
   />
   ```

For the subdivision marquee, the slides come from `subdivision.mediaLabels` in
`content/copy.ts` — the list length drives everything, and tones cycle on their own. Its
speed is the `duration` prop on `<MediaMarquee>` (seconds for one full pass; higher is
slower). The track's left padding must stay equal to its gap or the loop will visibly
jump — the reason is commented in `app/globals.css`.

3. Keep `ratio` and `tone` as they are — the ratio is the locked layout and the tone stays as
   the fallback color. Write `alt` in Spanish, describing what is in the frame.
4. For the hero, add `priority` so it is not lazy-loaded.

The slots and their intended assets are listed in `PLACEHOLDERS.md`.

---

## Attribution and analytics

- **Advisor code** — `?a=CODE` is read on first load, kept in `sessionStorage`, appended to
  every WhatsApp message as `(ref CODE)` and sent with the lead payload. This is how
  commission is attributed, so keep it working when editing links.
- **UTM** — all `utm_*` params are captured the same way and sent with the lead payload.
- **Events** — `whatsapp_click` (with a `source`) fires on every WhatsApp link;
  `lead_submit` fires when the form is accepted. Both go to Meta Pixel and GA4 and are
  silent no-ops when neither is configured.

Test with `http://localhost:3000/?a=ANA01&utm_source=meta`.

## Lead form

`components/LeadForm.tsx` posts to `app/api/lead/route.ts`, which validates and forwards to
n8n. Phone numbers are validated as 10-digit Mexican numbers on both sides
(`lib/phone.ts`), and a hidden honeypot field (`company`) is accepted silently and dropped.

The webhook receives:

```json
{
  "name": "…",
  "phone": "9932282449",
  "phoneRaw": "993 228 2449",
  "lot": "L-80",
  "advisor": "ANA01",
  "utm": { "utm_source": "meta" },
  "pageUrl": "https://e2.mazaltepec.com/?a=ANA01",
  "source": "e2.mazaltepec.com",
  "submittedAt": "2026-01-01T00:00:00.000Z"
}
```

---

## Content rules

These are commercial constraints, not style preferences. Do not add:

- price per m², discounts, percentages, monthly payments, payment schedules or interest terms;
- any claim of return on investment or guaranteed appreciation;
- road projects, future infrastructure, Etapa 3 or departamentos;
- "Premium" / "Estándar" lot labels;
- emojis.

The only two figures allowed on the page are `Lotes desde $1,560,000` and
`Opciones de crédito directo con enganche desde $360,000`. The 9,000 m² line is used in full,
exactly as written in `content/copy.ts`.

## Design system

Colors, radius and easing are defined once in `app/globals.css` under `@theme`; the palette
is `pine`, `leaf`, `camel`, `cream` and `ink`. Cream is the surface, `pine-800` is the primary
action, camel is an accent used sparingly. Radius is `0.75rem`; transitions are 120ms on
`cubic-bezier(0.2, 0, 0, 1)`, and `prefers-reduced-motion` is honored. Type is Poppins
(300/400/500/600) via `next/font`; body copy is 300.
