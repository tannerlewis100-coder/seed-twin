## Goal

Lift About and FAQ from "clean but plain centered text" to editorial, magazine-grade layouts that match the rest of Clarum's brand (gold accents, dark surfaces, restrained typography). Content stays the same — only structure, layout, and visual treatment change.

---

## About page (`src/routes/about.tsx`)

Current: stacked centered hero → narrow problem/solution prose → 5-panel icon row → values quote. Reads like one long column.

New layout:

1. **Asymmetric hero** — left column: oversized eyebrow ("Our Story"), the headline, one-line subhead. Right column: a vertical "stat strip" (e.g. *5 panels · every batch · 0 paywalls · public COAs*). Gold hairline divider between columns. Subtle gold radial glow stays.

2. **Problem / Solution as a two-column diptych** — instead of stacked sections, place "The Problem" and "The Solution" side-by-side on desktop (stack on mobile), separated by a vertical gold rule. Each side keeps its eyebrow + headline + prose. Gives the narrative a visible "before/after" feel.

3. **5-Panel standard, redesigned** —
   ```text
   ┌──────────────────────────────────────────┐
   │  01  HPLC Purity        ≥99% spec        │
   │  02  Mass Spec (LC-MS)  Molecular ID     │
   │  03  Heavy Metals       ICP-MS           │
   │  04  Microbial & Yeast  Aerobic, mold    │
   │  05  Endotoxin (LAL)    Bacterial endo   │
   └──────────────────────────────────────────┘
   ```
   Numbered horizontal rows with gold index numerals, icon, title, spec — instead of 5 small centered cards. Feels like a methodology table.

4. **Pull-quote values band** — full-width dark band with a single oversized italic line ("We test every batch and publish every COA.") set in display serif, gold quote marks, signed "— Clarum". Followed by the existing COA Library CTA, restyled as a wider gold-bordered button with arrow.

5. Micro-polish: tighter vertical rhythm, gold hairlines between sections, RevealOnScroll preserved.

---

## FAQ page (`src/routes/faq.tsx`)

Current: centered hero + single column of accordion cards.

New layout:

1. **Hero with search-style flourish** — keep the eyebrow + headline, but add a non-functional decorative "Browse answers" pill below the subhead (purely visual anchor — no real search to avoid scope creep). Add a count chip ("8 questions").

2. **Two-column layout on desktop** —
   ```text
   ┌──────────────┬───────────────────────────┐
   │  Sticky      │  Accordion list           │
   │  category    │  (Products, COAs &        │
   │  nav         │   Testing, Shipping &     │
   │  (gold       │   Storage as section      │
   │  active)     │   headings between items) │
   └──────────────┴───────────────────────────┘
   ```
   Left: sticky vertical category nav (3 groups). Right: accordion grouped under those category headings. Mobile collapses to single column with the category headings inline.

3. **Group the existing 8 FAQs** (no content change):
   - *Products & Compliance* — research peptides, RUO meaning
   - *COAs & Testing* — reading a COA, endotoxin testing, what makes testing different, COA before purchase
   - *Shipping & Storage* — international shipping, shipping/storage

4. **Accordion restyle** — keep cards but add a gold numeric index ("01", "02"…) on the left of each trigger, larger touch target, gold underline animation on open. Plus icon rotates to minus.

5. **Closing CTA band** — "Still have questions?" line with link to `/contact`, matching the gold-bordered button style used on About.

---

## Technical notes

- Both files are self-contained route components; only JSX/Tailwind changes, no new dependencies, no data/server changes.
- Reuse existing `RevealText`, `RevealOnScroll`, `Accordion*`, `brand-gold` tokens, `gold-line-texture`, `gold-grid-texture`.
- Responsive: two-column sections collapse to single column under `md`.
- No new routes, no SEO/meta changes (titles/descriptions stay).
- No content edits — every existing sentence and FAQ answer is preserved verbatim.

---

## Out of scope

- Search functionality on FAQ (visual pill only).
- Content rewrites.
- Header/footer changes.
- New images or illustrations.