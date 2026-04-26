## Goal

Keep the **current Seed-style layout** you already built (sticky header + announcement bar, hero w/ side card, product grid, Via-cap science section, "More than human" lifestyle band, Labs section, footer) — but **replace every word, color, font choice, and product image with Clarum's content**: research peptides, 5-panel lab testing, COA transparency. New palette: **black + gold + white** (per your answer, replacing both Sprout's cream/green and Clarum's navy/gold).

Source of truth for copy: the **Clarum Website Build** project in your workspace (already inspected — Index, About, FAQ, Shop, COA Library, Contact, Disclaimer, Terms, Privacy).

---

## 1. Design system swap (`src/styles.css`)

Replace the Sprout palette with a Clarum-flavored **black / gold / white** system, keeping the same token names so the existing layout JSX needs minimal rewrites:

- `--background`: near-black `oklch(0.14 0 0)`
- `--foreground`: white `oklch(0.98 0 0)`
- `--brand-forest` → repurpose as `--brand-black` (deep black for surfaces / buttons)
- `--brand-forest-deep` → `--brand-black-deep` (true black hover)
- `--brand-cream` → `--brand-white` (white surfaces for "light" sections like the science block)
- `--brand-lime` → `--brand-gold` `oklch(0.82 0.14 85)` (announcement bar, accents, badges)
- New `--brand-gold-light` for gradient text effect
- `--card`, `--muted`, `--border`: dark-surface variants with subtle gold-tinted borders (`hsl(40 50% 56% / 0.1)`)
- Typography: keep **Fraunces** (display) + **Inter** (body) — already loaded and matches Clarum's serif/sans pairing well
- Add the gold texture utilities used by Clarum: `.gold-line-texture` (faint diagonal lines) and `.gold-grid-texture` (subtle grid) as background patterns for hero / section backgrounds

All existing Tailwind class names (`bg-brand-forest`, `text-brand-cream`, `bg-brand-lime`, etc.) keep working — they just resolve to the new black/gold/white values, so I won't have to rewrite every className.

## 2. Homepage rebrand (`src/routes/index.tsx`)

Section-by-section content swap, layout untouched:

