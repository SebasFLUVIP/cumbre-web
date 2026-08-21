import type { Category, CategoryId } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "lamparas",
    name: "Lámparas",
    tagline: "La luz primero",
    description:
      "Colgantes tejidos a mano, lámparas de mesa en cerámica y apliques que resuelven la luz sin ocupar espacio. Empezamos por acá en casi todos los proyectos: cambiar la luz cambia la casa.",
    image: "/img/proyectos/lamparas-esferas-cocina-tall.webp",
  },
  {
    id: "espejos",
    name: "Espejos",
    tagline: "Duplicar la luz",
    description:
      "Marcos en fibras naturales, madera y hierro. Un espejo bien puesto amplía un espacio angosto y devuelve la luz de la ventana al centro de la habitación.",
    image: "/img/proyectos/espejo-arco-negro-tall.webp",
  },
  {
    id: "objetos",
    name: "Objetos de decoración",
    tagline: "Los detalles que cierran",
    description:
      "Cerámica torneada a mano, canastos en iraca, portavelas de pared y textiles. Las piezas pequeñas que hacen que un espacio se sienta habitado y no montado.",
    image: "/img/proyectos/jarron-ceramica-ambiente-tall.webp",
  },
  {
    id: "espaldares",
    name: "Espaldares de cama",
    tagline: "Hechos a tu medida",
    description:
      "Tapizados en lino, bouclé o tejidos en cañaflecha, en el ancho exacto de tu cama y la altura que pida el muro. Es la pieza que define una habitación.",
    image: "/img/proyectos/espaldar-lino-tall.webp",
  },
  {
    id: "mesas",
    name: "Mesas",
    tagline: "Comedor, sala y noche",
    description:
      "Comedores en teca maciza, mesas de centro en travertino y mesas de noche en roble. Muebles de estructura, pensados para durar décadas y no una temporada.",
    image: "/img/proyectos/comedor-ovalado-tall.webp",
  },
  {
    id: "sillas",
    name: "Sillas y butacas",
    tagline: "Para quedarse",
    description:
      "Sillas de comedor en cuerda y teca, butacas en bouclé y bancas tejidas a mano. Cómodas de verdad: la prueba es cuánto se queda la gente sentada.",
    image: "/img/proyectos/banqueta-junco-ambiente-tall.webp",
  },
  {
    id: "exterior",
    name: "Muebles de exterior",
    tagline: "Terraza, piscina y jardín",
    description:
      "Asoleadoras, poufs, faroles y comedores pensados para tierra caliente: telas outdoor, maderas tratadas y piedra sellada que aguantan sol, lluvia y cloro.",
    image: "/img/proyectos/asoleadora-piscina-tall.webp",
  },
  {
    id: "ventiladores",
    name: "Ventiladores",
    tagline: "Aire sin ruido",
    description:
      "Ventiladores de techo en madera y de bajo perfil, con motor DC y control remoto. Los que usamos en las casas de Anapoima y Villeta, donde el aire importa más que el aire acondicionado.",
    image: "/img/proyectos/payande-social-tall.webp",
  },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, Category>;

export function categoryName(id: CategoryId): string {
  return CATEGORY_MAP[id]?.name ?? id;
}
