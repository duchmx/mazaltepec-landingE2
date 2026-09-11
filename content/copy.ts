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
  homeHref: "https://wwww.mazaltepec.com",
} as const;

/**
 * Appended, visually hidden, to every button that opens WhatsApp. The mark beside the
 * label says where the button goes; this says the same to a screen reader, so no label
 * has to spend its words naming the channel instead of the action.
 */
export const whatsappHint = "por WhatsApp";

export const hero = {
  eyebrow: "ETAPA 2",
  /**
   * One entry per line. Each renders as its own block, which is how a deliberate break is
   * expressed here — an HTML tag inside a string is escaped by React and printed literally.
   * On narrow screens the lines wrap on their own.
   */
  headline: ["Los últimos lotes residenciales", "en Jardines de Mazaltepec."],
  body: [
    "Un fraccionamiento que ya está construido, habitado y funcionando.",
    "En la zona Country de Villahermosa.",
  ],
  price: "Lotes desde $1,560,000",
  // PLACEHOLDER: the brief's hero block says "Precio de contado." while its money rules say
  // "Precio de preventa con descuento de contado." Using the hero wording, which avoids
  // naming a discount. Replace this string if the longer note is the one you want.
  priceNote: "Precio de contado.",
  ctaWhatsApp: "Contáctanos",
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
    cta: "Me interesa este lote",
    /** Shown on lots that are taken: the conversation is about what is still free. */
    ctaUnavailable: "Quiero ver los disponibles",
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
  cta: "Consulta las condiciones",
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
  ctaHref: "https://www.mazaltepec.com",
  /** Screen-reader name for the marquee, which is otherwise decorative. */
  carouselLabel: "Imágenes del fraccionamiento",
  /**
   * The marquee, in the order it scrolls. Files live in public/media/fraccionamiento/ as
   * optimised WebP — the originals are not served. Add, remove or reorder freely: the
   * marquee adapts to any count. `alt` describes what is in the frame, in Spanish.
   */
  slides: [
    { src: "/media/fraccionamiento/acceso.webp", alt: "Acceso principal del fraccionamiento, con palmera y caseta de vigilancia" },
    { src: "/media/fraccionamiento/paseo.webp", alt: "Pareja caminando por un sendero bajo un árbol en flor" },
    { src: "/media/fraccionamiento/alberca.webp", alt: "Alberca con palapa y área de descanso" },
    { src: "/media/fraccionamiento/padel.webp", alt: "Cancha de pádel" },
    { src: "/media/fraccionamiento/hamaca.webp", alt: "Hamaca bajo una pérgola con enredaderas junto a la alberca" },
    { src: "/media/fraccionamiento/arbol-en-flor.webp", alt: "Árbol con flores rosas contra el cielo" },
    { src: "/media/fraccionamiento/gimnasio.webp", alt: "Gimnasio al aire libre a la sombra de los árboles" },
    { src: "/media/fraccionamiento/pergolas.webp", alt: "Pérgolas con bancas en el parque" },
    { src: "/media/fraccionamiento/vigilancia.webp", alt: "Vigilante saludando en la caseta de acceso" },
    { src: "/media/fraccionamiento/mascota.webp", alt: "Perro descansando en el pasto del parque" },
  ],
} as const;

export const visit = {
  eyebrow: "VISÍTANOS",
  headline: "La mejor forma de decidir es caminarlo.",
  body: [
    "Estamos en la zona Country de Villahermosa, Tabasco.",
    "Agenda tu recorrido y te mostramos los lotes disponibles.",
  ],
  ctaWhatsApp: "Agenda tu visita",
  formIntro: "o déjanos tus datos y te contactamos hoy mismo:",
  /**
   * Static location sketch — deliberately not a live Google Maps embed, which is heavy on
   * a phone and needs an API key. "Cómo llegar" below it opens the real pin for directions.
   * The file is optimised from the designer's PNG and flattened onto cream-50, where its
   * label grey reads at 5.3:1; the PNG itself was drawn on black.
   */
  map: {
    src: "/media/visita/croquis.webp",
    /** Its own ratio, so the slot never crops the labels at the edges. */
    ratio: "3600/2019",
    alt: "Croquis de ubicación de Jardines de Mazaltepec, sobre el Libramiento Villahermosa, junto a Sol Campestre y cerca del Boulevard Bicentenario, Plaza Country y Plaza Cedros.",
    /** Read after the alt text, so the link says where it goes. */
    zoomLabel: "Abrir el croquis en tamaño completo",
    zoomHint: "Toca el croquis para verlo en tamaño completo.",
  },
  directions: "Cómo llegar →",
  // PLACEHOLDER: replace with the exact Google Maps pin for the Etapa 2 sales access.
  directionsHref: "https://www.google.com/maps/place/Jardines+de+Mazaltepec/@18.024908,-92.9877243,944m/data=!3m1!1e3!4m6!3m5!1s0x85ee79195e241269:0xf63e467912e524af!8m2!3d18.024908!4d-92.9877243!16s%2Fg%2F11gmvdjqcz?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D",
  form: {
    name: "Nombre",
    phone: "Teléfono / WhatsApp",
    lot: "Lote de interés (opcional)",
    lotNone: "Sin lote específico",
    submit: "Quiero informes",
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
  developer: "Un desarrollo de Arvore",
  phone: "993 228 2449",
  privacy: "Aviso de privacidad",
  /** Icon links. Labels are the accessible names — the icons themselves are decorative. */
  contact: {
    whatsapp: "Escríbenos por WhatsApp",
    phone: "Llámanos",
    facebook: "Facebook",
    instagram: "Instagram",
  },
  facebookHref: "https://www.facebook.com/jardinesdemazaltepecmx",
  instagramHref: "https://www.instagram.com/jardinesdemazaltepec",
  // PLACEHOLDER: point at the published aviso de privacidad.
  privacyHref: "https://www.mazaltepec.com",
  disclaimer:
    "Imágenes ilustrativas. Precios y disponibilidad sujetos a cambio sin previo aviso.",
} as const;

export const sticky = {
  cta: "Contáctanos",
} as const;

/** Pre-filled WhatsApp messages. `{lot}` and `{ref}` are filled by lib/whatsapp.ts. */
export const whatsappMessages = {
  general: "Hola, quiero informes de la Etapa 2 de Jardines de Mazaltepec.",
  availableLots:
    "Hola, quiero informes de los lotes disponibles de la Etapa 2 de Jardines de Mazaltepec.",
  lot: "Hola, me interesa el lote {lot} de la Etapa 2 de Jardines de Mazaltepec (ref {ref}). ¿Me pueden dar informes?",
  payment: "Hola, quiero conocer las opciones de crédito directo de la Etapa 2.",
  visit: "Hola, quiero agendar una visita a Jardines de Mazaltepec.",
} as const;

export const nav = {
  availabilityAnchor: "disponibilidad",
  visitAnchor: "visitanos",
} as const;
