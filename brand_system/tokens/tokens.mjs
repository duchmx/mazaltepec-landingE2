/**
 * Jardines de Mazaltepec — sistema de diseño unificado.
 * FUENTE DE VERDAD. tokens.css, tokens.json y tokens.ts se generan desde aquí
 * con `node tokens/build.mjs`. No editar los generados a mano.
 *
 * Procedencia de cada valor:
 *   [oficial]  Ficha de Imagen Corporativa (CorelDRAW, ago-2025). Intocable.
 *   [rampa]    Paso derivado de un ancla oficial. Se puede afinar, no mover el ancla.
 *   [ui]       Token de interfaz sin equivalente impreso (estados, movimiento, densidad).
 *
 * Los nombres van en inglés por estándar de programación. La correspondencia
 * con los nombres oficiales en español está en `nombres`, y es la que debe
 * usarse al hablar con imprenta, proveedores o dirección.
 */

/** Nombres oficiales ↔ tokens. Un solo mapa, sin vocabularios sueltos. */
export const nombres = {
  pine:  { es: "Verde Bosque",   hex: "#184A3A", paso: 800 },
  leaf:  { es: "Verde Follaje",  hex: "#82B280", paso: 400 },
  camel: { es: "Camel",          hex: "#B3996B", paso: 500 },
  cream: { es: "Blanco Verdoso", hex: "#EFF0E2", paso: 100 },
  ink:   { es: "Tinta",          hex: "#14201B", paso: 900 },
  white: { es: "Blanco",         hex: "#FFFFFF", paso: null },
  black: { es: "Negro",          hex: "#000000", paso: null },
};

/** Primario. Fondos de marca, títulos, símbolo, CTA. En oscuro pasa a SUPERFICIE. */
export const pine = {
  50:  "#EEF6F3", // [rampa]
  100: "#D5E8E0", // [rampa]
  200: "#AED3C4", // [rampa]
  300: "#7BB8A1", // [rampa]
  400: "#4A9C80", // [rampa] acento sobre oscuro (5.40 sobre #0E1A15)
  500: "#36856A", // [rampa] relleno de gráficas
  600: "#2A7058", // [rampa] anillo de foco, borde de botón outline
  700: "#1F5E49", // [rampa] hover de 800
  800: "#184A3A", // [oficial] VERDE BOSQUE
  900: "#103A2C", // [rampa]
  950: "#0C2A20", // [rampa] parada profunda de degradado
};

/**
 * Secundario. Rombos del símbolo, acentos, subrayados.
 * Es el color que brand_A había perdido. En modo oscuro lidera: leaf-400
 * sobre el fondo oscuro da 7.33 (AAA), lo que pine no puede hacer.
 */
export const leaf = {
  50:  "#F8FAF8", // [rampa]
  100: "#DBE6DB", // [rampa]
  200: "#BED4BE", // [rampa]
  300: "#A1C39F", // [rampa]
  400: "#82B280", // [oficial] VERDE FOLLAJE
  500: "#66A263", // [rampa] último paso legible sobre oscuro (5.87)
  600: "#528850", // [rampa]
  700: "#416C3F", // [rampa] primer paso legible sobre claro (6.10)
  800: "#2F502E", // [rampa]
  900: "#1E331D", // [rampa]
  950: "#0D170D", // [rampa]
};

/**
 * Acento cálido. Rampa completa y sin restricción de contexto, pero regido por
 * la proporción: nunca más del 5% de una pieza. Ver `proporcion`.
 */
export const camel = {
  50:  "#FDFCFA", // [rampa]
  100: "#F3ECE0", // [rampa]
  200: "#E8DCC7", // [rampa]
  300: "#DAC9AB", // [rampa] texto sobre pine (6.22)
  400: "#C7B28C", // [rampa] texto sobre pine, más contraste
  500: "#B3996B", // [oficial] CAMEL — relleno y acento, NO texto sobre claro (2.73)
  600: "#9C814F", // [rampa]
  700: "#7E683D", // [rampa] primer paso legible sobre claro (5.34)
  800: "#61502D", // [rampa]
  900: "#45391F", // [rampa]
  950: "#2A2312", // [rampa]
};

/** Suelo neutro. Fondos de sección, tarjetas, bordes. Rampa corta a propósito. */
export const cream = {
  50:  "#F7F8F1", // [rampa]
  100: "#EFF0E2", // [oficial] BLANCO VERDOSO
  200: "#E2E2D6", // [rampa] BORDE por defecto
  300: "#D2D2C4", // [rampa] divisor fuerte
  400: "#C1C1B3", // [rampa]
  500: "#AFAFA3", // [rampa]
};

