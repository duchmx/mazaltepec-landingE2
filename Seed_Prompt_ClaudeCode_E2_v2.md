# SEED PROMPT v2 — Claude Code · Jardines de Mazaltepec, Etapa 2

> Simplified scope. Replaces v1. Attach `PlanoLotesE2.jsx` to the session before pasting this.

---

Build a small single-page marketing landing for Etapa 2 of Jardines de Mazaltepec, a premium residential subdivision in the Zona Country of Villahermosa, Tabasco, Mexico.

This is a **conversion landing, not an informational site**. Its only job is to get the visitor into a WhatsApp conversation or a short form. The full subdivision story already lives at `mazaltepec.com` — link there instead of retelling it.

**All page copy is Mexican Spanish, given verbatim below. All code, comments, file names and commits in English.**

## Deployment

- Next.js (App Router) + TypeScript + Tailwind CSS.
- Deployed to Vercel from a folder in an existing GitHub repo, served at `e2.mazaltepec.com`. DNS is already handled; assume no base path.
- **No database.** No Supabase client, no schema, no migrations. If you think something needs persistence, stop and ask me first — the answer is probably no.
- The contact form POSTs to an n8n webhook through a Next.js route handler. URL in `N8N_LEAD_WEBHOOK_URL`. If the variable is missing, fail gracefully and log; never break the page.

## No images exist yet

Photography and video are being produced. **Do not use stock imagery, gradients, illustrations or AI-generated art.** Every image slot renders as a flat brand-color block.

Build one component, `<MediaSlot>`:

- Props: `ratio` (e.g. `16/9`, `4/5`, `1/1`), `tone` (a brand color key), `label`, and an optional future `src`.
- With no `src`, it renders a solid color block at the locked aspect ratio.
- In development only, it shows a small centered label describing the intended asset (e.g. `HERO — aerial video loop`). Invisible in production.
- When real assets arrive, passing `src` must be the only change needed. Aspect ratios are locked now so nothing reflows later.

Use `pine-800`, `pine-700`, `leaf-400` and `cream-200` for the blocks so the page reads as intentional and monochrome-ish, not as broken images.

## Money — strict rules

Only two figures appear on the entire page, and nothing else about pricing:

1. **`Lotes desde $1,560,000`** with a small note underneath: `Precio de preventa con descuento de contado.`
2. **`Opciones de crédito directo con enganche desde $360,000`**

Do not publish a price list, payment schedules, monthly payments, interest terms, price per square meter, discounts or percentages. Do not link to any pricing tool.

## Page structure — six sections, in this order

### 1 · Hero
Full-viewport `MediaSlot` in `pine-800` behind the text.

```
ETAPA 2

Los últimos lotes de Jardines de Mazaltepec.

Un fraccionamiento que ya está construido, habitado y funcionando.
En la zona Country de Villahermosa.

Lotes desde $1,560,000
Precio de contado.

[ Hablar por WhatsApp ]   [ Ver disponibilidad ]
```

### 2 · Plot map and availability

```
DISPONIBILIDAD

Elige tu lote.

Toca cualquier lote para ver su superficie y pedir informes.
```

Interactive SVG plot map — see the section below. Under it, a small counter: `X de 13 lotes disponibles`.

### 3 · Payment options

```
CRÉDITO DIRECTO

Compra sin banco y sin buró.

Financiamiento directo del desarrollador, con mensualidades fijas.

Opciones de crédito directo con enganche desde $360,000

[ Consultar condiciones por WhatsApp ]
```

### 4 · Know the subdivision
Short. Four points, no elaboration, then send them away.

```
EL FRACCIONAMIENTO

No es una promesa. Ya se puede caminar.

· Acceso controlado y vigilancia 24/7
· Más de 9,000 m² de parques, jardines, senderos y áreas sociales equipadas para toda la familia
· Alberca, pádel, gimnasio al aire libre y senderos
· Comunidad ya habitada, con mantenimiento en operación

[ Conoce el fraccionamiento → ]   (https://mazaltepec.com)
```

Two `MediaSlot` blocks at `4/5`, side by side on desktop, stacked on mobile.

### 5 · Visit us
Location lives here, not in its own section.

```
VISÍTANOS

La mejor forma de decidir es caminarlo.

Estamos en la zona Country de Villahermosa, Tabasco.
Agenda tu recorrido y te mostramos los lotes disponibles.

[ Agendar por WhatsApp ]

o déjanos tus datos y te contactamos hoy mismo:
  Nombre
  Teléfono / WhatsApp
  Lote de interés (opcional)
  [ Solicitar informes ]

[ Cómo llegar → ]   (Google Maps)
```

Confirmation state: `Gracias, {nombre}. Te contactamos en breve al número que dejaste.`

Form note under the button: `Al enviar aceptas nuestro aviso de privacidad. Usamos tus datos únicamente para contactarte sobre este desarrollo.`

Use a `MediaSlot` at `16/9` where the map image will go. Do not embed a live Google Maps iframe — it hurts performance and we have no key set up.

### 6 · Footer

```
Jardines de Mazaltepec
Un desarrollo de Arvore S.A. de C.V.

993 228 2449
Aviso de privacidad

Imágenes ilustrativas. Precios y disponibilidad sujetos a cambio sin previo aviso.
```

The Arvore line is visually subordinate — roughly 60% the weight of the Mazaltepec mark.

**Sticky WhatsApp button** appears on mobile once the hero scrolls out of view.

## The plot map

Port the attached `PlanoLotesE2.jsx` to TypeScript and Tailwind. Keep its geometry, IDs, interaction model and accessibility behavior. Drop its price-list links — replace both CTAs with WhatsApp.

