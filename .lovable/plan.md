## Plan: Replace COA verification screenshots

Once you upload the new COA screenshots, I'll:

1. For each uploaded file, copy it into `public/coa/` using the **exact filename you upload**, overwriting any existing file with that same name.
2. If an uploaded filename doesn't exactly match an existing file in `public/coa/` (e.g., spaces vs hyphens, missing parentheses, different case), I'll list the mismatches and ask before placing them, so we don't end up with orphan images the product cards can't find.
3. No changes to `src/data/coa.ts`, `src/data/peptides.ts`, the COA library route, or any layout/styling — only image file replacement.
4. Old files at other paths are kept untouched (per your choice).
5. After copying, I'll confirm which products now point to the new images and flag any uploaded file that didn't match a product.

Go ahead and upload the new screenshots whenever ready.