/** Neutros verde-negro. Todo el texto y los iconos. Nunca #000 en pantalla. */
export const ink = {
  50:  "#F7F8F7", // [rampa]
  100: "#E0E4E1", // [rampa]
  200: "#C6CCC8", // [rampa]
  300: "#A8B1AB", // [rampa] texto deshabilitado
  400: "#8A958D", // [rampa] pista, marcador de posición
  500: "#6A776F", // [rampa] primer paso legible sobre claro (4.69)
  600: "#4B5A52", // [rampa] texto secundario
  700: "#2C3A33", // [rampa] etiquetas
  800: "#1F2D26", // [rampa] cuerpo enfatizado
  900: "#14201B", // [oficial] TINTA — texto principal
  950: "#0C1512", // [rampa]
};

/**
 * Utilidades de impresión. No son colores de marca de pantalla.
 * `black` vive dentro del vector bloqueado del logotipo y en material impreso
 * a una tinta. Fuera de ahí, el texto es `ink`.
 */
export const print = {
  white: "#FFFFFF", // [oficial]
  black: "#000000", // [oficial] solo logotipo e impresión
};

/** Proporción cromática recomendada por pieza. Ficha oficial. */
export const proporcion = {
  neutros: 60, // blanco + cream
  pine: 25,
  leaf: 10,
  camelYNegro: 5, // [oficial] el techo del camel
};

/**
 * [ui] Estados semánticos. Nombrados por SIGNIFICADO, no por tono, y templados
 * hacia lo terroso para convivir con la paleta. Los pasos 300/400 existen para
 * texto sobre fondo oscuro; los 600/700 para texto sobre fondo claro.
 */
export const semantic = {
  success: { 100: "#DCEFE1", 200: "#BCDFC7", 300: "#8FCCA5", 400: "#5FB07E", 600: "#2F7D4F", 700: "#24603D" },
  warning: { 100: "#FBEECD", 200: "#F5DDA3", 300: "#EFCB77", 400: "#DCAE49", 600: "#B07D1A", 700: "#8A6113" },
  danger:  { 100: "#FADEDB", 200: "#F2BDB7", 300: "#EDA79E", 400: "#DE8175", 600: "#B3453B", 700: "#8F342C" },
  info:    { 100: "#D5EAF0", 200: "#A9D3DE", 300: "#8FC9D8", 400: "#5AAAC0", 600: "#0D6B83", 700: "#074151" },
};

/**
 * Roles por tema. Esta es la pieza que hace funcionar el modo oscuro.
 *
 * La marca tiene dos verdes y eso resuelve el problema por sí solo: pine está
 * a L19, casi tan oscuro como un fondo oscuro, así que sobre oscuro NO puede
 * ser acento (1.77, falla). Pasa a ser superficie, y leaf toma su lugar como
 * color que lidera. No es una inversión, es un intercambio de papeles.
 */
export const theme = {
  light: {
    ground: print.white,      // fondo base
    groundAlt: cream[100],    // sección alterna
    groundInvert: pine[800],  // sección invertida, texto blanco
    surface: print.white,
    surfaceAlt: cream[50],
    border: cream[200],
    borderStrong: cream[300],
    text: ink[900],
    textMuted: ink[600],
    textFaint: ink[400],
    textOnInvert: print.white,
    accent: pine[800],        // CTA, chrome, enlaces
    accentHover: pine[700],
    accentText: pine[800],
    secondary: leaf[400],     // acento gráfico, nunca texto (2.43)
    secondaryText: leaf[700], // cuando el follaje debe leerse (6.10)
    warm: camel[500],         // relleno y filetes
    warmText: camel[700],     // cuando el camel debe leerse (5.34)
    focus: pine[600],
  },
  dark: {
    ground: "#0E1A15",        // [ui] tinta profunda, mismo matiz que ink
    groundAlt: "#152318",     // [ui]
    groundInvert: pine[800],  // pine como SUPERFICIE, no como acento
    surface: "#152318",
    surfaceAlt: "#1B2C22",
    border: "#2A3D33",
    borderStrong: "#3D5347",
    text: cream[100],
    textMuted: ink[300],
    textFaint: ink[400],
    textOnInvert: print.white,
    accent: leaf[400],        // leaf lidera: 7.33 sobre el fondo (AAA)
    accentHover: leaf[300],
    accentText: leaf[400],
    secondary: pine[400],     // pine claro como secundario (5.40)
    secondaryText: pine[300],
    warm: camel[500],
    warmText: camel[400],     // sobre oscuro el camel se aclara, no se oscurece
    focus: leaf[400],
  },
};

/**
 * Tipografía. Trebuchet MS está CONGELADA: vive solo dentro del vector del
 * logotipo, no se usa para componer nada. Poppins es el sistema vivo.
 * Nunca peso 700+, nunca cursivas, nunca otra familia.
 */
export const font = {
  sans: "'Poppins', 'Trebuchet MS', system-ui, -apple-system, sans-serif",
  weights: [300, 400, 500, 600], // [oficial] el 700 rompe la calma de la marca
  googleFonts: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap",
  pdf: "Helvetica",
  pdfBold: "Helvetica-Bold",
};

