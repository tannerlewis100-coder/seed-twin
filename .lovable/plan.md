## Fix all 4 Quality images

**Root cause recap:** SS-37 and Trio source PNGs are landscape (3072×2048) being force-cropped into 3:4 portrait tiles, which zooms ~2× into the center and softens them. All four PNGs are also 5–7 MB each with a fake `srcSet` (1× and 2× point at the same file), so there's no real high-DPI variant.

### Steps

1. **Re-crop SS-37 and Trio to portrait** using `imagegen--edit_image` with `aspect_ratio: "3:4"`, framing the vials centered. Save to `/tmp/` first for QA, then move to `public/` once they look right.
2. **Generate optimized WebP variants** for all four images using ImageMagick (via `nix run nixpkgs#imagemagick`):
   - `quality-{name}.webp` — 1600 px on long edge, quality 82 (1× asset, ~150–250 KB each)
   - `quality-{name}@2x.webp` — 3200 px on long edge, quality 80 (2× asset, ~500–800 KB each)
   - Keep the original PNGs out of `public/` (delete) so we're not shipping ~22 MB of unused PNGs.
3. **Update `src/routes/index.tsx`** (lines 29–32 and the four `<img>` tags at 273–333):
   - Change path constants to `.webp`.
   - Wire real `srcSet`: `` `${img} 1x, ${img2x} 2x` ``.
   - Keep `sizes`, `aspect-[3/4]`, `object-cover`, eager loading.
4. **QA**: screenshot the preview at the current 1433 px viewport, crop into the 4 tiles with `image_tools--zoom_image`, confirm each one is sharp and the framing makes sense (vials centered, labels readable). Re-run the crop step on any tile that still looks soft.

### Technical notes

- Total payload drops from ~22 MB PNG → ~3 MB WebP across 8 files (1× + 2×).
- WebP at q80–82 is visually lossless for product photos on a dark background.
- No changes to layout, copy, or component structure — only assets + `srcSet` strings.
- Files touched: `public/quality-*.webp` (new), `public/quality-*.png` (delete), `src/routes/index.tsx` (asset paths + srcSet).
