## Goal
Replicate the wgb.agency text-reveal-on-scroll effect: as a heading or paragraph enters the viewport, its words fade in (opacity 0 → 1) with a small upward translate, staggered word-by-word so the copy "writes itself in." Apply across all pages.

## Approach
Pure CSS + IntersectionObserver — no animation library needed. Lightweight, SSR-safe, and respects `prefers-reduced-motion`.

## 1. New component: `src/components/RevealText.tsx`
A reusable wrapper that splits its text content into spans per word and animates them on viewport entry.

- Props: `as` (h1/h2/p/span, default `span`), `text: string`, `className`, `stagger` (ms, default 35), `delay` (ms, default 0).
- Splits `text` on whitespace; wraps each word in `<span class="reveal-word">` with inline `style={{ transitionDelay: ... }}`. Preserves whitespace via inline-block + space.
- Wrapper span uses a `ref` + `IntersectionObserver` (threshold ~0.2, `rootMargin: "0px 0px -10% 0px"`). On intersect, adds `data-revealed="true"` and disconnects the observer (one-shot).
- If `prefers-reduced-motion: reduce`, mounts already-revealed (no animation).

## 2. Animation styles in `src/styles.css`
Add inside `@layer utilities`:

```css
.reveal-word {
  display: inline-block;
  opacity: 0;
  transform: translateY(0.6em);
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}
[data-revealed="true"] > .reveal-word {
  opacity: 1;
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .reveal-word { opacity: 1; transform: none; transition: none; }
}
```

## 3. Optional helper: `RevealOnScroll`
A thin wrapper for non-text blocks (cards, images, buttons) that applies the same fade+rise on intersect — uses a single `.reveal-block` class with the same `data-revealed` toggle. Useful so we don't have to split text inside complex children.

## 4. Adoption across pages
Replace headings and lead paragraphs in:
- `src/routes/index.tsx` — Hero headline, FeaturedProducts heading + intro paragraph, any remaining section headers.
- `src/routes/shop.tsx`, `coa-library.tsx`, `about.tsx`, `contact.tsx`, `disclaimer.tsx`, `faq.tsx` — page H1 + lead paragraph.
- `src/components/SiteFooter.tsx` — leave static (small text, would feel noisy).
- `src/components/SiteHeader.tsx` — leave static (already has its own transitions).

For section cards / product tiles on the homepage and shop, wrap the row in `RevealOnScroll` so the cards rise together as the section enters view.

## 5. Performance / safety
- Observer disconnects after first reveal (no perpetual listeners).
- No layout thrash: only opacity + transform.
- SSR: component renders the words immediately in markup (visible to crawlers); the hidden state is applied via class only after mount, so search engines and no-JS users still see the text.
- Won't break existing fonts, line-height, or wrapping (inline-block words wrap naturally; spaces preserved).

## Out of scope
- Horizontal pinning, parallax, or sticky-stacked card effects (not requested).
- Header scroll behavior — already implemented separately.

## Files touched
- `src/components/RevealText.tsx` (new)
- `src/components/RevealOnScroll.tsx` (new)
- `src/styles.css` (add ~15 lines of utility CSS)
- `src/routes/index.tsx`, `shop.tsx`, `coa-library.tsx`, `about.tsx`, `contact.tsx`, `disclaimer.tsx`, `faq.tsx` (swap headings/paragraphs to use `RevealText`)
