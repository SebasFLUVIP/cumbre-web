/**
 * Genera data/catalog.json, data/settings.json y los archivos vacios de
 * pedidos y leads. Se corre una sola vez: a partir de ahi el admin es el
 * dueno del catalogo. Volver a correrlo sobrescribe el catalogo.
 */
import { writeFileSync, existsSync, mkdirSync } from "node:fs";

const SETTINGS = {
  usdToCop: 4200,
  defaultMarkup: 3,
  amazonDeliveryDays: 8,
  freeShippingThresholdCOP: 800000,
  shippingBogotaCOP: 25000,
  shippingNacionalCOP: 45000,
  whatsapp: "573000000000",
  email: "hola@cumbredeco.com",
  instagram: "cumbre.decohome",
};

const now = "2026-08-20T00:00:00.000Z";
let n = 0;
const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Redondea a la decena de mil mas cercana, como se cotiza en Colombia. */
const round = (v) => Math.round(v / 10000) * 10000;
const fromUSD = (usd, markup = SETTINGS.defaultMarkup) =>
  round(usd * SETTINGS.usdToCop * markup);

function p(o) {
  n += 1;
  const slug = o.slug || slugify(o.name);
  return {
    id: `p${String(n).padStart(3, "0")}`,
    slug,
    images: [],
    stock: null,
    active: true,
    createdAt: now,
    ...o,
    delivery: o.delivery ?? { kind: "dias", days: 15 },
  };
}

const fromCOP = (cop, markup) => Math.round((cop * markup) / 1000) * 1000;

const ecofibras = (url, costCOP, note) => ({
  name: "Ecofibras Curití",
  url,
  costCOP,
  notes: note ?? "Artesanía en fique, Curití (Santander). Confirmar stock antes de vender.",
});

const amazon = (url, costUSD, note) => ({
  name: "Amazon",
  url,
  sku: (url.match(/\/dp\/([A-Z0-9]{10})/) || [])[1],
  costUSD,
  notes: note ?? "Costo estimado: confirmar en Amazon antes de despachar.",
});

const IMG = (base, variants = ["-tall", "-wide"]) =>
  variants.map((v) => `/img/proyectos/${base}${v}.webp`);
const STUDIO = (base) => [`/img/productos/${base}.webp`];

