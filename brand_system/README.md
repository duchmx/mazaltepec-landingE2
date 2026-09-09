# Sistema de Marca Autocontenido — Jardines de Mazaltepec

Paquete portable listo para ser copiado directamente en cualquier proyecto (Next.js, Vite, React, Vue, HTML estático, etc.) para aplicar la identidad de marca unificada.

---

## 📁 Estructura del Paquete `brand_system`

```
brand_system/
├── README.md                           # Este manual de integración
├── index.ts                            # Re-export de tokens y metadatos para TypeScript
├── index.mjs                           # Re-export de tokens y metadatos para ES Modules
├── tokens/
│   ├── tokens.mjs                      # FUENTE DE VERDAD de diseño (colores, sombras, radios)
│   ├── tokens.css                      # @theme de Tailwind v4 + variables CSS para :root y modo oscuro
│   ├── tokens.ts                       # Tipos e interfaz TypeScript de los tokens
│   ├── tokens.json                     # Exportación plana en JSON (Figma, scripts)
│   ├── build.mjs                       # Script para regenerar tokens.css y tokens.json
│   └── contrast.mjs                    # Verificador de accesibilidad WCAG (AA/AAA)
├── assets/
│   ├── logo/                           # 6 logotipos vectoriales SVG (horizontal/vertical, color/blanco/negro)
│   ├── icons/                          # 19 iconos vectoriales SVG en currentColor (100x100px)
│   └── favicons/                       # Favicon SVG vectorial y manifest PWA (site.webmanifest)
└── integration/
    ├── tailwind.config.snippet.js      # Configuración de extensión para proyectos Tailwind v3
    ├── fonts.css                       # Carga oficial de la tipografía Poppins (Google Fonts)
    └── react/                          # Componentes React listos para usar
        ├── BrandLogo.tsx               # Componente React para el logotipo
        └── BrandIcon.tsx               # Componente React para la colección de 19 iconos
```

---

## 🚀 Guía Rápida de Integración

### Paso 1: Copiar la carpeta
Copia la carpeta `brand_system` completa dentro de la raíz o carpeta `src/` de tu nuevo proyecto:
```bash
cp -r brand_system /ruta-de-tu-nuevo-proyecto/
```

---

### Paso 2: Conectar el Sistema de Estilos

#### Opción A: Proyectos con Tailwind CSS v4 (Recomendado)
En el archivo CSS global de tu proyecto (`globals.css` o `main.css`), añade el `@import` a `tokens.css`:

```css
@import "tailwindcss";
@import "./brand_system/tokens/tokens.css";
```
*¡Listo!* Tendrás disponibles automáticamente:
- Clases de color: `bg-pine-800`, `text-ink-900`, `border-cream-200`, `bg-leaf-400`, `text-camel-700`.
- Roles adaptativos de tema: `bg-[var(--ground)]`, `text-[var(--text)]`, `bg-[var(--surface)]`, `border-[var(--border)]`.

---

#### Opción B: Proyectos con Tailwind CSS v3
Si tu proyecto utiliza Tailwind v3, extiende la configuración en tu `tailwind.config.js`:

```js
import { tailwindV3Extend } from "./brand_system/integration/tailwind.config.snippet.js";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      ...tailwindV3Extend
    }
  }
}
```

---

#### Opción C: Proyectos con CSS / HTML Puro
Incluye las variables CSS y la tipografía en tu HTML:

```html
<link rel="stylesheet" href="./brand_system/integration/fonts.css">
<link rel="stylesheet" href="./brand_system/tokens/tokens.css">
```

---

### Paso 3: Tipografía Poppins
Carga la fuente Poppins oficial (pesos 300, 400, 500, 600) en tu proyecto:

- **Vía CSS**: Importa `brand_system/integration/fonts.css`
- **Vía Next.js `next/font/google`**:
  ```tsx
  import { Poppins } from 'next/font/google';

  const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600'],
    variable: '--font-sans',
  });
  ```
> **REGLA:** Nunca usar el peso `700` ni cursivas. Rompe la estética de serenidad de la marca.

---

### Paso 4: Uso de Tokens en TypeScript / JS (Recharts, Canvas, PDFs)

Para contextos donde no se usan clases CSS (ej. gráficos de Recharts, PDFs con `@react-pdf/renderer` o correos HTML):

