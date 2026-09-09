/**
 * Accesor tipado para contextos TS/TSX que necesitan hex crudo en vez de
 * utilidades de Tailwind: Recharts, @react-pdf/renderer, canvas, plantillas
 * de correo. La fuente de verdad es ./tokens.mjs; aquí solo se re-exporta.
 */
import tokens from "./tokens.mjs";

type Ramp = Readonly<Record<string, string>>;
type Estado = "success" | "warning" | "danger" | "info";

export interface Roles {
  ground: string; groundAlt: string; groundInvert: string;
  surface: string; surfaceAlt: string;
  border: string; borderStrong: string;
  text: string; textMuted: string; textFaint: string; textOnInvert: string;
  accent: string; accentHover: string; accentText: string;
  secondary: string; secondaryText: string;
  warm: string; warmText: string;
  focus: string;
}

export interface BrandTokens {
  nombres: Readonly<Record<string, { es: string; hex: string; paso: number | null }>>;
  pine: Ramp; leaf: Ramp; camel: Ramp; cream: Ramp; ink: Ramp;
  print: Readonly<{ white: string; black: string }>;
  proporcion: Readonly<Record<string, number>>;
  semantic: Readonly<Record<Estado, Ramp>>;
  theme: Readonly<{ light: Roles; dark: Roles }>;
  font: Readonly<{ sans: string; weights: number[]; googleFonts: string; pdf: string; pdfBold: string }>;
  type: Readonly<Record<string, Readonly<Record<string, string | number>>>>;
  space: Ramp;
  radius: Readonly<Record<"boxSm" | "box" | "boxLg" | "pill", string>>;
  shadow: Readonly<Record<"card" | "raised" | "cardDark" | "raisedDark", string>>;
  tracking: Readonly<Record<"eyebrow" | "eyebrowWide", string>>;
  motion: Readonly<{ fast: string; base: string; slow: string; ease: string; easeOut: string; prohibido: string[] }>;
  density: Readonly<Record<"presentation" | "workspace", Ramp>>;
  logo: Readonly<Record<string, string | string[]>>;
}

export const brand = tokens as unknown as BrandTokens;
export default brand;
