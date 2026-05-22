// Same-origin client for the Woo Store API proxy.
// Cart-Token is persisted in localStorage and threaded on every request.

const BASE = "/api/public/woo-store";
const CHECKOUT_BASE = "https://admin.clarumpeptides.com/checkout";
const TOKEN_KEY = "clarum.woo.cart-token";
const ORDER_EMAIL_KEY_PREFIX = "clarum.woo.order-email.";

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

function orderEmailKey(orderId: number | string) {
  return `${ORDER_EMAIL_KEY_PREFIX}${orderId}`;
}

export function setOrderBillingEmail(orderId: number | string, email: string) {
  if (typeof window === "undefined") return;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return;
  try {
    window.sessionStorage.setItem(orderEmailKey(orderId), normalized);
  } catch {
    /* ignore */
  }
}

export function getOrderBillingEmail(orderId: number | string): string {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(orderEmailKey(orderId))?.trim() ?? "";
  } catch {
    return "";
  }
}

// In-memory nonce captured from any Woo Store API response. Refreshes
// re-bootstrap via the initial GET /cart fired by CartProvider on mount.
let currentNonce: string | null = null;

async function wooFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const needsCartSession = path.startsWith("/cart") || path.startsWith("/checkout");
  const token = getCartToken();
  const method = (init.method ?? "GET").toUpperCase();
  const isMutation = method === "POST" || method === "PUT" || method === "DELETE";

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init.body ? { "Content-Type": "application/json" } : {}),
    ...((init.headers as Record<string, string> | undefined) ?? {}),
  };
  if (needsCartSession && token) headers["Cart-Token"] = token;
  if (isMutation && currentNonce) headers["Nonce"] = currentNonce;

  const res = await fetch(`${BASE}?path=${encodeURIComponent(path)}`, {
    ...init,
    credentials: "include",
    headers,
  });
  const nextToken = res.headers.get("Cart-Token");
  if (nextToken) setCartToken(nextToken);
  const nextNonce = res.headers.get("Nonce");
  if (nextNonce) currentNonce = nextNonce;
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
    total_shipping?: string;
    total_tax?: string;
    currency_minor_unit: number;
    currency_code: string;
    currency_symbol: string;
  };
  payment_methods?: string[];
  payment_requirements?: string[];
  needs_shipping?: boolean;
  shipping_rates?: Array<{
    shipping_rates: Array<{
      rate_id: string;
      name: string;
      price: string;
      currency_minor_unit: number;
      selected: boolean;
    }>;
  }>;
};

export type WooAddress = {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
};

export type WooCheckoutInput = {
  billing_address: WooAddress;
  shipping_address: WooAddress;
  payment_method: string;
  payment_data?: Array<{ key: string; value: string }>;
  customer_note?: string;
};

export type WooCheckoutResponse = {
  order_id: number;
  status: string;
  order_key: string;
  customer_note?: string;
  customer_id?: number;
  billing_address?: WooAddress;
  shipping_address?: WooAddress;
  payment_method?: string;
  redirect_url?: string;
  payment_url?: string;
  payment_result: {
    payment_status: "success" | "failure" | "pending" | "error" | string;
    payment_details?: Array<{ key: string; value: string }>;
    redirect_url?: string;
    payment_url?: string;
    message?: string;
  };
};

