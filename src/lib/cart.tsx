import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from "react";

export type CartItem = {
  slug: string;
  name: string;
  size: string;
  price: number;
  qty: number;
};

type State = { items: CartItem[] };
type Action =
  | { type: "add"; item: Omit<CartItem, "qty">; qty?: number }
  | { type: "remove"; slug: string }
  | { type: "qty"; slug: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] };

const STORAGE_KEY = "clarum.cart.v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { items: action.items };
    case "add": {
      const qty = action.qty ?? 1;
      const existing = state.items.find((i) => i.slug === action.item.slug);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.slug === action.item.slug ? { ...i, qty: i.qty + qty } : i,
          ),
        };
      }
      return { items: [...state.items, { ...action.item, qty }] };
    }
    case "remove":
      return { items: state.items.filter((i) => i.slug !== action.slug) };
    case "qty":
      return {
        items: state.items
          .map((i) => (i.slug === action.slug ? { ...i, qty: Math.max(1, action.qty) } : i))
          .filter((i) => i.qty > 0),
      };
    case "clear":
      return { items: [] };
  }
}

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (slug: string) => void;
  updateQty: (slug: string, qty: number) => void;
  clearCart: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const items = JSON.parse(raw) as CartItem[];
        if (Array.isArray(items)) dispatch({ type: "hydrate", items });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* ignore */
    }
  }, [state.items, hydrated]);

  const count = state.items.reduce((n, i) => n + i.qty, 0);
  const subtotal = state.items.reduce((s, i) => s + i.qty * i.price, 0);

  const value: CartCtx = {
    items: state.items,
    count,
    subtotal,
    isOpen,
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
    addItem: (item, qty) => {
      dispatch({ type: "add", item, qty });
      setOpen(true);
    },
    removeItem: (slug) => dispatch({ type: "remove", slug }),
    updateQty: (slug, qty) => dispatch({ type: "qty", slug, qty }),
    clearCart: () => dispatch({ type: "clear" }),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