const products = [
  // ─────────────────────────── Lamparas ───────────────────────────
  p({
    name: "Lámpara Colgante Fique con Borlas",
    category: "lamparas",
    excerpt: "Tejida a mano en fique, con borlas y cuentas de madera.",
    description:
      "Una pieza tejida a mano por artesanas colombianas en fique natural. La pantalla cónica difunde la luz en un tono cálido y el remate de borlas con cuentas de madera le da el movimiento que buscábamos. Cada lámpara es única: el tono de la fibra cambia con la cosecha.",
    images: STUDIO("lampara-fique-borlas"),
    priceCOP: 890000,
    materials: ["Fique natural", "Cuentas de madera", "Estructura en hierro"],
    dimensions: "Ø 70 cm × 55 cm de alto",
    care: "Limpiar con brocha suave o aspiradora en potencia baja. No usar agua.",
    delivery: { kind: "dias", days: 15 },
    madeToOrder: true,
    featured: true,
    tags: ["hecho a mano", "artesanal", "fique"],
  }),
  p({
    name: "Lámpara Colgante Travertino y Madera",
    category: "lamparas",
    excerpt: "Wabi sabi en piedra natural: cada veta es distinta.",
    description:
      "Travertino amarillo pulido sobre base de madera. La piedra deja pasar la luz apenas lo suficiente para que la lámpara brille sin encandilar. Perfecta sobre una isla de cocina o en serie sobre un comedor largo.",
    priceCOP: fromUSD(69.99),
    materials: ["Travertino natural", "Madera"],
    dimensions: "Ø 17 cm · Socket E26",
    delivery: { kind: "dias", days: SETTINGS.amazonDeliveryDays },
    markup: 3,
    supplier: amazon("https://www.amazon.com/dp/B0F7XC7CXS", 69.99),
    featured: true,
    tags: ["wabi sabi", "piedra natural"],
  }),
  p({
    name: "Lámpara Colgante Iraca Grande",
    images: ["/img/productos/lampara-yute-dos.webp", "/img/proyectos/lamparas-esferas-cocina-tall.webp"],
    category: "lamparas",
    excerpt: "Volumen generoso en palma de iraca trenzada.",
    description:
      "Trenzada en palma de iraca por tejedoras de Nariño. Es una pieza de escala grande, pensada para dobles alturas y comedores donde la lámpara tiene que sostener el espacio por sí sola.",
    priceCOP: 1250000,
    materials: ["Palma de iraca", "Estructura en hierro"],
    dimensions: "Ø 90 cm × 80 cm de alto",
    delivery: { kind: "dias", days: 20 },
    madeToOrder: true,
    tags: ["hecho a mano", "artesanal"],
  }),
  p({
    name: "Lámpara de Mesa Cerámica Arena",
    category: "lamparas",
    excerpt: "Base en cerámica mate con pantalla en lino crudo.",
    description:
      "Torneada a mano y esmaltada en un mate arena que absorbe la luz en vez de reflejarla. La pantalla en lino crudo suaviza todo. Va bien en una mesa de noche o en una consola de entrada.",
    priceCOP: 620000,
    materials: ["Cerámica esmaltada", "Lino crudo"],
    dimensions: "Ø 35 cm × 55 cm de alto",
    delivery: { kind: "dias", days: 12 },
    tags: ["cerámica"],
  }),
  p({
    name: "Lámpara de Piso Trípode Roble",
    category: "lamparas",
    excerpt: "Estructura en roble macizo y pantalla en algodón.",
    description:
      "Tres patas en roble macizo con acabado en aceite natural. Es la lámpara que resuelve la esquina de una sala sin pedir permiso: alta, liviana visualmente y con una luz que baja suave.",
    priceCOP: 980000,
    materials: ["Roble macizo", "Algodón"],
    dimensions: "Ø 50 cm × 155 cm de alto",
    delivery: { kind: "dias", days: 15 },
    tags: ["madera"],
  }),
  p({
    name: "Lámpara Colgante con Flecos",
    category: "lamparas",
    excerpt: "Pantalla plana en fibra con cortina de flecos de algodón.",
    description:
      "Pantalla plana tejida en fibra natural rematada con una cortina de flecos en algodón crudo. Encendida proyecta una luz filtrada y calma, con sombras largas en el muro. Va bien sobre un lavamanos, una mesa auxiliar o en serie sobre una barra.",
    images: ["/img/productos/lampara-flecos-marfil.webp", "/img/proyectos/lamparas-flecos-bano-tall.webp"],
    priceCOP: 760000,
    materials: ["Fibra natural", "Flecos de algodón"],
    dimensions: "Ø 55 cm × 60 cm de alto con flecos",
    care: "Peinar los flecos con la mano. Aspirar en potencia baja.",
    delivery: { kind: "dias", days: 18 },
    madeToOrder: true,
    featured: true,
    tags: ["hecho a mano", "artesanal"],
  }),
  p({
    name: "Aplique de Pared en Lino",
    category: "lamparas",
    excerpt: "Luz indirecta y cálida para pasillos y cabeceras.",
    description:
      "Un aplique discreto que resuelve la luz de lectura junto a la cama y deja libre la mesa de noche. Pantalla en lino sobre brazo en latón envejecido.",
    priceCOP: 380000,
    materials: ["Lino", "Latón envejecido"],
    dimensions: "22 × 18 × 25 cm",
    delivery: { kind: "dias", days: 12 },
  }),

  // ─────────────────────────── Espejos ───────────────────────────
  p({
    name: "Espejo Redondo Rattan Natural",
    category: "espejos",
    excerpt: "Marco tejido en rattan, el clásico que nunca falla.",
    description:
      "El espejo que ponemos en casi todos los proyectos. El marco tejido en rattan natural le da textura a una pared vacía y calienta cualquier baño de cemento o microcemento.",
    priceCOP: 540000,
    materials: ["Rattan natural", "Espejo 4 mm"],
    dimensions: "Ø 80 cm",
    delivery: { kind: "dias", days: 10 },
    featured: true,
    variants: [
      { name: "Ø 60 cm", priceDeltaCOP: -120000 },
      { name: "Ø 80 cm" },
      { name: "Ø 100 cm", priceDeltaCOP: 180000 },
    ],
    tags: ["rattan"],
  }),
  p({
    name: "Espejo Orgánico Marco Madera",
    category: "espejos",
    excerpt: "Silueta irregular en madera de nogal.",
    description:
      "Forma orgánica, sin dos curvas iguales. Lo hacemos en nogal o en roble según el resto del espacio. Funciona especialmente bien sobre un lavamanos de piedra.",
    priceCOP: 890000,
    materials: ["Nogal macizo", "Espejo 4 mm"],
    dimensions: "70 × 95 cm aprox.",
    delivery: { kind: "dias", days: 20 },
    madeToOrder: true,
  }),
  p({
    name: "Espejo Arco Hierro Negro",
    images: ["/img/proyectos/espejo-arco-negro-tall.webp"],
    category: "espejos",
    excerpt: "Marco delgado en hierro con remate en arco.",
    description:
      "Un arco de piso a media pared, con marco de hierro de perfil muy delgado. Es la pieza que estira visualmente un vestier o una entrada angosta.",
    priceCOP: 1180000,
    materials: ["Hierro con pintura electrostática", "Espejo 5 mm"],
    dimensions: "80 × 180 cm",
    delivery: { kind: "dias", days: 20 },
    madeToOrder: true,
  }),
  p({
    name: "Espejo Redondo Hierro Negro",
    category: "espejos",
    excerpt: "Marco delgado en hierro negro, el más discreto de la serie.",
    description:
      "Un círculo perfecto con marco de hierro de perfil muy delgado, en negro mate. Es el espejo que ponemos cuando la pared ya tiene suficiente: no compite con nada y ordena una consola o un lavamanos.",
    images: ["/img/proyectos/espejo-redondo-negro-tall.webp"],
    priceCOP: 620000,
    materials: ["Hierro con pintura electrostática", "Espejo 4 mm"],
    dimensions: "Ø 90 cm",
    delivery: { kind: "dias", days: 15 },
    variants: [
      { name: "Ø 70 cm", priceDeltaCOP: -140000 },
      { name: "Ø 90 cm" },
      { name: "Ø 110 cm", priceDeltaCOP: 190000 },
    ],
  }),
  p({
    name: "Espejo Sol en Fibra Natural",
    images: ["/img/proyectos/espejo-sol-terraza-tall.webp", "/img/proyectos/espejo-sol-habitacion-tall.webp"],
    category: "espejos",
    excerpt: "Rayos en fibra trenzada alrededor de un espejo pequeño.",
    description:
      "Más objeto decorativo que espejo funcional. Lo usamos en grupos de tres sobre una cama o solo, sobre una chimenea.",
    priceCOP: 420000,
    materials: ["Fibra natural trenzada", "Espejo 3 mm"],
    dimensions: "Ø 65 cm",
    delivery: { kind: "dias", days: 10 },
    tags: ["artesanal"],
  }),

  // ───────────────────── Objetos de decoracion ─────────────────────
  p({
    name: "Aplique Portavelas Geométrico",
    category: "objetos",
    subcategory: "Portavelas",
    excerpt: "Rectángulos en hierro negro con siete portavelas en vidrio.",
    description:
      "Una escultura de pared que además da luz. Los rectángulos en hierro se cruzan a distintas profundidades y cada uno sostiene un portavela en vidrio mercurizado. Encendido, proyecta sombras sobre la pared.",
    images: STUDIO("aplique-geometrico"),
    priceCOP: 680000,
    materials: ["Hierro con pintura negra mate", "Vidrio mercurizado"],
    dimensions: "120 × 55 cm",
    delivery: { kind: "inmediata" },
    stock: 4,
    featured: true,
  }),
  p({
    name: "Aplique Portavelas Rejilla",
    category: "objetos",
    subcategory: "Portavelas",
    excerpt: "Trama ortogonal en hierro con siete puntos de luz.",
    description:
      "La versión más gráfica de la familia: una rejilla de varillas finas donde los portavelas se posan en los cruces. Pide una pared limpia y suficiente distancia para leerla completa.",
    images: STUDIO("aplique-rejilla"),
    priceCOP: 590000,
    materials: ["Hierro con pintura negra mate", "Vidrio"],
    dimensions: "100 × 60 cm",
    delivery: { kind: "inmediata" },
    stock: 3,
  }),
  p({
    name: "Aplique Mural Portavelas XL",
    category: "objetos",
    subcategory: "Portavelas",
    excerpt: "Composición de gran formato con doce portavelas.",
    description:
      "La pieza grande de la serie: casi dos metros de rectángulos superpuestos con doce portavelas en tubo de vidrio. La instalamos sobre barras, comedores y chimeneas.",
    images: STUDIO("aplique-mural-xl"),
    priceCOP: 1450000,
    materials: ["Hierro con pintura negra mate", "Tubos de vidrio"],
    dimensions: "180 × 110 cm",
    delivery: { kind: "dias", days: 12 },
    featured: true,
  }),
  p({
    name: "Aplique Portavelas de Pared, Set de 2",
    category: "objetos",
    subcategory: "Portavelas",
    excerpt: "Par de apliques en metal para vela, se cuelgan enfrentados.",
    description:
      "Un set de dos apliques en metal para vela, pensados para colgarse enfrentados a lado y lado de un espejo, una cabecera o la entrada. Son la versión más discreta de la familia de portavelas: ocupan poco muro y la luz de la vela hace el resto.",
    priceCOP: fromUSD(32.99),
    materials: ["Metal con acabado negro mate"],
    dimensions: "Set de 2 unidades",
    care: "Limpiar con paño seco. Usar veleros de vidrio para proteger el acabado.",
    delivery: { kind: "dias", days: SETTINGS.amazonDeliveryDays },
    markup: 3,
    supplier: amazon("https://www.amazon.com/dp/B07PFPSNF3", 32.99),
    tags: ["portavelas", "pared"],
  }),
  p({
    name: "Perchero de Piso en Roble",
    category: "objetos",
    subcategory: "Percheros",
    excerpt: "Cuatro patas en roble y canasto tejido en la base.",
    description:
      "Resuelve la entrada de un apartamento sin obra: cuelga abrigos arriba y esconde los zapatos o las bolsas en el canasto de abajo. En roble con acabado en aceite.",
    images: STUDIO("perchero-roble"),
    priceCOP: 720000,
    materials: ["Roble macizo", "Canasto en fibra natural"],
    dimensions: "45 × 45 × 175 cm",
    delivery: { kind: "dias", days: 15 },
  }),
  p({
    name: "Perchero de Piso en Rattan",
    category: "objetos",
    subcategory: "Percheros",
    excerpt: "Versión curva en rattan natural con canasto integrado.",
    description:
      "La misma idea que el de roble, en clave más suave. Las varas de rattan se abren arriba en cuatro brazos curvos y abrazan un canasto tejido en la base.",
    images: STUDIO("perchero-rattan"),
    priceCOP: 650000,
    materials: ["Rattan natural"],
    dimensions: "Ø 45 × 170 cm",
    delivery: { kind: "dias", days: 15 },
    tags: ["rattan"],
  }),
  p({
    name: "Tapiz Macramé Boho",
    category: "objetos",
    subcategory: "Textiles",
    excerpt: "Tejido geométrico con borlas esféricas, 40 × 99 cm.",
    description:
      "Un tapiz de macramé en algodón crudo con remate en borlas esféricas. Sirve para calentar una pared alta y angosta, de esas que quedan al lado de una escalera y nunca se sabe qué ponerles.",
    priceCOP: fromUSD(32.99),
    materials: ["Algodón", "Vara de madera"],
    dimensions: "40 cm de ancho × 99 cm de largo",
    delivery: { kind: "dias", days: SETTINGS.amazonDeliveryDays },
    markup: 3,
    supplier: amazon("https://www.amazon.com/dp/B0DSVRP5JT", 32.99),
    tags: ["textil"],
  }),
  p({
    name: "Jarrones de Pared en Madera, Set de 2",
    category: "objetos",
    subcategory: "Floreros",
    excerpt: "Par de jarrones colgantes en madera con calado tipo rattan.",
    description:
      "Dos jarrones para colgar, en madera con acabado café y calado tipo rattan. Sirven para ramas secas o flores pequeñas y resuelven esas paredes angostas donde no cabe nada: un pasillo, el costado de una entrada, el muro entre dos puertas.",
    priceCOP: fromUSD(29.99),
    materials: ["Madera", "Rattan"],
    dimensions: "Set de 2 unidades",
    care: "Usar tubo de vidrio interior si van con agua.",
    delivery: { kind: "dias", days: SETTINGS.amazonDeliveryDays },
    markup: 3,
    supplier: amazon("https://www.amazon.com/dp/B0GWR1S52F", 29.99),
    tags: ["boho", "pared"],
  }),
  p({
    name: "Jarrón Cerámica Arcilla",
    images: ["/img/proyectos/jarron-ceramica-ambiente-tall.webp"],
    category: "objetos",
    subcategory: "Cerámica",
    excerpt: "Torneado a mano, esmalte mate color barro.",
    description:
      "De boca angosta y cuerpo ancho, para ramas secas o una sola flor. El esmalte mate deja ver el torneado. Se ve mejor en grupo, con dos alturas distintas.",
    priceCOP: 240000,
    materials: ["Cerámica esmaltada"],
    dimensions: "Ø 22 × 35 cm",
    delivery: { kind: "inmediata" },
    stock: 8,
    variants: [{ name: "Barro" }, { name: "Hueso" }, { name: "Verde oliva" }],
    tags: ["cerámica", "hecho a mano"],
  }),
  p({
    name: "Set de Bowls en Barro",
    category: "objetos",
    subcategory: "Cerámica",
    excerpt: "Tres tamaños, mismo esmalte, para mesa o repisa.",
    description:
      "Los usamos tanto para servir como para vestir una mesa de centro. Tres piezas que se apilan y que se ven bien vacías, que es la prueba real de un buen objeto.",
    priceCOP: 195000,
    materials: ["Barro esmaltado"],
    dimensions: "Ø 12, 16 y 20 cm",
    delivery: { kind: "inmediata" },
    stock: 12,
    tags: ["cerámica"],
  }),
  p({
    name: "Bandeja Redonda en Teca",
    category: "objetos",
    excerpt: "Teca maciza con borde tallado, Ø 45 cm.",
    description:
      "Una bandeja pesada, de las que se quedan puestas en la mesa de centro con los libros y el control encima. Teca maciza con aceite natural.",
    priceCOP: 310000,
    materials: ["Teca maciza"],
    dimensions: "Ø 45 × 5 cm",
    delivery: { kind: "inmediata" },
    stock: 6,
  }),
  p({
    name: "Ganchos de Pared en Madera",
    category: "objetos",
    subcategory: "Percheros",
    excerpt: "Set de tres, torneados a mano en madera maciza.",
    description:
      "Tres ganchos torneados a mano en madera maciza, cada uno con una silueta distinta. Se instalan en línea o en alturas alternadas. Los usamos en entradas, baños y cuartos de niños: resuelven sin ocupar piso.",
    images: ["/img/productos/ganchos-madera.webp"],
    priceCOP: 210000,
    materials: ["Madera maciza", "Aceite natural"],
    dimensions: "Set de 3 · entre 8 y 12 cm",
    delivery: { kind: "inmediata" },
    stock: 9,
    tags: ["madera", "hecho a mano"],
  }),
  p({
    name: "Toallero de Pared en Madera",
    category: "objetos",
    subcategory: "Baño",
    excerpt: "Módulo vertical para toallas enrolladas, en dos tamaños.",
    description:
      "Un módulo vertical en madera para guardar las toallas enrolladas a la vista. Ordena el baño sin mueble y se ve mejor lleno que vacío. Va solo o de a dos, en alturas distintas.",
    images: ["/img/productos/toallero-madera.webp"],
    priceCOP: 390000,
    materials: ["Madera maciza"],
    dimensions: "Pequeño 20 × 18 × 80 cm · Grande 30 × 22 × 100 cm",
    delivery: { kind: "dias", days: 15 },
    variants: [
      { name: "Pequeño" },
      { name: "Grande", priceDeltaCOP: 160000 },
    ],
    tags: ["madera", "baño"],
  }),
  p({
    name: "Cuadro Texturado con Marco en Madera",
    category: "objetos",
    subcategory: "Arte",
    excerpt: "Relieve en pasta blanca sobre lienzo, marco en madera clara.",
    description:
      "Un relieve trabajado en pasta blanca sobre lienzo, con marco en madera clara. Todo el interés está en la textura y en cómo le pega la luz a lo largo del día. Funciona solo sobre un sofá o de a dos en una pared larga.",
    images: ["/img/productos/cuadro-textura.webp"],
    priceCOP: 680000,
    materials: ["Lienzo con relieve", "Marco en madera"],
    dimensions: "80 × 100 cm",
    delivery: { kind: "dias", days: 20 },
    madeToOrder: true,
    variants: [
      { name: "80 × 100 cm" },
      { name: "100 × 130 cm", priceDeltaCOP: 320000 },
    ],
    tags: ["arte", "hecho a mano"],
  }),
  p({
    name: "Barril con Cabestro en Fique",
    category: "objetos",
    subcategory: "Contenedores",
    excerpt: "Tejido a mano en fique por artesanas de Curití, Santander.",
    description:
      "Un barril organizador tejido 100% a mano en fique con técnica de punto de aguja, por artesanas santandereanas de Curití. Lo usamos para revistas junto al sofá, para juguetes en un cuarto de niños o simplemente vacío, como pieza. El fique cambia de tono con la luz y con los años: eso es parte de la gracia.",
    priceCOP: fromCOP(53000, 2),
    materials: ["Fique natural"],
    dimensions: "30 × 30 cm · 800 g",
    care: "Limpiar en seco con brocha suave. Evitar humedad prolongada.",
    delivery: { kind: "dias", days: 4 },
    markup: 2,
    supplier: ecofibras(
      "https://www.ecofibrascuriti.com/producto/barril-con-cabestro/",
      53000
    ),
    tags: ["hecho a mano", "artesanal", "fique", "Colombia"],
  }),
  p({
    name: "Canasto Iraca Grande",
    category: "objetos",
    excerpt: "Tejido a mano, para cobijas o leña.",
    description:
      "Tejido en palma de iraca con asas laterales. Lo ponemos al lado del sofá con las cobijas o junto a la chimenea. Aguanta peso de verdad.",
    priceCOP: 280000,
    materials: ["Palma de iraca"],
    dimensions: "Ø 50 × 45 cm",
    delivery: { kind: "inmediata" },
    stock: 5,
    tags: ["hecho a mano", "artesanal"],
  }),

  // ───────────────────── Espaldares de cama ─────────────────────
  p({
    name: "Espaldar Lino Arena",
    images: ["/img/proyectos/espaldar-lino-tall.webp"],
    category: "espaldares",
    excerpt: "Tapizado en lino con pespunte vertical. A medida.",
    description:
      "Nuestro espaldar más pedido. Lino de peso alto en tono arena, con pespunte vertical que le da estructura sin volverlo rígido. Lo hacemos en el ancho exacto de tu cama y con la altura que necesite el muro.",
    priceCOP: 1890000,
    materials: ["Lino", "Espuma alta densidad", "Estructura en madera"],
    dimensions: "Cama doble 150 cm · alto 120 cm (a medida)",
    care: "Aspirar con boquilla de tapicería. Manchas: paño húmedo, sin frotar.",
    delivery: { kind: "dias", days: 25 },
    madeToOrder: true,
    featured: true,
    variants: [
      { name: "Doble 150 cm" },
      { name: "Queen 165 cm", priceDeltaCOP: 260000 },
      { name: "King 200 cm", priceDeltaCOP: 620000 },
    ],
    tags: ["a medida"],
  }),
  p({
    name: "Espaldar Bouclé Marfil",
    category: "espaldares",
    excerpt: "Bouclé de textura gruesa, silueta redondeada. A medida.",
    description:
      "Silueta de esquinas redondeadas en bouclé marfil. La textura hace todo el trabajo: en una habitación de paredes lisas es el único elemento que hace falta.",
    priceCOP: 2150000,
    materials: ["Bouclé", "Espuma alta densidad", "Estructura en madera"],
    dimensions: "A medida según cama",
    delivery: { kind: "dias", days: 25 },
    madeToOrder: true,
    variants: [
      { name: "Doble 150 cm" },
      { name: "Queen 165 cm", priceDeltaCOP: 280000 },
      { name: "King 200 cm", priceDeltaCOP: 680000 },
    ],
    tags: ["a medida"],
  }),
  p({
    name: "Espaldar Cañaflecha",
    category: "espaldares",
    excerpt: "Panel tejido en cañaflecha sobre marco de madera.",
    description:
      "Tejido en cañaflecha por artesanos del Bajo Sinú, montado sobre un marco de madera. Es el espaldar que ponemos en las casas de tierra caliente: fresco, liviano y con oficio.",
    priceCOP: 1650000,
    materials: ["Cañaflecha", "Madera"],
    dimensions: "A medida según cama",
    delivery: { kind: "dias", days: 30 },
    madeToOrder: true,
    tags: ["a medida", "artesanal"],
  }),
  p({
    name: "Espaldar Listones de Madera",
    category: "espaldares",
    excerpt: "Listones verticales en roble, de piso a techo.",
    description:
      "No es un espaldar sino un muro: listones verticales en roble que suben hasta el techo y convierten la cabecera en arquitectura. Se instala anclado al muro.",
    priceCOP: 2450000,
    materials: ["Roble", "Herrajes ocultos"],
    dimensions: "A medida según muro",
    delivery: { kind: "dias", days: 30 },
    madeToOrder: true,
    tags: ["a medida", "madera"],
  }),

  // ─────────────────────────── Mesas ───────────────────────────
  p({
    name: "Mesa de Comedor Teca Maciza",
    category: "mesas",
    subcategory: "Comedor",
    excerpt: "Tablón macizo de teca, base de patas gruesas.",
    description:
      "Un tablón de teca maciza con base de patas gruesas y ensamble a la vista. Es la mesa de las casas de campo: aguanta sol, humedad y almuerzos de doce personas.",
    priceCOP: 6800000,
    materials: ["Teca maciza", "Aceite natural"],
    dimensions: "300 × 110 × 76 cm",
    delivery: { kind: "dias", days: 35 },
    madeToOrder: true,
    featured: true,
    variants: [
      { name: "240 cm", priceDeltaCOP: -1200000 },
      { name: "300 cm" },
      { name: "360 cm", priceDeltaCOP: 1400000 },
    ],
    tags: ["a medida", "madera"],
  }),
  p({
    name: "Mesa de Comedor Redonda Roble",
    images: ["/img/proyectos/comedor-ovalado-tall.webp"],
    category: "mesas",
    subcategory: "Comedor",
    excerpt: "Tapa redonda sobre base central cónica.",
    description:
      "Redonda, sobre una base central cónica que deja las piernas libres. Para ocho puestos sin jerarquías: en las terrazas es la que mejor funciona.",
    priceCOP: 5200000,
    materials: ["Roble macizo"],
    dimensions: "Ø 180 × 76 cm",
    delivery: { kind: "dias", days: 35 },
    madeToOrder: true,
    variants: [
      { name: "Ø 150 cm", priceDeltaCOP: -900000 },
      { name: "Ø 180 cm" },
    ],
    tags: ["a medida", "madera"],
  }),
  p({
    name: "Mesa de Centro Travertino",
    category: "mesas",
    subcategory: "Sala",
    excerpt: "Bloque de travertino con canto pulido.",
    description:
      "Un bloque de travertino de canto pulido, macizo y bajo. Ancla la sala y no compite con nada. Pesa lo que tiene que pesar.",
    priceCOP: 4200000,
    materials: ["Travertino natural"],
    dimensions: "120 × 70 × 32 cm",
    delivery: { kind: "dias", days: 30 },
    featured: true,
    tags: ["piedra natural"],
  }),
  p({
    name: "Mesa de Centro Madera Recuperada",
    images: ["/img/proyectos/mesa-madera-maciza-tall.webp"],
    category: "mesas",
    subcategory: "Sala",
    excerpt: "Tablones recuperados con historia a la vista.",
    description:
      "Hecha con tablones recuperados: nudos, vetas y marcas quedan a la vista porque son la gracia. Cada mesa sale distinta.",
    priceCOP: 2380000,
    materials: ["Madera recuperada", "Cera natural"],
    dimensions: "130 × 70 × 35 cm",
    delivery: { kind: "dias", days: 25 },
    madeToOrder: true,
    tags: ["madera"],
  }),
  p({
    name: "Mesa de Noche Roble Dos Cajones",
    images: ["/img/proyectos/mesa-noche-roble-tall.webp", "/img/proyectos/mesa-noche-ambiente-tall.webp"],
    category: "mesas",
    subcategory: "Noche",
    excerpt: "Dos cajones con tirador tallado en la misma madera.",
    description:
      "Dos cajones de cierre suave y un tirador tallado en la misma madera, sin herraje metálico. Alta lo justo para quedar al nivel del colchón.",
    priceCOP: 1480000,
    materials: ["Roble macizo", "Correderas de cierre suave"],
    dimensions: "55 × 40 × 55 cm",
    delivery: { kind: "dias", days: 25 },
    madeToOrder: true,
    variants: [{ name: "Roble natural" }, { name: "Nogal" }],
    tags: ["madera"],
  }),
  p({
    name: "Mesa Auxiliar Cerámica",
    category: "mesas",
    subcategory: "Sala",
    excerpt: "Cuerpo cilíndrico en cerámica esmaltada.",
    description:
      "Un cilindro de cerámica esmaltada que sirve de mesa auxiliar o de asiento extra en la terraza. Liviana de mover, imposible de manchar.",
    priceCOP: 780000,
    materials: ["Cerámica esmaltada"],
    dimensions: "Ø 40 × 45 cm",
    delivery: { kind: "dias", days: 15 },
    variants: [{ name: "Hueso" }, { name: "Verde oliva" }, { name: "Terracota" }],
    tags: ["cerámica"],
  }),
  p({
    name: "Consola en Madera Maciza",
    category: "mesas",
    subcategory: "Sala",
    excerpt: "Tablón macizo sobre patas gruesas, con repisa inferior.",
    description:
      "Un tablón macizo sobre patas gruesas, con una repisa abajo para canastos. Es el mueble que resuelve una entrada: llaves y correo arriba, zapatos escondidos abajo. La veta queda a la vista porque es la gracia.",
    images: ["/img/proyectos/consola-madera-tall.webp"],
    priceCOP: 2950000,
    materials: ["Madera maciza", "Aceite natural"],
    dimensions: "180 × 45 × 85 cm",
    delivery: { kind: "dias", days: 30 },
    madeToOrder: true,
    tags: ["a medida", "madera"],
  }),
  p({
    name: "Consola en Cañabrava",
    category: "mesas",
    subcategory: "Sala",
    excerpt: "Frente tejido en cañabrava sobre estructura de madera.",
    description:
      "Angosta, para pasillos y entradas. El frente tejido en cañabrava deja respirar el mueble y esconde lo que se guarda adentro.",
    priceCOP: 2650000,
    materials: ["Cañabrava", "Madera"],
    dimensions: "140 × 40 × 80 cm",
    delivery: { kind: "dias", days: 30 },
    madeToOrder: true,
    tags: ["a medida", "artesanal"],
  }),

  // ─────────────────────────── Sillas ───────────────────────────
  p({
    name: "Silla Comedor Cuerda y Teca",
    category: "sillas",
    excerpt: "Espaldar tejido en cuerda náutica sobre teca.",
    description:
      "Estructura en teca y espaldar tejido en cuerda náutica. Es la silla que usamos en las terrazas de Anapoima: resiste sol y lluvia sin perder la forma.",
    priceCOP: 890000,
    materials: ["Teca", "Cuerda náutica", "Cojín en tela outdoor"],
    dimensions: "58 × 60 × 80 cm",
    delivery: { kind: "dias", days: 25 },
    featured: true,
    variants: [{ name: "Cuerda natural" }, { name: "Cuerda carbón" }],
    tags: ["exterior", "madera"],
  }),
  p({
    name: "Silla Tapizada en Lino",
    images: ["/img/proyectos/comedor-sillas-tapizadas-tall.webp"],
    category: "sillas",
    excerpt: "Espaldar alto tapizado, patas en madera.",
    description:
      "Espaldar alto y asiento profundo, tapizada en lino. Pensada para comedores donde la gente se queda sentada hablando después del postre.",
    priceCOP: 950000,
    materials: ["Lino", "Madera maciza"],
    dimensions: "50 × 55 × 95 cm",
    delivery: { kind: "dias", days: 25 },
    madeToOrder: true,
    variants: [{ name: "Arena" }, { name: "Hueso" }, { name: "Verde oliva" }],
  }),
  p({
    name: "Butaca Bouclé",
    category: "sillas",
    excerpt: "Silueta curva, sin brazos, en bouclé marfil.",
    description:
      "Curva, baja y sin brazos. La ponemos de a dos frente al sofá o sola en una habitación, al lado de una lámpara de piso.",
    priceCOP: 2450000,
    materials: ["Bouclé", "Estructura en madera"],
    dimensions: "78 × 80 × 72 cm",
    delivery: { kind: "dias", days: 30 },
    madeToOrder: true,
    featured: true,
  }),
  p({
    name: "Banca en Cañaflecha",
    category: "sillas",
    excerpt: "Asiento tejido a mano sobre patas en madera.",
    description:
      "Asiento tejido en cañaflecha sobre patas de madera. Va al pie de la cama o en la entrada, para sentarse a ponerse los zapatos.",
    priceCOP: 1150000,
    materials: ["Cañaflecha", "Madera"],
    dimensions: "120 × 40 × 45 cm",
    delivery: { kind: "dias", days: 30 },
    madeToOrder: true,
    tags: ["artesanal"],
  }),
  p({
    name: "Banqueta en Madera y Junco",
    category: "sillas",
    excerpt: "Espaldar curvo en madera maciza y asiento tejido en junco.",
    description:
      "La banqueta que ponemos en casi todas las islas de cocina que diseñamos. Espaldar curvo en madera maciza y asiento tejido a mano en junco de papel. Es liviana, cómoda de verdad para conversar largo y no tapa la vista de la cocina.",
    images: ["/img/productos/banqueta-junco.webp", "/img/proyectos/banqueta-junco-ambiente-tall.webp"],
    priceCOP: 740000,
    materials: ["Madera maciza", "Junco de papel"],
    dimensions: "55 × 50 × 105 cm · altura de asiento 65 cm",
    care: "Limpiar el tejido con brocha seca. No mojar el junco.",
    delivery: { kind: "dias", days: 20 },
    featured: true,
    variants: [
      { name: "Altura barra 65 cm" },
      { name: "Altura mesón 75 cm", priceDeltaCOP: 60000 },
    ],
    tags: ["madera", "junco"],
  }),

  // ────────────────── Muebles de exterior ──────────────────
  p({
    name: "Parasol con Flecos UPF50+",
    category: "exterior",
    subcategory: "Sombra",
    excerpt: "2,10 m de diámetro, poste en acero e inclinación con botón.",
    description:
      "Parasol de 7 pies con fleco perimetral y protección UPF50+. Poste y varillas en acero, sistema de inclinación con botón para seguir el sol durante la tarde. En rayas beige.",
    priceCOP: fromUSD(89.99),
    materials: ["Acero", "Tela UPF50+"],
    dimensions: "Ø 210 cm",
    care: "Guardar seco. No dejar abierto con viento fuerte.",
    delivery: { kind: "dias", days: SETTINGS.amazonDeliveryDays },
    markup: 3,
    supplier: amazon("https://www.amazon.com/dp/B0FS5WTTQF", 89.99),
    featured: true,
    tags: ["exterior"],
  }),
  p({
    name: "Asoleadora Modular Exterior",
    category: "exterior",
    subcategory: "Asoleadoras",
    excerpt: "Cojín de piso profundo con respaldo y cojines sueltos.",
    description:
      "Nuestra asoleadora es un cojín de piso profundo con respaldo, en tela outdoor color arena. Se usa sola o de a dos, y con los cojines sueltos se vuelve un sofá bajo junto a la piscina.",
    images: [...IMG("asoleadoras-exterior", ["-tall", "-wide"]), "/img/proyectos/asoleadora-piscina-wide.webp"],
    priceCOP: 3200000,
    materials: ["Tela outdoor hidrorepelente", "Espuma de secado rápido"],
    dimensions: "200 × 90 × 45 cm",
    care: "Funda lavable. Retirar en temporada larga de lluvia.",
    delivery: { kind: "dias", days: 30 },
    madeToOrder: true,
    featured: true,
    variants: [{ name: "Arena" }, { name: "Hueso" }, { name: "Verde oliva" }],
    tags: ["exterior", "a medida"],
  }),
  p({
    name: "Pouf Exterior a Rayas",
    category: "exterior",
    subcategory: "Poufs",
    excerpt: "Tejido en tela outdoor, asiento o mesa auxiliar.",
    description:
      "Un pouf cuadrado en tela outdoor a rayas. Sirve de asiento extra, de reposapiés o de mesa auxiliar con una bandeja encima. Aguanta lluvia y sol.",
    images: IMG("poufs-exterior", ["-sq", "-wide"]),
    priceCOP: 620000,
    materials: ["Tela outdoor", "Relleno de secado rápido"],
    dimensions: "60 × 60 × 38 cm",
    delivery: { kind: "dias", days: 20 },
    variants: [
      { name: "Rayas carbón" },
      { name: "Rayas oliva" },
      { name: "Rayas arena" },
    ],
    tags: ["exterior"],
  }),
  p({
    name: "Farol Rattan Exterior",
    category: "exterior",
    subcategory: "Iluminación",
    excerpt: "Tejido en rattan con tapa en madera y asa de cuero.",
    description:
      "Farol tejido en rattan con tapa en madera y asa en cuero. Con una vela adentro resuelve la luz de una terraza mejor que cualquier lámpara. Se ven mejor de a dos, en alturas distintas.",
    images: IMG("faroles-piscina", ["-tall", "-wide"]),
    priceCOP: 480000,
    materials: ["Rattan", "Madera", "Cuero"],
    dimensions: "Ø 35 × 55 cm",
    delivery: { kind: "inmediata" },
    stock: 6,
    featured: true,
    variants: [
      { name: "Mediano Ø 30 cm", priceDeltaCOP: -120000 },
      { name: "Grande Ø 35 cm" },
    ],
    tags: ["exterior", "rattan"],
  }),
  p({
    name: "Silla Colgante Circular",
    category: "exterior",
    subcategory: "Asientos",
    excerpt: "Aro tejido en fibra sintética para colgar, con cojín.",
    description:
      "Un aro tejido en fibra sintética para exterior, que se cuelga de una estructura o de una viga. Aguanta sol y lluvia sin decolorarse. Es la pieza que se roba el jardín: nadie pasa al lado sin sentarse.",
    images: ["/img/proyectos/silla-colgante-tall.webp"],
    priceCOP: 2680000,
    materials: ["Fibra sintética para exterior", "Estructura en acero", "Cojín outdoor"],
    dimensions: "Ø 150 × 60 cm de profundidad",
    care: "Enjuagar con agua dulce. Guardar el cojín en temporada de lluvia.",
    delivery: { kind: "dias", days: 30 },
    madeToOrder: true,
    featured: true,
    tags: ["exterior"],
  }),
  p({
    name: "Sofá Modular Exterior Teca",
    category: "exterior",
    subcategory: "Sofás",
    excerpt: "Módulos en teca con cojines en tela outdoor.",
    description:
      "Sistema modular en teca: se arma en L, en U o en línea según la terraza. Cojines en tela outdoor de secado rápido y fundas removibles.",
    priceCOP: 8900000,
    materials: ["Teca maciza", "Tela outdoor"],
    dimensions: "Módulo de 90 cm · configuración a medida",
    delivery: { kind: "dias", days: 40 },
    madeToOrder: true,
    tags: ["exterior", "a medida"],
  }),
  p({
    name: "Mesa Exterior en Travertino",
    category: "exterior",
    subcategory: "Mesas",
    excerpt: "Tapa en travertino sobre base en acero inoxidable.",
    description:
      "Tapa en travertino sellado sobre base en acero inoxidable con acabado mate. Para comedores de terraza que se quedan afuera todo el año.",
    priceCOP: 7400000,
    materials: ["Travertino sellado", "Acero inoxidable"],
    dimensions: "220 × 100 × 76 cm",
    delivery: { kind: "dias", days: 40 },
    madeToOrder: true,
    tags: ["exterior", "piedra natural"],
  }),

  // ───────────────────────── Ventiladores ─────────────────────────
  p({
    name: "Ventilador de Techo Madera 42\"",
    category: "ventiladores",
    excerpt: "Tres aspas en madera nogal, control remoto, sin luz.",
    description:
      "Ventilador de 42 pulgadas con tres aspas en madera tono nogal y control remoto. Sin luz integrada, que es lo que uno quiere cuando la iluminación ya está resuelta. Apto para interior y exterior cubierto.",
    priceCOP: fromUSD(109.99),
    materials: ["Madera", "Motor DC"],
    dimensions: "Ø 107 cm (42\")",
    delivery: { kind: "dias", days: SETTINGS.amazonDeliveryDays },
    markup: 3,
    supplier: amazon("https://www.amazon.com/dp/B0DF55VCPY", 109.99),
    featured: true,
    tags: ["exterior cubierto"],
  }),
  p({
    name: "Ventilador de Techo con Luz 52\"",
    category: "ventiladores",
    excerpt: "Bajo perfil, motor DC reversible, LED en tres temperaturas.",
    description:
      "Ventilador de 52 pulgadas de bajo perfil, ideal para techos bajos. Motor DC reversible de seis velocidades y luz LED en tres temperaturas de color, todo desde el control remoto.",
    priceCOP: fromUSD(129.99),
    materials: ["Metal", "Motor DC reversible", "LED"],
    dimensions: "Ø 132 cm (52\")",
    delivery: { kind: "dias", days: SETTINGS.amazonDeliveryDays },
    markup: 3,
    supplier: amazon("https://www.amazon.com/dp/B0CLRNBVS4", 129.99),
    tags: ["bajo perfil"],
  }),
];

if (!existsSync("data")) mkdirSync("data");
writeFileSync("data/catalog.json", JSON.stringify(products, null, 2) + "\n");
writeFileSync("data/settings.json", JSON.stringify(SETTINGS, null, 2) + "\n");
for (const f of ["orders", "leads"]) {
  if (!existsSync(`data/${f}.json`)) writeFileSync(`data/${f}.json`, "[]\n");
}
console.log(`catalogo: ${products.length} productos`);
console.log(
  "con proveedor:",
  products.filter((x) => x.supplier).length,
  "| con foto:",
  products.filter((x) => x.images.length).length
);
