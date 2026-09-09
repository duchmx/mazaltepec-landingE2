# Placeholders

Everything provisional on the page, in one list. `grep -rn "PLACEHOLDER:" .` returns the
same set from the code.

---

## Copy

| What | File | Replace with |
|---|---|---|
| Hero price note — reads `Precio de contado.` | `content/copy.ts` → `hero.priceNote` | The brief's hero block and its money rules disagree: the hero says `Precio de contado.`, the money rules say `Precio de preventa con descuento de contado.` The shorter one is live because it names no discount. Swap the string if you want the longer note. |
| Production origin `https://e2.mazaltepec.com` | `content/copy.ts` → `site.url` | Confirm before launch. Feeds the canonical URL and `og:url`. |
| Aviso de privacidad link | `content/copy.ts` → `footer.privacyHref` | URL of the published privacy notice. |
| Google Maps link behind `Cómo llegar →` | `content/copy.ts` → `visit.directionsHref` | The exact pin for the Etapa 2 sales access, not a name search. |

All other Spanish copy is final as given and lives in `content/copy.ts`.

---

## Figures

| What | File | Replace with |
|---|---|---|
| Status of every lot L-78 … L-90 (all `disponible` today) | `data/lots.ts` → `LOTS` | The real status of each lot: `disponible`, `apartado` or `vendido`. The availability counter follows automatically. |

Not placeholders — do not change without a source document:

- Lot areas. The 13 sellable lots sum to exactly 2,220.76 m², asserted in `tests/lots.test.ts`.
- L-77 is third-party owned: `inInventory: false`, always rendered as sold and excluded from
  the counter. L-76 falls outside the plan's polygon and is not in the file at all.
- Lot label anchors in `data/lots.ts` are area centroids in artwork viewBox units, checked
  visually against the plan. Retune them only if the artwork is replaced.
- The two money figures (`$1,560,000`, `$360,000`) are the only pricing allowed on the page.

---

## Media slots

No photography or video exists yet. Every slot renders as a flat brand-color block at a
locked aspect ratio; passing `src` is the only change needed when assets arrive. See
README, "Replacing a MediaSlot with real media".

| Slot | Section / file | Ratio | Tone | Intended asset |
|---|---|---|---|---|
| `HERO — aerial video loop` | `components/sections/Hero.tsx` | fills the viewport | `pine-800` | Aerial loop of the built subdivision, behind the hero copy. |
| `FRACCIONAMIENTO A — parque y senderos` | `components/sections/Subdivision.tsx` | `4/5` | `pine-700` | Still of the parks and walking paths. |
| `FRACCIONAMIENTO B — alberca y áreas sociales` | `components/sections/Subdivision.tsx` | `4/5` | `leaf-400` | Still of the pool and social areas. |
| `VISITA — mapa de ubicación` | `components/sections/Visit.tsx` | `16/9` | `cream-200` | Static map image of the location. No live Google Maps embed. |

---

## Plot map artwork

The map is real, not a placeholder: `components/plot-map/artwork.tsx` carries the traced lot
polygons and points at `public/plano-base.webp`, the rendered plan they sit on. Both share
the 211 × 265.224 frame, and `tests/artwork.test.tsx` fails if that registration drifts.

It is still isolated to one file, so the architect's final drawing replaces it wholesale
without touching anything else. See README, "Swapping in the architect's SVG".

| What | File | Replace with |
|---|---|---|
| Traced lot polygons and base render | `components/plot-map/artwork.tsx`, `public/plano-base.webp` | The architect's delivered drawing, when it lands. Lot ids, numbers and areas stay ours — they are never baked into the artwork. |
