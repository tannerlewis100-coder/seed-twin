// Direct browser → WooCommerce Store API client.
// Cart-Token is persisted in localStorage and threaded on every request.
// credentials: 'include' so Woo session cookies flow to the checkout redirect.

const BASE = "https://admin.clarumpeptides.com/wp-json/wc/store/v1";
const CHECKOUT_BASE = "https://admin.clarumpeptides.com/checkout";
const TOKEN_KEY = "clarum.woo.cart-token";

export function getCartToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setCartToken(token: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearCartToken() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

async function wooFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const isCart = path.startsWith("/cart");
  const token = getCartToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init.body ? { "Content-Type": "application/json" } : {}),
    ...((init.headers as Record<string, string> | undefined) ?? {}),
  };
  // Only thread Cart-Token on cart endpoints — adding it on product reads
  // triggers a CORS preflight that WP currently rejects, blanking the catalog.
  if (isCart && token) headers["Cart-Token"] = token;

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: isCart ? "include" : "omit",
    headers,
  });
  const next = res.headers.get("Cart-Token");
  if (next) setCartToken(next);
  return res;
}

// ─── Types (subset of Store API) ──────────────────────────────────────────

export type WooImage = { id: number; src: string; thumbnail?: string; alt?: string };
export type WooCategory = { id: number; name: string; slug: string };

export type WooPriceObj = {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_minor_unit: number;
  currency_code: string;
  currency_symbol: string;
  price_range?: { min_amount: string; max_amount: string } | null;
};

export type WooVariationRef = {
  id: number;
  attributes: Array<{ name: string; value: string }>;
};

export type WooAttribute = { id?: number; name: string; value?: string; option?: string };

export type WooProduct = {
  id: number;
  slug: string;
  name: string;
  type: string; // "simple" | "variable" | "variation" | ...
  parent: number;
  permalink: string;
  sku: string;
  description: string;
  short_description: string;
  prices: WooPriceObj;
  images: WooImage[];
  categories: WooCategory[];
  variations: WooVariationRef[];
  /** Present on variation-type products; describes the selected attribute values. */
  attributes?: WooAttribute[];
  is_in_stock: boolean;
  is_purchasable: boolean;
};

export type WooCartItem = {
  key: string;
  id: number;
  quantity: number;
  name: string;
  short_description: string;
  variation: Array<{ attribute: string; value: string }>;
  images: WooImage[];
  prices: { price: string; currency_minor_unit: number; currency_code: string };
  totals: { line_subtotal: string; line_total: string; currency_minor_unit: number; currency_code: string };
};

export type WooCart = {
  items: WooCartItem[];
  items_count: number;
  totals: {
    total_price: string;
    total_items: string;
    currency_minor_unit: number;
    currency_code: string;
    currency_symbol: string;
  };
};

// ─── Products ─────────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<WooProduct[]> {
  const res = await wooFetch("/products?per_page=100");
  if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
  return res.json();
}

export async function fetchProduct(id: number): Promise<WooProduct> {
  const res = await wooFetch(`/products/${id}`);
  if (!res.ok) throw new Error(`Failed to load product ${id} (${res.status})`);
  return res.json();
}

/** Fetch full variation product objects for a variable product. */
export async function fetchVariations(parentId: number): Promise<WooProduct[]> {
  const res = await wooFetch(`/products?per_page=100&type=variation&parent=${parentId}`);
  if (!res.ok) return [];
  return res.json();
}

// ─── Cart ─────────────────────────────────────────────────────────────────

export async function getCart(): Promise<WooCart> {
  const res = await wooFetch("/cart");
  if (!res.ok) throw new Error(`Failed to load cart (${res.status})`);
  return res.json();
}

export async function addCartItem(input: {
  id: number;
  quantity: number;
  variation?: Array<{ attribute: string; value: string }>;
}): Promise<WooCart> {
  const res = await wooFetch("/cart/add-item", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to add item (${res.status})`);
  }
  return res.json();
}

export async function updateCartItem(key: string, quantity: number): Promise<WooCart> {
  const res = await wooFetch("/cart/update-item", {
    method: "POST",
    body: JSON.stringify({ key, quantity }),
  });
  if (!res.ok) throw new Error(`Failed to update item (${res.status})`);
  return res.json();
}

export async function removeCartItem(key: string): Promise<WooCart> {
  const res = await wooFetch("/cart/remove-item", {
    method: "POST",
    body: JSON.stringify({ key }),
  });
  if (!res.ok) throw new Error(`Failed to remove item (${res.status})`);
  return res.json();
}

// ─── Utilities ────────────────────────────────────────────────────────────

/** Woo prices are integer strings in the minor unit (e.g. "5900" with minor_unit=2 → $59.00). */
export function fromMinor(amount: string | number | undefined, minorUnit: number): number {
  if (amount == null) return 0;
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return 0;
  return n / Math.pow(10, minorUnit);
}

export function productPrice(p: WooProduct): { min: number; max: number; current: number } {
  const unit = p.prices.currency_minor_unit;
  const current = fromMinor(p.prices.price, unit);
  const range = p.prices.price_range;
  if (range) {
    return {
      min: fromMinor(range.min_amount, unit),
      max: fromMinor(range.max_amount, unit),
      current,
    };
  }
  return { min: current, max: current, current };
}

export function firstImage(p: { images?: WooImage[] }): string | undefined {
  return p.images?.[0]?.src;
}

export function checkoutUrl(): string {
  const token = getCartToken();
  return token ? `${CHECKOUT_BASE}?cart_token=${encodeURIComponent(token)}` : CHECKOUT_BASE;
}

/** Strip HTML for short blurbs. */
export function stripHtml(html: string | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}
