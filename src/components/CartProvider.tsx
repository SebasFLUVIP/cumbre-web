"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  image?: string;
  variant?: string;
  unitPriceCOP: number;
  quantity: number;
  deliveryLabel: string;
};

type CartState = {
  lines: CartLine[];
  count: number;
  subtotalCOP: number;
  ready: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartState | null>(null);

const STORAGE_KEY = "cumbre.cart.v1";

/** Una linea se identifica por producto + variante: el mismo producto en dos
 *  acabados distintos son dos lineas separadas. */
export const lineKey = (l: Pick<CartLine, "productId" | "variant">) =>
  `${l.productId}::${l.variant ?? ""}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  // El carrito vive en localStorage, que no existe durante el render en el
  // servidor. Leerlo tiene que pasar después de montar, o el HTML hidratado no
  // coincidiría con el del servidor.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* carrito corrupto: arrancamos vacio en vez de romper la pagina */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const add = useCallback<CartState["add"]>((line, quantity = 1) => {
    setLines((prev) => {
      const key = lineKey(line);
      const found = prev.find((l) => lineKey(l) === key);
      if (found) {
        return prev.map((l) =>
          lineKey(l) === key ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [...prev, { ...line, quantity }];
    });
    setOpen(true);
  }, []);

  const setQuantity = useCallback<CartState["setQuantity"]>((key, quantity) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => lineKey(l) !== key)
        : prev.map((l) => (lineKey(l) === key ? { ...l, quantity } : l))
    );
  }, []);

  const remove = useCallback<CartState["remove"]>((key) => {
    setLines((prev) => prev.filter((l) => lineKey(l) !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotalCOP = lines.reduce(
      (n, l) => n + l.unitPriceCOP * l.quantity,
      0
    );
    return {
      lines,
      count,
      subtotalCOP,
      ready,
      open,
      setOpen,
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [lines, ready, open, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
