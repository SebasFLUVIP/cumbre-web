import type { Metadata } from "next";
import CheckoutClient from "@/components/CheckoutClient";
import { getSettings } from "@/lib/store";
import { wompiConfig } from "@/lib/wompi";

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const s = await getSettings();
  const cfg = wompiConfig();
  return (
    <CheckoutClient
      settings={{
        freeShippingThresholdCOP: s.freeShippingThresholdCOP,
        shippingBogotaCOP: s.shippingBogotaCOP,
        shippingNacionalCOP: s.shippingNacionalCOP,
        whatsapp: s.whatsapp,
      }}
      gatewayReady={cfg.configured}
      sandbox={cfg.isTest}
    />
  );
}
