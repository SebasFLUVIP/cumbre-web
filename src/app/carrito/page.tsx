import type { Metadata } from "next";
import CartPageClient from "@/components/CartPageClient";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Tu carrito",
  robots: { index: false, follow: false },
};

export default async function CarritoPage() {
  const s = await getSettings();
  return <CartPageClient freeShippingThresholdCOP={s.freeShippingThresholdCOP} />;
}