```ts
import brand from "@/brand_system";

// Acceso directo a colores hex
const verdeBosque = brand.pine[800]; // #184A3A
const verdeFollaje = brand.leaf[400]; // #82B280

// Gráfica de ejemplo
<Area fill={brand.leaf[400]} stroke={brand.pine[800]} />
```

---

### Paso 5: Componentes React (Opcional)

Puedes usar los componentes React preconstruidos en `brand_system/integration/react/`:

```tsx
import { BrandLogo } from "@/brand_system/integration/react/BrandLogo";
import { BrandIcon } from "@/brand_system/integration/react/BrandIcon";

// Logotipo
<BrandLogo orientation="horizontal" variant="color" className="h-10" />

// Iconos (19 disponibles)
<BrandIcon name="alberca" size={24} className="text-pine-800" />
<BrandIcon name="seguridad" size={32} />
```

---

## 🎨 Los 5 Colores de Marca y Modo Oscuro

| Token | Nombre oficial | Hex Ancla | Rol Claro | Rol Oscuro |
|---|---|---|---|---|
| `pine` | Verde Bosque | `#184A3A` | Color Principal / CTA / Fondos | Superficie Oscura |
| `leaf` | Verde Follaje | `#82B280` | Acento Secundario Gráfico | Color Principal en Oscuro (AAA 7.33) |
| `camel` | Camel | `#B3996B` | Acento Cálido (Máximo 5%) | Acento Cálido en Oscuro |
| `cream` | Blanco Verdoso | `#EFF0E2` | Fondo Neutro Secundario | Texto Principal en Oscuro |
| `ink` | Tinta | `#14201B` | Texto Principal en Claro | Base del Fondo Oscuro (`#0E1A15`) |

---

## 📜 Reglas Inviolables de Marca

1. **Camel al 5% Máximo**: El color Camel no debe ocupar más del 5% del área visual de ninguna pantalla o pieza. Proporción cromática: 60% Neutros / 25% Pine / 10% Leaf / 5% Camel y Negro.
2. **Radios**: `0.75rem` (`rounded-box`) para contenedores y cajas (tarjeta, botón, input, tile). Píldora (`rounded-pill`) para elementos de una sola línea (badge, tag, chip).
3. **Poppins sin Peso Bold (700+)**: Usar solo pesos 300, 400, 500 y 600.
4. **Logotipo**: Pegar como SVG vectorizado intacto. No recomponer texto a mano, ni rotar, ni cambiar colores fuera de paleta. Ancho mínimo: 100px digital, 25mm impreso. Sobre fotografías usar únicamente la variante `blanco`.
5. **Animaciones**: Nada de rebotes (bounce), efectos spring descontrolados ni parallax. El movimiento debe ser sobrio y sereno (`120ms` - `320ms`, `cubic-bezier(0.2, 0, 0, 1)`).

---

## 📋 Evaluación de Archivos y Recomendaciones

| Recurso / Archivo | Estado en `brand_system` | Acción / Recomendación |
|---|---|---|
| **Tokens CSS & JS** | ✅ Incluido completo | `tokens/tokens.css`, `tokens.mjs`, `tokens.ts`, `tokens.json`. |
| **Logotipos Vectoriales** | ✅ Incluido (6 variantes SVG) | `assets/logo/` (horizontal/vertical x color/blanco/negro). |
| **Iconografía** | ✅ Incluido (19 SVG) | `assets/icons/` en SVG `currentColor`. |
| **Favicon Vectorial** | ✅ Creado en `brand_system` | `assets/favicons/favicon.svg` con la gema isotipo de la marca. |
| **Web Manifest PWA** | ✅ Creado en `brand_system` | `assets/favicons/site.webmanifest` con colores `#184A3A` y `#0E1A15`. |
| **Favicons PNG (Legacy)** | ⚠️ Opcional para navegadores antiguos | Generar `favicon-32x32.png` y `apple-touch-icon-180x180.png` si el proyecto destino requiere soporte a navegadores legacy antiguos sin SVG favicon. |
| **Social OpenGraph (`og-image.png`)** | ⚠️ Falta imagen de previsualización | Se recomienda crear un PNG de 1200x630px con el logotipo blanco centrado sobre fondo `pine-800` (`#184A3A`) para compartir en redes sociales. |
