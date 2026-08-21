"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";

/** Vacía el carrito solo cuando el pago quedó aprobado. */
export default function ClearCartOnSuccess() {
  const { clear, ready, lines } = useCart();
  useEffect(() => {
    if (ready && lines.length > 0) clear();
  }, [ready, lines.length, clear]);
  return null;
}
