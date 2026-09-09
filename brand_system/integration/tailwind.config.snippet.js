/**
 * Jardines de Mazaltepec — Snippet para proyectos con Tailwind CSS v3.
 * Si tu proyecto usa Tailwind CSS v3, copia este bloque de configuración en tu
 * file `tailwind.config.js` dentro de `theme.extend`.
 */

import brand from "../tokens/tokens.mjs";

export const tailwindV3Extend = {
  fontFamily: {
    sans: ["Poppins", "Trebuchet MS", "system-ui", "-apple-system", "sans-serif"],
  },
  colors: {
    pine: brand.pine,
    leaf: brand.leaf,
    camel: brand.camel,
    cream: brand.cream,
    ink: brand.ink,
    // Roles semánticos de tema
    ground: "var(--ground)",
    "ground-alt": "var(--ground-alt)",
    "ground-invert": "var(--ground-invert)",
    surface: "var(--surface)",
    "surface-alt": "var(--surface-alt)",
    "accent-brand": "var(--accent)",
    "accent-hover": "var(--accent-hover)",
    "warm-brand": "var(--warm)",
  },
  borderRadius: {
    box: brand.radius.box,       // 0.75rem (defect para tarjetas, botones, inputs)
    "box-sm": brand.radius.boxSm, // 0.375rem (controles pequeños)
    "box-lg": brand.radius.boxLg, // 1.25rem (paneles, modales)
    pill: brand.radius.pill,     // 9999px (badges, tags, chips)
  },
  letterSpacing: {
    eyebrow: brand.tracking.eyebrow,
    "eyebrow-wide": brand.tracking.eyebrowWide,
  },
  boxShadow: {
    card: brand.shadow.card,
    raised: brand.shadow.raised,
  },
  transitionTimingFunction: {
    brand: brand.motion.ease,
    "brand-out": brand.motion.easeOut,
  },
  transitionDuration: {
    fast: brand.motion.fast,
    base: brand.motion.base,
    slow: brand.motion.slow,
  },
};

export default tailwindV3Extend;
