/**
 * Genera tokens.css (Tailwind v4 @theme + temas claro/oscuro) y tokens.json.
 * Ejecutar: node tokens/build.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import t from "./tokens.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const BANNER = "/* GENERADO por tokens/build.mjs desde tokens.mjs — no editar. */";

const ramp = (n, s) => Object.entries(s).map(([k, v]) => `  --color-${n}-${k}: ${v};`).join("\n");
const roles = (r) => Object.entries(r)
  .map(([k, v]) => `  --${k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}: ${v};`).join("\n");

const css = `${BANNER}

@theme {
  --font-sans: ${t.font.sans};

  /* Marca — pine · Verde Bosque */
${ramp("pine", t.pine)}

  /* Marca — leaf · Verde Follaje */
${ramp("leaf", t.leaf)}

  /* Acento — camel */
${ramp("camel", t.camel)}

  /* Suelo — cream · Blanco Verdoso */
${ramp("cream", t.cream)}

  /* Texto — ink · Tinta */
${ramp("ink", t.ink)}

  /* Estados */
${Object.entries(t.semantic).map(([n, s]) => ramp(n, s)).join("\n")}

  /* Impresión */
  --color-white: ${t.print.white};
  --color-black: ${t.print.black};

  /* Espaciado */
${Object.entries(t.space).map(([k, v]) => `  --spacing-${k}: ${v};`).join("\n")}

  /* Radios — cajas 0.75rem, líneas píldora */
  --radius-box-sm: ${t.radius.boxSm};
  --radius-box: ${t.radius.box};
  --radius-box-lg: ${t.radius.boxLg};

  /* Elevación */
  --shadow-card: ${t.shadow.card};
  --shadow-raised: ${t.shadow.raised};

  /* Tracking del eyebrow */
  --tracking-eyebrow: ${t.tracking.eyebrow};
  --tracking-eyebrow-wide: ${t.tracking.eyebrowWide};

  /* Movimiento */
  --duration-fast: ${t.motion.fast};
  --duration-base: ${t.motion.base};
  --duration-slow: ${t.motion.slow};
  --ease-brand: ${t.motion.ease};
  --ease-brand-out: ${t.motion.easeOut};
}

/* ── Roles por tema ──────────────────────────────────────────────────────
   Tres estados: elección explícita clara, elección explícita oscura, y el
   predeterminado "sistema" que no estampa nada y solo distingue por
   prefers-color-scheme. Los tres se resuelven a nivel de token. */

:root {
${roles(t.theme.light)}
  --shadow-elev-card: ${t.shadow.card};
  --shadow-elev-raised: ${t.shadow.raised};
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${roles(t.theme.dark)}
    --shadow-elev-card: ${t.shadow.cardDark};
    --shadow-elev-raised: ${t.shadow.raisedDark};
  }
}

:root[data-theme="dark"] {
${roles(t.theme.dark)}
  --shadow-elev-card: ${t.shadow.cardDark};
  --shadow-elev-raised: ${t.shadow.raisedDark};
}

/* ── Base ─────────────────────────────────────────────────────────────── */

body {
  background: var(--ground);
  color: var(--text);
  font-family: ${t.font.sans};
  font-weight: 300;
  line-height: ${t.type.body.leading};
}

/* Poppins nunca por encima de 600. */
h1, h2, h3, h4, h5, h6, strong, b { font-weight: 600; }

.eyebrow {
  font-size: ${t.type.label.size};
  font-weight: ${t.type.label.weight};
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
}

:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}

/* Inputs numéricos sin flechas nativas. */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; appearance: textfield; }
`;

writeFileSync(join(here, "tokens.css"), css);
writeFileSync(join(here, "tokens.json"), JSON.stringify({ $comment: BANNER, ...t }, null, 2) + "\n");

const n = [t.pine, t.leaf, t.camel, t.cream, t.ink, ...Object.values(t.semantic)]
  .reduce((a, s) => a + Object.keys(s).length, 0);
console.log(`brand: tokens.css + tokens.json escritos (${n} colores, ${Object.keys(t.space).length} pasos de espaciado)`);