| Current Sprout section | Becomes (Clarum) |
|---|---|
| Announcement bar: "Is SP-01® Daily Synbiotic right for you?" | "Every batch tested. Every COA published. → View the COA Library" |
| Header logo "sprout •" | "CLARUM" wordmark in Fraunces, gold dot |
| Header nav: Shop / Science / Learn | **Shop / COA Library / Science / About / FAQ** (TanStack `<Link to="...">`) |
| Header CTA "Get Started" | "Shop the Catalog" → `/shop` |
| Hero headline + capsule image | "Nothing Hidden. *Everything Tested.*" + 4 chip stats (61 Compounds / 5 Tests Per Batch / 100% COA Documented / ≥99% HPLC Purity). **Right side: replace the capsule image with the live-style COA card** (Batch 2406-BPC, BPC-157 10mg, ● PASS badge, HPLC progress bar at 99.2%, Mass Spec / Heavy Metals / Microbial / Endotoxin checklist) |
| Product grid (3 capsule SKUs) | **3 featured peptide cards** styled like the existing product cards: BPC-157 10mg, TB-500 5mg, GHK-Cu 50mg — each with a small COA mini-card thumbnail (PASS badge + purity %) instead of a product photo. CTA "View COA & Specs" → `/shop` |
| Via-Cap science block | **5-Panel Testing block**: same two-column layout, but the 5 numbered cards become HPLC Purity / Mass Spectrometry / Heavy Metals / Microbial & Yeast / Endotoxin (LAL) with lucide icons (`FlaskConical`, `Atom`, `Shield`, `Bug`, `Syringe`) |
| "More than human" lifestyle band (island.jpg) | **"Every Batch Has a COA. *No Exceptions.*"** band — keep the same big-image + overlay-card layout, but the overlay is a full sample COA card (GHK-Cu Batch #2406-GHK with 7 test rows). The background image stays for now (you said keep the COA lab pictures and existing imagery; we can swap to a lab-bench shot later) |
| Sprout Labs section | **Clarum Lab Standards**: ISO/IEC 17025 accredited testing partners, what each panel proves, link to `/about` |
| Footer | Clarum nav: Shop, COA Library, About, FAQ, Contact, Privacy, Terms, Disclaimer + RUO disclaimer line: "All products for in vitro laboratory research use only. Not for human or veterinary use." |

Update `head()` meta:
- title: "CLARUM — Batch-Tested Research Peptides | Nothing Hidden. Everything Tested."
- description: pulled verbatim from Clarum's Index Seo

## 3. New routes

Per your answer ("create new pages if needed"), add the standard Clarum routes — each its own file with route-specific `head()` (title, description, og:title, og:description) per the route-architecture rules:

- `src/routes/shop.tsx` — peptide catalog grid (static list of ~8 featured compounds across BPC-157, TB-500, GHK-Cu, Semax, Selank, Epitalon, MOTS-c, KPV; each card links to a per-product detail later). Reuses the homepage product-card style.
- `src/routes/coa-library.tsx` — table/grid of COA entries (Compound · Batch # · Test Date · Status · "View COA"). Static sample data for now (3–5 rows) since the source project pulls from WooCommerce — calling out below.
- `src/routes/about.tsx` — port the "We Saw an Industry Built on Shortcuts" story, 4 values cards (Transparency First, Science Over Marketing, Beyond Purity, Built for Researchers).
- `src/routes/faq.tsx` — accordion of the 9 Q&As from Clarum's FAQ.tsx.
- `src/routes/contact.tsx` — simple contact form (name / email / message) with Sonner toast on submit; no backend wired.
- `src/routes/disclaimer.tsx` — short RUO/legal page (footer link).

Update `src/routes/__root.tsx` to keep the same shell, and verify the auto-generated `routeTree.gen.ts` picks them up (no manual edit).

## 4. Imagery — what stays, what changes

You said "keep the COA lab pictures, feel free to use a different layout." Concretely:

- **Reuse** `src/assets/island.jpg` and `src/assets/lifestyle-pour.jpg` as ambient background imagery for the "Every Batch Has a COA" band and the Lab Standards section (they read as moody/scientific against a black overlay).
- **Replace** the 3 product capsule shots in the existing grid with **CSS-rendered COA mini-cards** (no new image generation needed — matches your "different layout" guidance and is more on-brand).
- **Hero**: drop `hero-capsule.jpg` from the right column and use the live COA card component instead — same column width, same visual weight.
- I will **not** generate new peptide vial photos in this pass; we can add real product photography later if you want.

## 5. What I'm intentionally NOT doing in this plan

- **No WooCommerce integration.** Clarum's source uses `useWcFeaturedProducts` against a real WC backend. We'll use static product/COA data for now; can wire to Lovable Cloud later if you want a real catalog.
- **No age-gate modal.** Clarum's site has an 18+ age verification overlay. Skipping unless you ask — adds friction for a layout demo.
- **No cart / Stripe checkout** in this pass.
- **No copying of Clarum's tailwind.config / Vite-router internals** — that project uses React Router DOM + a different design system; we stay on TanStack Start + the swapped tokens above.

## Files to be created / edited

**Edited**
- `src/styles.css` — palette + texture utilities
- `src/routes/index.tsx` — full content swap (layout preserved)
- `src/routes/__root.tsx` — title/description, og defaults to Clarum

**Created**
- `src/routes/shop.tsx`
- `src/routes/coa-library.tsx`
- `src/routes/about.tsx`
- `src/routes/faq.tsx`
- `src/routes/contact.tsx`
- `src/routes/disclaimer.tsx`
- `src/components/CoaCard.tsx` — shared sample-COA card used in hero, "Every Batch" band, product grid (DRY)
- `src/data/peptides.ts` — static peptide + sample COA data