/** Escala tipográfica. [oficial] Brandbook §4, llevada a tokens. */
export const type = {
  display: { size: "clamp(2.5rem, 5vw, 3.5rem)", weight: 600, tracking: "-0.02em", leading: 1.15 },
  h1:      { size: "clamp(2rem, 4vw, 2.75rem)",  weight: 600, tracking: "-0.02em", leading: 1.15 },
  h2:      { size: "clamp(1.75rem, 3vw, 2rem)",  weight: 600, tracking: "-0.01em", leading: 1.2 },
  h3:      { size: "clamp(1.25rem, 2vw, 1.5rem)",weight: 500, tracking: "0",       leading: 1.3 },
  body:    { size: "1rem",     weight: 400, tracking: "0", leading: 1.7 },
  bodyLight:{ size: "1rem",    weight: 300, tracking: "0", leading: 1.7 },
  small:   { size: "0.875rem", weight: 400, tracking: "0", leading: 1.6 },
  label:   { size: "0.75rem",  weight: 500, tracking: "0.14em", leading: 1.4, transform: "uppercase" },
};

/** [ui] Escala de espaciado. Base 4px. Hueco que no cubría ninguno de los dos. */
export const space = {
  0: "0", 1: "0.25rem", 2: "0.5rem", 3: "0.75rem", 4: "1rem", 5: "1.25rem",
  6: "1.5rem", 8: "2rem", 10: "2.5rem", 12: "3rem", 16: "4rem", 20: "5rem", 24: "6rem",
};

/**
 * Radios. La regla: las CAJAS llevan 0.75rem; las LÍNEAS llevan píldora.
 * Caja = algo cuyo ancho y alto importan (tarjeta, botón, input, tile).
 * Línea = algo definido por su altura (badge, tag, chip, control segmentado).
 */
export const radius = {
  boxSm: "0.375rem", // controles pequeños, checkbox
  box: "0.75rem",    // DEFECTO — tarjetas, botones, inputs, tiles
  boxLg: "1.25rem",  // paneles grandes, modal, hero
  pill: "9999px",    // badges, tags, chips, controles segmentados
};

/** Elevación. Dos niveles. Los bordes cargan la estructura, no las sombras. */
export const shadow = {
  card: "0 1px 2px 0 rgb(20 32 27 / 0.05)",
  raised: "0 4px 6px -1px rgb(20 32 27 / 0.08), 0 2px 4px -2px rgb(20 32 27 / 0.05)",
  cardDark: "0 1px 2px 0 rgb(0 0 0 / 0.35)",
  raisedDark: "0 4px 6px -1px rgb(0 0 0 / 0.45), 0 2px 4px -2px rgb(0 0 0 / 0.35)",
};

/** El "eyebrow": versalitas muy trackeadas. Firma tipográfica de la marca. */
export const tracking = {
  eyebrow: "0.14em",     // [oficial] label/UI/botón del brandbook §4
  eyebrowWide: "0.2em",  // encabezados de página
};

/**
 * [ui] Movimiento. La voz de marca es "serena": el movimiento es donde eso se
 * sostiene o se rompe. Nada rebota, nada hace parallax, nada se anima que no
 * responda a una acción del usuario.
 */
export const motion = {
  fast: "120ms",   // hover, foco, cambio de color
  base: "200ms",   // desplegables, toggles, movimiento corto
  slow: "320ms",   // modal, drawer, cambio de sección
  ease: "cubic-bezier(0.2, 0, 0, 1)",      // desaceleración limpia
  easeOut: "cubic-bezier(0.4, 0, 1, 1)",   // salidas
  prohibido: ["bounce", "spring", "parallax", "autoplay"],
};

/** [ui] Densidad. Mismos tokens, dos ritmos de fila. */
export const density = {
  presentation: { rowY: "0.75rem", rowX: "1rem", panelPad: "1.25rem" },
  workspace: { rowY: "0.375rem", rowX: "0.75rem", panelPad: "0.875rem" },
};

/** Reglas duras del logotipo. [oficial] Brandbook §2. */
export const logo = {
  zonaDeRespeto: "el ancho de un rombo del símbolo, en los cuatro lados",
  minDigitalHorizontal: "100px",
  minDigitalIsotipo: "40px",
  minImpresoHorizontal: "25mm",
  sobreFoto: "solo la versión blanca, con velo pine-800 al 50% si hace falta",
  prohibido: [
    "distorsionar proporciones", "rotar", "recolorear fuera de paleta",
    "sombras o degradados", "separar símbolo del texto en la horizontal",
    "encerrar en formas no autorizadas", "recomponer el texto a mano",
  ],
};

export const tokens = {
  nombres, pine, leaf, camel, cream, ink, print, proporcion,
  semantic, theme, font, type, space, radius, shadow, tracking, motion, density, logo,
};
export default tokens;
