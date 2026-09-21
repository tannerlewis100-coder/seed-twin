import { fetchVariations, getVariationSize, productPrice, type WooProduct } from "@/lib/woo";
import { cheapestAvailableVariant, isVariantAvailable } from "@/lib/variantSelection";

/** The variation a card advertises: cheapest purchasable one. */
export type CardVariant = { sku: string | null; size: string | null };

/**
 * Advertised "from" price for a card. `unknown` means we have not resolved the
 * product's variations yet (still loading, or the request failed) — cards must
 * show a neutral label in that state rather than the parent price range, which
 * can start at a sold-out size.
 */
export type StartingPrice =
  | { state: "unknown" }
  | { state: "unavailable" }
  | { state: "ready"; min: number; isRange: boolean; symbol: string };

/** Cheapest purchasable variant price. Sold-out sizes never set the floor. */
export function startingPriceFromVariants(variants: WooProduct[]): StartingPrice {
  const available = variants.filter(isVariantAvailable);
  const priced = available
    .map((v) => ({ v, amount: productPrice(v).current }))
    .filter((x) => Number.isFinite(x.amount) && x.amount > 0);
  if (priced.length === 0) return { state: "unavailable" };
  const amounts = priced.map((x) => x.amount);
  const min = Math.min(...amounts);
  return {
    state: "ready",
    min,
    isRange: Math.max(...amounts) > min,
    symbol: priced[0].v.prices?.currency_symbol || "$",
  };
}

/** Simple (non-variable) products advertise their own price, if purchasable. */
export function startingPriceForSimple(product: WooProduct): StartingPrice {
  if (!isVariantAvailable(product)) return { state: "unavailable" };
  const { current, min } = productPrice(product);
  const amount = current > 0 ? current : min;
  if (!Number.isFinite(amount) || amount <= 0) return { state: "unknown" };
  return {
    state: "ready",
    min: amount,
    isRange: false,
    symbol: product.prices?.currency_symbol || "$",
  };
}

export function formatStartingPrice(price: StartingPrice): string {
  if (price.state === "unavailable") return "Unavailable";
  if (price.state === "unknown") return "Select size";
  return `${price.isRange ? "From " : ""}${price.symbol}${price.min.toFixed(2)}`;
}

/* ---------------------------------------------------------------- cache --- */

const resolved = new Map<number, StartingPrice>();
const resolvedVariant = new Map<number, CardVariant>();
const inflight = new Map<number, Promise<StartingPrice>>();

/** The advertised variation for a parent, once its variations have resolved. */
export function peekCardVariant(parentId: number): CardVariant | null {
  return resolvedVariant.get(parentId) ?? null;
}

let active = 0;
const queue: Array<() => void> = [];
const MAX_CONCURRENT = 4;

function slot(): Promise<void> {
  if (active < MAX_CONCURRENT) {
    active += 1;
    return Promise.resolve();
  }
  return new Promise<void>((res) => queue.push(res));
}

function release() {
  const next = queue.shift();
  if (next) next();
  else active -= 1;
}

/** Already-known answer, without triggering a request. */
export function peekStartingPrice(parentId: number): StartingPrice | null {
  return resolved.get(parentId) ?? null;
}

/**
 * Load a variable product's starting price once per parent. Concurrent callers
 * share a single request; failures resolve to `unknown` (never a guessed
 * price) and are not cached, so a later view can retry.
 */
export function loadStartingPrice(parentId: number): Promise<StartingPrice> {
  const hit = resolved.get(parentId);
  if (hit) return Promise.resolve(hit);
  const pending = inflight.get(parentId);
  if (pending) return pending;

  const run = (async (): Promise<StartingPrice> => {
    await slot();
    try {
      const variants = await fetchVariations(parentId);
      if (!variants || variants.length === 0) return { state: "unknown" };
      const price = startingPriceFromVariants(variants);
      const pick = cheapestAvailableVariant(variants);
      if (pick) {
        resolvedVariant.set(parentId, {
          sku: pick.sku ?? null,
          size: getVariationSize(pick) ?? null,
        });
      }
      resolved.set(parentId, price);
      return price;
    } catch {
      return { state: "unknown" };
    } finally {
      release();
      inflight.delete(parentId);
    }
  })();

  inflight.set(parentId, run);
  return run;
}

/** Test helper. */
export function __resetStartingPriceCache() {
  resolved.clear();
  resolvedVariant.clear();
  inflight.clear();
  queue.length = 0;
  active = 0;
}
