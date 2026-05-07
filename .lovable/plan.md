## Goal

The current header dropdowns (Shop / COA Library / About) feel cramped and inconsistent: oversized icon tiles, repeated rows that look identical, and a narrow 380px panel that wastes the floating header's width. Clean them up with a more deliberate, editorial layout.

## Changes (SiteHeader.tsx only)

**1. New tile component**
- Replace bulky 56px icon squares with a compact 40px circular icon in `brand-gold/10` with a subtle gold ring on hover.
- Drop the eyebrow label clutter; use a single title + one-line description.
- Add a faint right-side `→` chevron that slides in on hover for affordance.
- Hover state: `bg-white/[0.04]` with a left gold accent bar (2px) instead of the current full-row tint.

**2. Shop dropdown — two-column layout (560px wide)**
- Left column: 4 featured products as compact rows (name + size, small category eyebrow).
- Right column: a "Quick links" stack — Shop All, Bestsellers, New Arrivals, Bundles — plus a small promo card at the bottom ("Every batch tested. View COAs →") with the gold accent.
- Footer strip: single "Shop all products →" link, right-aligned.

**3. COA Library dropdown — two-column (560px)**
- Left column: the 4 test types (HPLC, Mass Spec, Heavy Metals, Endotoxin) as icon rows.
- Right column header "Reference" with: How to Read a COA, Verify by Batch #, Lab Partner (Eurofins).
- Bottom: small inline note "Eurofins · Lancaster, PA · ISO/IEC 17025" in muted text.

**4. About dropdown — two-column (560px)**
- Left column: Our Story, 5-Panel Testing, Lab Partners, Contact.
- Right "Reference" column: FAQ, Research Use Disclaimer.

**5. Panel container polish**
- Widen panel to `w-[560px]`, reduce internal padding to `p-3`, tighten row gap.
- Soften shadow, drop border opacity slightly (`border-white/8`).
- Add a 150ms fade+translate-y-1 enter animation (already partially there).
- Anchor each panel under its triggering nav item (currently all anchor left under the brand) — track the trigger's left offset via ref so the panel sits flush below the hovered label.

**6. Trigger polish**
- Add a small caret indicator next to nav labels that have a menu, rotating 180° when open.
- Underline-grow effect on hover (2px gold bar from left to right) to replace the current flat color change.

## Out of scope
- Mobile drawer (already redesigned recently).
- Announcement bar, footer, page bodies.
- No new routes or data changes — featured products still come from `peptides`.

## Files
- `src/components/SiteHeader.tsx` (only file touched).
