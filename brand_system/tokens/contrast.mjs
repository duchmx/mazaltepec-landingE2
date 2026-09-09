/**
 * Verificación WCAG de todos los pares sancionados, en los dos temas.
 * Ejecutar: node tokens/contrast.mjs   (sale con código 1 si algo obligatorio falla)
 */
import t from "./tokens.mjs";

const lum = (h) => {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const R = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const L = t.theme.light, D = t.theme.dark;

// [nombre, fg, bg, mínimo exigido]  — 0 = informativo, no bloquea
const PAIRS = [
  ["── CLARO ─────────────────────────────────"],
  ["texto sobre fondo",            L.text, L.ground, 4.5],
  ["texto sobre fondo alterno",    L.text, L.groundAlt, 4.5],
  ["texto atenuado sobre fondo",   L.textMuted, L.ground, 4.5],
  ["texto tenue sobre fondo",      L.textFaint, L.ground, 3],
  ["acento sobre fondo",           L.accent, L.ground, 4.5],
  ["acento sobre fondo alterno",   L.accent, L.groundAlt, 4.5],
  ["blanco sobre acento (botón)",  L.textOnInvert, L.accent, 4.5],
  ["blanco sobre hover de acento", L.textOnInvert, L.accentHover, 4.5],
  ["texto en sección invertida",   L.textOnInvert, L.groundInvert, 4.5],
  ["cream sobre invertido",        t.cream[100], L.groundInvert, 4.5],
  ["texto follaje sobre fondo",    L.secondaryText, L.ground, 4.5],
  ["texto camel sobre fondo",      L.warmText, L.ground, 4.5],
  ["texto camel sobre alterno",    L.warmText, L.groundAlt, 4.5],
  ["follaje sobre invertido",      t.leaf[400], L.groundInvert, 3],
  ["camel sobre invertido",        t.camel[300], L.groundInvert, 4.5],
  ["follaje relleno (no texto)",   L.secondary, L.ground, 0],
  ["camel relleno (no texto)",     L.warm, L.ground, 0],
  ["── OSCURO ────────────────────────────────"],
  ["texto sobre fondo",            D.text, D.ground, 4.5],
  ["texto sobre superficie",       D.text, D.surface, 4.5],
  ["texto atenuado sobre fondo",   D.textMuted, D.ground, 4.5],
  ["texto tenue sobre fondo",      D.textFaint, D.ground, 3],
  ["acento (leaf) sobre fondo",    D.accent, D.ground, 4.5],
  ["acento sobre superficie",      D.accent, D.surface, 4.5],
  ["hover de acento sobre fondo",  D.accentHover, D.ground, 4.5],
  ["secundario (pine) sobre fondo",D.secondaryText, D.ground, 4.5],
  ["texto camel sobre fondo",      D.warmText, D.ground, 4.5],
  ["blanco sobre pine-superficie", D.textOnInvert, D.groundInvert, 4.5],
  ["leaf sobre pine-superficie",   t.leaf[400], D.groundInvert, 3],
  ["pine como ACENTO (debe fallar)", t.pine[800], D.ground, 0],
  ["── ESTADOS / claro ───────────────────────"],
  ...Object.entries(t.semantic).map(([n, s]) => [`${n} 700 sobre ${n} 100`, s[700], s[100], 4.5]),
  ["── ESTADOS / oscuro ──────────────────────"],
  ...Object.entries(t.semantic).map(([n, s]) => [`${n} 300 sobre fondo oscuro`, s[300], D.ground, 4.5]),
];

let fails = 0;
for (const p of PAIRS) {
  if (p.length === 1) { console.log("\n" + p[0]); continue; }
  const [name, fg, bg, min] = p;
  const r = R(fg, bg);
  const grade = r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA-lg" : "—";
  let mark = "  ";
  if (min > 0) { if (r >= min) mark = "ok"; else { mark = "XX"; fails++; } }
  console.log(`  ${mark}  ${r.toFixed(2).padStart(5)}  ${grade.padEnd(5)}  ${name}  ${fg}/${bg}`);
}
console.log(fails ? `\n${fails} par(es) por debajo del mínimo exigido.` : "\nTodos los pares obligatorios cumplen.");
process.exit(fails ? 1 : 0);
