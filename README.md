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
3. Commit and push. Vercel redeploys; the plot map colors, the availability counter and the
   form's lot dropdown all follow automatically.

Rules baked in:

- L-76 and L-77 are third-party owned (`inInventory: false`). They always render as sold and
  never count toward `X de 13 lotes disponibles`. Leave them alone.
- Areas are legal figures. The 13 sellable lots must sum to 2,220.76 m² — `npm test` fails if
  an edit breaks that.

---

## Swapping in the architect's SVG

The plot map artwork is isolated in **one file**: `components/plot-map/artwork.tsx`. Status
colors, lot numbers, click handling and accessibility are applied by
`components/plot-map/PlotMap.tsx`, which finds each lot by `id`. Replacing the artwork does
not touch that file.

The artwork the architect delivers must satisfy three things:

1. **One closed `<path>` per lot**, each with `id="L-78"` … `id="L-90"` (plus `L-76`, `L-77`).
2. **No lot numbers, areas or status colors baked in** — our code draws those. Fills may be
   left off entirely; ours override them.
3. Everything else (streets, green areas, block outlines) is decorative and may be any
   shape or color.

Steps:

1. Open the delivered `.svg` in a text editor.
2. Copy the `viewBox` value into `PLOT_MAP_VIEW_BOX` in `artwork.tsx`.
3. Replace the contents of `PlotMapArtwork()` with everything *inside* the file's root
   `<svg>` element — drop the `<svg>` wrapper itself, and drop any `<title>`/`<desc>`
   (`PlotMap.tsx` supplies those in Spanish).
4. Convert SVG attributes to JSX: `stroke-width` → `strokeWidth`, `fill-rule` → `fillRule`,
   `class` → `className`, `xlink:href` → `href`. Self-close empty elements.
5. Run `npm run dev` and check: all 15 lots are colored by status, each carries a number,
   available lots respond to click and to Enter/Space when focused, and L-76 / L-77 are grey
   and not focusable.

If a lot id is missing from the artwork, that lot is simply skipped — the page still renders,
so check for all 15.

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
