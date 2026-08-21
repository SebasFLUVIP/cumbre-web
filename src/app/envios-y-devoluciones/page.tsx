import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Envíos y devoluciones",
  description:
    "Tiempos de entrega, costos de envío y política de cambios y devoluciones de Cumbre.",
  alternates: { canonical: "/envios-y-devoluciones" },
};

export default function Page() {
  return (
    <LegalPage
      title="Envíos y devoluciones"
      updated="agosto de 2026"
      sections={[
        {
          h: "Tiempos de entrega",
          p: [
            "Cada producto muestra su tiempo de entrega en la ficha. Las piezas marcadas como entrega inmediata salen de nuestro depósito en Bogotá dentro de los dos días hábiles siguientes al pago.",
            "Las piezas importadas se entregan en 8 días hábiles. Los muebles hechos a medida tienen tiempos de fabricación de 15 a 40 días hábiles según la pieza, y el plazo exacto queda confirmado por escrito antes de empezar.",
            "Si un pedido combina piezas con tiempos distintos, coordinamos por WhatsApp si preferís recibir todo junto o en varias entregas.",
          ],
        },
        {
          h: "Costos de envío",
          p: [
            "Envío gratis en compras desde $300.000. Por debajo de ese monto, el envío en Bogotá cuesta $25.000 y al resto del país $45.000.",
            "Los muebles grandes y las piezas a medida pueden tener un costo de transporte e instalación adicional según el destino. Te lo informamos antes de confirmar el pedido, nunca después.",
          ],
        },
        {
          h: "Cambios y devoluciones",
          p: [
            "Tenés cinco días hábiles desde que recibís el pedido para pedir un cambio o devolución de productos de catálogo, siempre que estén sin uso y en su empaque original. El costo del transporte de devolución corre por cuenta del comprador, salvo que la pieza haya llegado con defecto.",
            "Las piezas hechas a medida no admiten devolución por cambio de opinión, porque se fabrican específicamente para tu espacio. Sí respondemos por defectos de fabricación.",
            "Si algo llega roto o con defecto, escribinos dentro de las 48 horas siguientes con fotos y lo reemplazamos o reparamos sin costo.",
          ],
        },
        {
          h: "Garantía",
          p: [
            "Los muebles fabricados por Cumbre tienen un año de garantía en estructura contra defectos de fabricación. No cubre desgaste por uso, humedad extrema, exposición prolongada a sol directo en piezas de interior ni daños por manipulación.",
            "Las fibras naturales y las maderas cambian de tono con el tiempo. Eso no es un defecto: es el material haciendo lo que hace.",
          ],
        },
      ]}
    />
  );
}
