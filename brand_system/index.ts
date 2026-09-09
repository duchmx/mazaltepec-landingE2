/**
 * Jardines de Mazaltepec — Entry Point Principal del Sistema de Marca
 * Re-exporta los tokens de diseño tipados y provee metadatos de recursos.
 */

export { brand, default } from "./tokens/tokens";
export type { BrandTokens, Roles } from "./tokens/tokens";

export const assetsMeta = {
  logos: [
    "jm-horizontal-color.svg",
    "jm-horizontal-blanco.svg",
    "jm-horizontal-negro.svg",
    "jm-vertical-color.svg",
    "jm-vertical-blanco.svg",
    "jm-vertical-negro.svg",
  ],
  icons: [
    "alberca", "calendario", "cancha", "email", "estacionamiento",
    "estilo-de-vida", "gimnasio", "juegos-infantiles", "medidas", "padel",
    "plusvalia", "proyecto", "seguridad", "senderos", "sustentabilidad",
    "telefono", "trato", "ubicacion", "whats",
  ],
} as const;