// ─── Products ─────────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<WooProduct[]> {
  const all: WooProduct[] = [];
  for (let page = 1; page <= 20; page++) {
    const res = await wooFetch(`/products?per_page=100&page=${page}`);
    if (!res.ok) {
      if (page === 1) throw new Error(`Failed to load products (${res.status})`);
      break;
    }
    const batch = (await res.json()) as WooProduct[];
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
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

export type ClarumVariation = {
  id: number;
  size?: string;
  price?: string;
  attributes?: Array<{ name?: string; value?: string }>;
};

export type ClarumProduct = {
  id: number;
  variations?: ClarumVariation[];
};

/** Fetch the Clarum custom product payload (includes a real `size` per variation). */
export async function fetchClarumProduct(id: number): Promise<ClarumProduct | null> {
  const res = await wooFetch(`/clarum/v1/products/${id}`);
  if (!res.ok) return null;
  try {
    return (await res.json()) as ClarumProduct;
  } catch {
    return null;
  }
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

// ─── Checkout ─────────────────────────────────────────────────────────────

export async function updateCustomer(input: {
  billing_address?: Partial<WooAddress>;
  shipping_address?: Partial<WooAddress>;
}): Promise<WooCart> {
  const res = await wooFetch("/cart/update-customer", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to update customer (${res.status})`);
  }
  return res.json();
}

export async function selectShippingRate(input: {
  package_id: number;
  rate_id: string;
}): Promise<WooCart> {
  const res = await wooFetch("/cart/select-shipping-rate", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to select shipping rate (${res.status})`);
  }
  return res.json();
}

export async function submitCheckout(input: WooCheckoutInput): Promise<WooCheckoutResponse> {
  const res = await wooFetch("/checkout", {
    method: "POST",
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data && (data.message || (data.data && data.data.message))) ||
      `Checkout failed (${res.status})`;
    throw new Error(msg);
  }
  return data as WooCheckoutResponse;
}

export type WooOrderItem = {
  id: number;
  name: string;
  quantity: number;
  short_description?: string;
  images?: WooImage[];
  totals: {
    line_subtotal: string;
    line_total: string;
    currency_minor_unit: number;
    currency_code: string;
    currency_symbol?: string;
  };
};

export type WooOrder = {
  id: number;
  number?: string;
  status: string;
  order_key: string;
  customer_id?: number;
  billing_address?: WooAddress;
  shipping_address?: WooAddress;
  items: WooOrderItem[];
  totals: {
    total_price: string;
    total_items: string;
    total_shipping?: string;
    total_tax?: string;
    currency_minor_unit: number;
    currency_code: string;
    currency_symbol: string;
  };
  needs_payment?: boolean;
};

export async function fetchOrder(
  orderId: number | string,
  key: string,
  billingEmail?: string,
): Promise<WooOrder> {
  const params = new URLSearchParams({ key });
  const email = billingEmail?.trim() || getOrderBillingEmail(orderId);
  if (email) params.set("billing_email", email);

  const res = await wooFetch(`/order/${orderId}?${params.toString()}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data && (data.message || (data.data && data.data.message))) || `Order not found (${res.status})`;
    throw new Error(msg);
  }
  return data as WooOrder;
}

/** Friendly label for known gateway IDs; otherwise humanize the slug. */
export function gatewayLabel(id: string): string {
  const map: Record<string, string> = {
    depay_wc_payments: "Pay with Crypto (DePay)",
    stripe: "Credit / Debit Card",
    stripe_cc: "Credit / Debit Card",
    paypal: "PayPal",
    cod: "Cash on Delivery",
    cheque: "Check Payment",
    bacs: "Direct Bank Transfer",
  };
  if (map[id]) return map[id];
  return id
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}


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

function normalizeCheckoutRedirect(value: string | undefined): string | null {
  const candidate = value?.trim();
  if (!candidate) return null;
  if (candidate.startsWith("#")) return null;
  if (/^javascript:/i.test(candidate)) return null;
  return candidate;
}

export function resolveCheckoutRedirect(input: WooCheckoutResponse): string | null {
  const details = input.payment_result?.payment_details ?? [];
  const detailMatch = details.find((entry) => {
    const key = entry.key.toLowerCase();
    return key.includes("redirect") || key.includes("payment") || key.includes("url");
  })?.value;

  return (
    normalizeCheckoutRedirect(input.payment_result?.redirect_url) ||
    normalizeCheckoutRedirect(input.payment_result?.payment_url) ||
    normalizeCheckoutRedirect(input.redirect_url) ||
    normalizeCheckoutRedirect(input.payment_url) ||
    normalizeCheckoutRedirect(detailMatch) ||
    null
  );
}

/** Decode common HTML entities (handles double-encoding like &amp;amp;). */
export function decodeEntities(input: string | undefined): string {
  if (!input) return "";
  let out = input;
  // Run twice to catch double-encoded entities (&amp;amp; -> &amp; -> &).
  for (let i = 0; i < 2; i++) {
    out = out
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#0?39;/gi, "'")
      .replace(/&apos;/gi, "'")
      .replace(/&nbsp;/gi, " ")
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
  }
  return out;
}

/** Strip HTML for short blurbs. */
export function stripHtml(html: string | undefined): string {
  if (!html) return "";
  return decodeEntities(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}
