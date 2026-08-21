import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  alternates: { canonical: "/terminos" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <LegalPage
      title="Términos y condiciones"
      updated="agosto de 2026"
      sections={[
        {
          h: "Quiénes somos",
          p: [
            "Cumbre Decoration & Interior Design es un estudio de diseño de interiores y comercio de objetos de decoración con operación en Colombia. Estos términos regulan la compra de productos y la contratación de servicios a través de este sitio.",
          ],
        },
        {
          h: "Precios y pagos",
          p: [
            "Todos los precios se expresan en pesos colombianos (COP) e incluyen IVA cuando aplica. Los precios pueden cambiar sin previo aviso, pero el precio que se cobra es siempre el que estaba publicado al momento de completar el pago.",
            "Los pagos se procesan a través de Wompi, que admite tarjeta de crédito y débito, PSE, Nequi y Bancolombia. Cumbre no almacena datos de tarjetas: esa información viaja directamente a la pasarela.",
          ],
        },
        {
          h: "Disponibilidad",
          p: [
            "El inventario mostrado es referencial. Si una pieza se agota entre el momento de la compra y el despacho, te avisamos dentro de las 24 horas hábiles siguientes y podés elegir entre esperar la reposición, cambiarla por otra o recibir el reembolso completo.",
          ],
        },
        {
          h: "Servicios de diseño",
          p: [
            "Los servicios de asesoría, proyecto integral, remodelación y mobiliario a medida se rigen por una propuesta escrita firmada por ambas partes, donde se detallan alcance, entregables, cronograma y forma de pago. Esta propuesta prevalece sobre lo publicado en el sitio.",
            "Las imágenes de proyectos publicadas en este sitio corresponden a trabajos realizados por Cumbre y no pueden reproducirse sin autorización.",
          ],
        },
        {
          h: "Ley aplicable",
          p: [
            "Estos términos se rigen por la legislación colombiana, en particular el Estatuto del Consumidor (Ley 1480 de 2011). Cualquier controversia se resolverá ante los jueces competentes de Bogotá D.C.",
          ],
        },
      ]}
    />
  );
}
