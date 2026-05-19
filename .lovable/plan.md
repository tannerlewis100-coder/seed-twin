## Problem

The GLP-1 S product image (and any future real product photos) renders soft on your DPR=1 desktop display even though the source asset is 1254×1254. Cause: the `<img>` element carries `drop-shadow-2xl` plus `transition-transform duration-700 group-hover/card:scale-105`. Together these promote the image to a GPU compositor layer that gets rasterized at the box size (224px on the card, 320px in the modal) and then redrawn — losing the higher native resolution.

The global CSS override added earlier strips these properties, but `!important` overriding Tailwind utilities on the same element is brittle and doesn't always win in production builds. Better to remove the classes at the source.

## Changes

### 1. `src/routes/shop.tsx` — product card image

- Wrap the `<img>` in a `<span>` (or `<div>`) that carries the shadow and the hover scale.
- The `<img>` keeps only sizing classes (`h-56 w-auto object-contain`) and adds explicit `width={1254} height={1254}` attributes so the browser knows the intrinsic resolution.

```text
<span className="block drop-shadow-2xl transition-transform duration-700 group-hover/card:scale-105">
  <img src={glp1sImage} width={1254} height={1254}
       className="h-56 w-auto object-contain" alt="GLP-1 S vial" />
</span>
```

### 2. `src/components/ProductDetailModal.tsx` — modal image

Same pattern, with `h-80` instead of `h-56`.

### 3. `src/styles.css` — simplify the global override

With the source fix in place, the `!important` overrides are no longer load-bearing. Keep a smaller version that just guarantees `image-rendering: high-quality` on every `<img>` and prevents accidental future regressions:

```text
img { image-rendering: high-quality; }
img:not([data-allow-transform]) { transform: none; will-change: auto; }
```

Drop the broad `:has(> img)` rule — it was a sledgehammer that also killed the footer logo's intended glow.

## Why this works

Filters and transforms on a wrapper element create the GPU layer one level up. The `<img>` itself remains a plain raster element rendered by the browser at full source fidelity, then the wrapper layer composites the shadow and hover scale on top. Result: the vial label stays crisp at any DPR, the hover lift still feels premium, and the drop shadow still reads.

## Files touched

- `src/routes/shop.tsx`
- `src/components/ProductDetailModal.tsx`
- `src/styles.css`

## Out of scope

- Footer GooeyText morph (you said leave as-is).
- CSS-mocked vial cards for non-GLP-1-S products — no real `<img>` involved, nothing to fix.
- Adding `srcset` / responsive image variants — current single 1254px asset is already comfortable for both display sizes through 3x DPR.
