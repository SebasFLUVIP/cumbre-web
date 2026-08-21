export type CategoryId =
  | "lamparas"
  | "espejos"
  | "objetos"
  | "espaldares"
  | "mesas"
  | "sillas"
  | "exterior"
  | "ventiladores";

export type Category = {
  id: CategoryId;
  name: string;
  /** Bajada corta que se usa como subtitulo en la cabecera de categoria. */
  tagline: string;
  description: string;
  image?: string;
};

export type DeliveryKind = "inmediata" | "dias";

export type Delivery = {
  kind: DeliveryKind;
  /** Solo cuando kind === "dias". Dias habiles. */
  days?: number;
};

/**
 * Datos de abastecimiento. NUNCA se serializan hacia el cliente:
 * `toPublicProduct` los elimina antes de que un producto salga del servidor.
 */
export type Supplier = {
  name: string;
  url: string;
  sku?: string;
  costUSD?: number;
  costCOP?: number;
  notes?: string;
};

export type ProductVariant = {
  name: string;
  hex?: string;
  priceDeltaCOP?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  subcategory?: string;
  excerpt: string;
  description: string;
  images: string[];
  priceCOP: number;
  compareAtCOP?: number;
  delivery: Delivery;
  /** null = se produce a pedido, sin tope de inventario. */
  stock: number | null;
  madeToOrder?: boolean;
  materials?: string[];
  dimensions?: string;
  care?: string;
  variants?: ProductVariant[];
  /** Multiplicador sobre el costo con el que se calculó el precio de venta. */
  markup?: number;
  tags?: string[];
  featured?: boolean;
  active: boolean;
  supplier?: Supplier;
  createdAt: string;
};

/** Producto tal como puede viajar al navegador: sin datos de proveedor. */
export type PublicProduct = Omit<Product, "supplier">;

export type Settings = {
  usdToCop: number;
  defaultMarkup: number;
  amazonDeliveryDays: number;
  freeShippingThresholdCOP: number;
  shippingBogotaCOP: number;
  shippingNacionalCOP: number;
  whatsapp: string;
  email: string;
  instagram: string;
  /** Link de agenda (Calendly, Cal.com, etc.) para la primera consulta.
   *  Vacío = el CTA cae de vuelta a la sección de contacto del sitio. */
  calendarUrl?: string;
};

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  variant?: string;
  quantity: number;
  unitPriceCOP: number;
};

export type Order = {
  id: string;
  reference: string;
  createdAt: string;
  status: "pendiente" | "aprobado" | "rechazado" | "enviado" | "entregado";
  customer: {
    name: string;
    email: string;
    phone: string;
    docType: string;
    docNumber: string;
    address: string;
    city: string;
    department: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotalCOP: number;
  shippingCOP: number;
  totalCOP: number;
  wompiTransactionId?: string;
};

export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  service: string;
  spaces?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  source: string;
  status: "nuevo" | "contactado" | "cotizado" | "ganado" | "perdido";
};

export type Project = {
  slug: string;
  title: string;
  location: string;
  year: string;
  category: string;
  summary: string;
  scope: string[];
  body: string[];
  cover: string;
  gallery: { src: string; caption?: string; ratio?: "tall" | "wide" | "sq" }[];
  featured?: boolean;
};
