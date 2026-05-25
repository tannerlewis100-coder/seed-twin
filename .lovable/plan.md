## Context

Products on /shop are pulled live from the WooCommerce backend at `admin.clarumpeptides.com`. The frontend doesn't define products — it only maps each product name/slug to a vial image via `src/lib/vialImages.ts`. The ProductDetailModal already handles any number of variation sizes automatically (it reads them from Woo).

So "add the products the same way as before" = you create them in Woo admin, I make sure the frontend has vial-image mappings for every new size. Right now there are gaps.

## Current image coverage

Already mapped (assets exist):
- GLP-1S: 10mg, 20mg, 30mg
- GLP-2TZ: 10mg, 20mg, 40mg, 50mg, 60mg
- GLP-3RT: 10mg, 20mg, 40mg, 60mg

Missing for the sizes you listed:
- GLP-2TZ **30mg**
- GLP-3RT **30mg**, **50mg**

## Changes

**1. `src/lib/vialImages.ts`** — add explicit size matchers for the three missing sizes. Until you upload dedicated renders, point them at the closest existing vial:
- GLP-2TZ 30mg → reuse `glp2-tz-20mg.png`
- GLP-3RT 30mg → reuse `glp3-rt-20mg.png`
- GLP-3RT 50mg → reuse `glp3-rt-40mg.png`

Matchers go ABOVE the generic `/glp-?2/` and `/glp-?3/` fallbacks so they win.

**2. No other code changes needed.** The shop card, the variation pills, COA lookup, cart, and checkout all key off the Woo product/variation ID, so once you add the sizes in Woo they show up automatically with the right price, SKU, and stock state.

## What you need to do in Woo admin

For each parent product (GLP-1S, GLP-2TZ, GLP-3RT), add the new size variations under the existing variable product (don't create new parent products) so the "size" pills in the modal stay grouped. Make sure each variation has:
- size attribute (e.g. "30mg")
- price, SKU, stock
- COA file/link if you publish them per-size

## Follow-up (optional)

When you have proper vial renders for 2TZ-30, 3RT-30, 3RT-50, drop them in `src/assets/products/` as `glp2-tz-30mg.png` etc. and I'll swap the mapping in one line each.