Lot status is a hardcoded record in a data module (`disponible` | `apartado` | `vendido`), editable by hand. No database, no API.

**The SVG artwork is a placeholder** and will be replaced by a file from our architect within days. Isolate it so the swap is a one-file change: geometry in its own module, status and click handlers bound by looking up `id`. The final file will have one closed `<path>` per lot with `id="L-78"` etc. Lot numbers and areas are rendered by our code, never baked into the artwork.

### Lot inventory — exact figures, do not invent

The 13 sellable lots sum to exactly **2,220.76 m²**. Write a test asserting this.

| Lot | m² | In inventory |
|---|---|---|
| L-76 | 337.76 | No — third-party owner |
| L-77 | 170.00 | No — third-party owner |
| L-78 | 182.78 | Yes |
| L-79 | 185.12 | Yes |
| L-80 | 175.94 | Yes |
| L-81 | 165.89 | Yes |
| L-82 | 168.74 | Yes |
| L-83 | 168.74 | Yes |
| L-84 | 168.74 | Yes |
| L-85 | 163.22 | Yes |
| L-86 | 158.58 | Yes |
| L-87 | 168.74 | Yes |
| L-88 | 168.74 | Yes |
| L-89 | 168.74 | Yes |
| L-90 | 176.79 | Yes |

L-76 and L-77 always render as sold and are excluded from the counter.

## WhatsApp and attribution

Number: `+52 993 228 2449` → `https://wa.me/5219932282449?text=...`

| Trigger | Pre-filled message |
|---|---|
| Hero / sticky button | `Hola, quiero informes de la Etapa 2 de Jardines de Mazaltepec.` |
| A specific lot | `Hola, me interesa el lote L-XX de la Etapa 2 de Jardines de Mazaltepec (ref CÓDIGO). ¿Me pueden dar informes?` |
| Payment section | `Hola, quiero conocer las opciones de crédito directo de la Etapa 2.` |
| Visit section | `Hola, quiero agendar una visita a Jardines de Mazaltepec.` |

Build this in from the start, not later:

1. **Advisor code** — read `?a=` from the URL, persist in `sessionStorage`, inject into every WhatsApp message and into the form payload. This is how sales commission gets attributed.
2. **UTM capture** — persist all `utm_*` params the same way, send with the form payload.
3. **Meta Pixel and GA4** — IDs from env vars, no-ops when absent. Fire an event on every WhatsApp click and on form submit.

## Design system — follow exactly, do not improvise

Typeface **Poppins**, weights 300/400/500/600, loaded via `next/font`. Body copy is 300.

```
pine-800  #184A3A    pine-700 #1F5E49    pine-600 #2A7058
pine-100  #D5E8E0    pine-50  #EEF6F3
leaf-700  #416C3F    leaf-400 #82B280    leaf-100 #DBE6DB
camel-700 #7E683D    camel-500 #B3996B   camel-200 #E8DCC7
cream-50  #F7F8F1    cream-100 #EFF0E2   cream-200 #E2E2D6   cream-300 #D2D2C4
ink-900   #14201B    ink-600  #4B5A52    ink-400 #8A958D
ink-200   #C6CCC8    ink-100  #E0E4E1
```

- Cream is the primary surface. `pine-800` is the primary action. Camel is an accent at roughly 5% of any screen — never a large fill.
- Border radius `0.75rem` on cards and buttons.
- Transitions 120ms, `cubic-bezier(0.2, 0, 0, 1)`. No bounce, no parallax, no scroll-jacking, no animated counters. Honor `prefers-reduced-motion`.
- Mobile-first. Every section's headline and primary CTA must be reachable on a phone without hunting.

## Content rules that override anything else

- Never publish price per m², discounts, percentages, monthly payment amounts or internal pricing logic.
- Never state or imply a return on investment or guaranteed appreciation.
- The 9,000 m² line is used in full, exactly as written above.
- Do not mention road projects, future infrastructure, or Etapa 3 / departamentos anywhere on this page.
- Do not label lots as Premium or Estándar.
- No emojis. No exclamation marks except where written above (there are none).

## Placeholder convention

I will edit placeholders directly in the code, so make them trivial to find.

- **All Spanish copy lives in one module, `content/copy.ts`.** No hardcoded strings in components.
- Every provisional value carries a `// PLACEHOLDER:` comment, so `grep -rn "PLACEHOLDER:"` returns the full punch list.
- Generate `PLACEHOLDERS.md` at the repo root listing each placeholder, its file path, and what real content replaces it — split into copy, figures, and media slots.

## Quality bar

- Lighthouse performance and accessibility ≥ 95 on mobile. There are no images, so there is no excuse.
- Semantic HTML, labeled inputs, visible keyboard focus, alt text on everything, `MediaSlot` blocks marked decorative.
- Form validates Mexican phone numbers, shows inline errors in Spanish, includes a honeypot field.
- No secrets in client code. Ship `.env.example` documenting every variable.
- `README.md` covering setup, env vars, how to edit lot status, and **step-by-step instructions for swapping in the architect's SVG and for replacing a `MediaSlot` with real media**.

## Metadata

```
<title>      Etapa 2 — Los últimos lotes de Jardines de Mazaltepec
description  Los últimos lotes del fraccionamiento. Zona Country, Villahermosa.
             Crédito directo con enganche desde $360,000.
og:title     Los últimos lotes de Jardines de Mazaltepec
og:image     Solid pine-800 card with the wordmark, generated at build time.
```

Build the whole thing straight through. Ask me only if something contradicts these instructions.
