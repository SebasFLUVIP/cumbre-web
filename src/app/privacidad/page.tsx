import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Política de privacidad",
  alternates: { canonical: "/privacidad" },
};

export default function Page() {
  return (
    <LegalPage
      title="Política de tratamiento de datos"
      updated="agosto de 2026"
      sections={[
        {
          h: "Qué datos recogemos",
          p: [
            "Cuando llenás un formulario de contacto o hacés una compra, recogemos tu nombre, correo, teléfono, ciudad, dirección de envío y documento de identidad. Cuando pedís una cotización de proyecto, también el tipo de servicio, los espacios, el rango de inversión y los tiempos que nos indiques.",
            "No recogemos ni almacenamos datos de tarjetas de crédito. Esa información la procesa directamente Wompi.",
          ],
        },
        {
          h: "Para qué los usamos",
          p: [
            "Para responder tu consulta, elaborar cotizaciones, procesar y despachar pedidos, coordinar entregas y —si nos autorizaste— enviarte novedades de la marca. Nada más.",
            "No vendemos, alquilamos ni compartimos tus datos con terceros para fines comerciales. Los compartimos únicamente con proveedores necesarios para cumplir el pedido: pasarela de pago, transportadora y talleres de fabricación.",
          ],
        },
        {
          h: "Tus derechos",
          p: [
            "De acuerdo con la Ley 1581 de 2012, podés conocer, actualizar, rectificar y suprimir tus datos personales, así como revocar la autorización de tratamiento. Para ejercer cualquiera de estos derechos, escribinos al correo de contacto y respondemos dentro de los plazos legales.",
          ],
        },
        {
          h: "Conservación y seguridad",
          p: [
            "Conservamos tus datos mientras exista una relación comercial y por el tiempo que exijan las obligaciones legales y contables. Aplicamos medidas razonables de seguridad para protegerlos.",
          ],
        },
      ]}
    />
  );
}
