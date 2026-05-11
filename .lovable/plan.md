## Goal

Replace "View COA" in the product modal with "Add to Cart". Build a cart that holds line items locally, shows a header cart icon + drawer, and checks out through the WooCommerce Store API. Use a placeholder Woo URL for now so it can be swapped later.

## Architecture

```text
Browser  →  Cart Context (localStorage)
  add → modal Add-to-Cart button
  view → header cart icon + slide-over drawer
  checkout → POST /api/cart/checkout (server fn proxy)
                ↓
         WooCommerce Store API (cart + checkout)
                ↓
       Returns checkout URL → window.location
```

We proxy Woo through a TanStack server function to avoid CORS and keep the Woo URL/key out of the browser.

## Step 1 — Cart state

New `src/lib/cart.tsx`:
- `CartProvider` with `useReducer`, persists to `localStorage` under `clarum.cart.v1`.
- Item shape: `{ slug, name, size, price, qty }`.
- API: `addItem`, `removeItem`, `updateQty`, `clearCart`, `items`, `subtotal`, `count`.
- Mounted once in `src/routes/__root.tsx` so every page sees it.

## Step 2 — Modal CTA swap

In `src/components/ProductDetailModal.tsx`:
- Replace the "View COA" anchor with an "Add to Cart" button that calls `addItem(activeVariant)` and shows a brief "Added ✓" state for 1.5s.
- Remove COA link entirely (per the answered question).
- Keep the "Coming soon" disabled state for variants in `COMING_SOON_SLUGS`.

## Step 3 — Header cart icon + drawer

- Add a cart button to `src/components/SiteHeader.tsx` (right side, next to existing nav). Shows `count` badge when > 0.
- New `src/components/CartDrawer.tsx` using shadcn `Sheet`:
  - Lists items with name, size, qty stepper, line price, remove.
  - Subtotal row.
  - "Checkout" primary button → calls `startCheckout()`.
  - Disclaimer line: "For in vitro laboratory research only."

## Step 4 — Woo proxy server function

New `src/lib/woo.functions.ts`:
- `startCheckout` server fn (POST). Validates input with Zod: array of `{ sku, quantity }`.
- Reads `WOO_STORE_URL` from `process.env`. If missing, returns a graceful `{ error: "Store not configured yet." }` so the UI stays usable on the placeholder.
- Calls Woo Store API: `POST {WOO_STORE_URL}/wp-json/wc/store/v1/cart/add-item` per SKU (uses Cart-Token header to keep one server-side cart per request) and finally returns `{ checkoutUrl: "{WOO_STORE_URL}/checkout/" }`.
- The browser then `window.location.assign(checkoutUrl)`.
- Note: with the placeholder URL the server fn returns an error and the drawer shows "Store not configured yet — paste your WooCommerce URL in Lovable secrets to enable checkout."

## Step 5 — Slug → Woo SKU mapping

For now Woo SKU = peptide `slug` (e.g. `bpc-157-10mg`). When the user wires their real store, they only need to set product SKUs in Woo to match. No data file changes required.

## Step 6 — Secret

Request one secret: `WOO_STORE_URL` (e.g. `https://shop.clarum.com`). Used only by the server function. Kept blank for now and the cart still works locally; checkout shows the configuration hint until it's set.

## Files

- new `src/lib/cart.tsx` — context + reducer + localStorage
- new `src/lib/woo.functions.ts` — `startCheckout` server fn (Zod validated)
- new `src/components/CartDrawer.tsx` — Sheet UI
- edit `src/routes/__root.tsx` — wrap with `CartProvider`, render `CartDrawer`
- edit `src/components/SiteHeader.tsx` — cart icon + count badge, opens drawer
- edit `src/components/ProductDetailModal.tsx` — Add to Cart button, remove COA link

## Out of scope

- No real payments (Woo handles that on its own checkout page).
- No product sync from Woo. The shop catalog stays driven by `src/data/peptides.ts`.
- No inventory or stock checks.
