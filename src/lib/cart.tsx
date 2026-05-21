import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  addCartItem,
  fromMinor,
  getCart,
  removeCartItem,
  updateCartItem,
  type WooCart,
} from "./woo";

export type CartItem = {
  key: string;
  productId: number;
  name: string;
  size: string;
  qty: number;
  price: number;
  image?: string;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  raw: WooCart | null;
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  /** Add a Woo product to cart. For variable products, pass `variation`. */
  addItem: (input: {
    id: number;
    quantity?: number;
    variation?: Array<{ attribute: string; value: string }>;
  }) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  updateQty: (key: string, qty: number) => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<CartCtx | null>(null);

function mapCart(cart: WooCart): { items: CartItem[]; subtotal: number; count: number } {
  const items: CartItem[] = cart.items.map((it) => ({
    key: it.key,
    productId: it.id,
    name: it.name,
    size: it.variation?.map((v) => v.value).filter(Boolean).join(" / ") ?? "",
    qty: it.quantity,
    price: fromMinor(it.prices.price, it.prices.currency_minor_unit),
    image: it.images?.[0]?.src,
  }));
  const subtotal = fromMinor(cart.totals.total_price, cart.totals.currency_minor_unit);
  return { items, subtotal, count: cart.items_count };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [count, setCount] = useState(0);
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const apply = useCallback((cart: WooCart) => {
    const m = mapCart(cart);
    if (!mounted.current) return;
    setItems(m.items);
    setSubtotal(m.subtotal);
    setCount(m.count);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const cart = await getCart();
      apply(cart);
      setError(null);
    } catch (e) {
      console.error("Cart refresh failed:", e);
    }
  }, [apply]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const wrap = async <T,>(fn: () => Promise<T>): Promise<T | undefined> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Cart action failed";
      setError(msg);
      console.error(msg, e);
      return undefined;
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  const value: CartCtx = {
    items,
    count,
    subtotal,
    isOpen,
    loading,
    error,
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
    addItem: async ({ id, quantity = 1, variation }) => {
      const cart = await wrap(() => addCartItem({ id, quantity, variation }));
      if (cart) {
        apply(cart);
        setOpen(true);
      }
    },
    removeItem: async (key) => {
      const cart = await wrap(() => removeCartItem(key));
      if (cart) apply(cart);
    },
    updateQty: async (key, qty) => {
      if (qty <= 0) {
        const cart = await wrap(() => removeCartItem(key));
        if (cart) apply(cart);
        return;
      }
      const cart = await wrap(() => updateCartItem(key, qty));
      if (cart) apply(cart);
    },
    refresh,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
