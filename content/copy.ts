/**
 * Every Spanish string on the page lives here. Components must not hardcode copy.
 * Edit text in this file only — nothing else needs to change.
 */

export const site = {
  title: "Etapa 2 — Los últimos lotes de Jardines de Mazaltepec",
  description:
    "Los últimos lotes del fraccionamiento. Zona Country, Villahermosa. Crédito directo con enganche desde $360,000.",
  ogTitle: "Los últimos lotes de Jardines de Mazaltepec",
  locale: "es_MX",
  // PLACEHOLDER: confirm the production origin before launch (used for canonical + og:url).
  url: "https://e2.mazaltepec.com",
  skipToContent: "Ir al contenido",
} as const;

export const topBar = {
  /** The only nav item on the page: back to the main subdivision site. */
  homeLabel: "Volver a mazaltepec.com",
  homeHref: "https://mazaltepec.com",
} as const;

export const hero = {
  eyebrow: "ETAPA 2",
  headline: "Los últimos lotes de Jardines de Mazaltepec.",
  body: [
    "Un fraccionamiento que ya está construido, habitado y funcionando.",
    "En la zona Country de Villahermosa.",
  ],
  price: "Lotes desde $1,560,000",
  // PLACEHOLDER: the brief's hero block says "Precio de contado." while its money rules say
  // "Precio de preventa con descuento de contado." Using the hero wording, which avoids
  // naming a discount. Replace this string if the longer note is the one you want.
  priceNote: "Precio de contado.",
  ctaWhatsApp: "Hablar por WhatsApp",
  ctaAvailability: "Ver disponibilidad",
  // PLACEHOLDER: media slot — hero aerial video loop, 16/9, pine-800 until it arrives.
  mediaLabel: "HERO — aerial video loop",
} as const;

export const availability = {
  eyebrow: "DISPONIBILIDAD",
  headline: "Elige tu lote.",
  mapTitle: "Plano de lotes de la Etapa 2",
  mapDescription:
    "Plano interactivo. Selecciona un lote para ver su superficie y pedir informes por WhatsApp.",
  legend: {
    disponible: "Disponible",
    apartado: "Apartado",
    vendido: "Vendido",
  },
  lotLabel: "Lote",
  areaUnit: "m²",
  /** Screen-reader name for each lot button: "Lote L-78, 182.78 m², disponible". */
  lotAccessibleName: "Lote {lot}, {area} m², {status}",
  detail: {
    surface: "Superficie",
    cta: "Pedir informes por WhatsApp",
    close: "Cerrar",
    emptyState: "Selecciona un lote del plano para ver su superficie.",
    unavailable: "Este lote ya no está disponible.",
  },
} as const;

export const payment = {
  eyebrow: "CRÉDITO DIRECTO",
  headline: "Compra sin banco y sin buró.",
  body: "Financiamiento directo del desarrollador, con mensualidades fijas.",
  figure: "Opciones de crédito directo con enganche desde $360,000",
  cta: "Consultar condiciones por WhatsApp",
} as const;

export const subdivision = {
  eyebrow: "EL FRACCIONAMIENTO",
  headline: "No es una promesa. Ya se puede caminar.",
  points: [
    "Acceso controlado y vigilancia 24/7",
    "Más de 9,000 m² de parques, jardines, senderos y áreas sociales equipadas para toda la familia",
    "Alberca, pádel, gimnasio al aire libre y senderos",
    "Comunidad ya habitada, con mantenimiento en operación",
  ],
  cta: "Conoce el fraccionamiento →",
  ctaHref: "https://mazaltepec.com",
  // PLACEHOLDER: media slots — two 4/5 stills of the built subdivision.
  mediaLabels: [
    "FRACCIONAMIENTO A — parque y senderos",
    "FRACCIONAMIENTO B — alberca y áreas sociales",
  ],
} as const;

export const visit = {
  eyebrow: "VISÍTANOS",
  headline: "La mejor forma de decidir es caminarlo.",
  body: [
    "Estamos en la zona Country de Villahermosa, Tabasco.",
    "Agenda tu recorrido y te mostramos los lotes disponibles.",
  ],
  ctaWhatsApp: "Agendar por WhatsApp",
  formIntro: "o déjanos tus datos y te contactamos hoy mismo:",
  // PLACEHOLDER: media slot — 16/9 static map image of the location.
  mediaLabel: "VISITA — mapa de ubicación",
  directions: "Cómo llegar →",
  // PLACEHOLDER: replace with the exact Google Maps pin for the Etapa 2 sales access.
  directionsHref: "https://maps.google.com/?q=Jardines+de+Mazaltepec+Villahermosa",
  form: {
    name: "Nombre",
    phone: "Teléfono / WhatsApp",
    lot: "Lote de interés (opcional)",
    lotNone: "Sin lote específico",
    submit: "Solicitar informes",
    submitting: "Enviando…",
    note: "Al enviar aceptas nuestro aviso de privacidad. Usamos tus datos únicamente para contactarte sobre este desarrollo.",
    /** `{nombre}` is replaced with the name the visitor typed. */
    success: "Gracias, {nombre}. Te contactamos en breve al número que dejaste.",
    errors: {
      name: "Escribe tu nombre.",
      phone: "Escribe un teléfono de 10 dígitos.",
      submit: "No pudimos enviar tus datos. Intenta de nuevo o escríbenos por WhatsApp.",
    },
  },
} as const;

export const footer = {
  /** Rendered as the official lockup; kept as the logo's alt text. */
  brand: "Jardines de Mazaltepec",
  developer: "Un desarrollo de Arvore S.A. de C.V.",
  phone: "993 228 2449",
  privacy: "Aviso de privacidad",
  // PLACEHOLDER: point at the published aviso de privacidad.
  privacyHref: "https://mazaltepec.com/aviso-de-privacidad",
  disclaimer:
    "Imágenes ilustrativas. Precios y disponibilidad sujetos a cambio sin previo aviso.",
} as const;

export const sticky = {
  cta: "Hablar por WhatsApp",
} as const;

/** Pre-filled WhatsApp messages. `{lot}` and `{ref}` are filled by lib/whatsapp.ts. */
export const whatsappMessages = {
  general: "Hola, quiero informes de la Etapa 2 de Jardines de Mazaltepec.",
  lot: "Hola, me interesa el lote {lot} de la Etapa 2 de Jardines de Mazaltepec (ref {ref}). ¿Me pueden dar informes?",
  payment: "Hola, quiero conocer las opciones de crédito directo de la Etapa 2.",
  visit: "Hola, quiero agendar una visita a Jardines de Mazaltepec.",
} as const;

export const nav = {
  availabilityAnchor: "disponibilidad",
  visitAnchor: "visitanos",
} as const;
