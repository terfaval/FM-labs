# Featured Project Cards Redesign

Date: 2026-04-12  
Scope: **Featured project cards only** (Lumira, Kincstartó, Szárnyfeszítő)

## Goal
Restore the featured cards layout to a **full‑width, two‑column** layout with logo/name on one side and hero+status+CTA on the other, with per‑project rules for ordering, typography, and logo sizing.

## Constraints
- Use existing `projectVisuals` CTA colors (`ctaFrom/ctaTo`).
- Layout applies **only** to featured cards (not other project cards).
- Keep CTA **left‑aligned** in the text column.
- Maintain existing modal behavior.

## Layout
**Base layout (all three featured cards):**
- Full width within content margins.
- Two columns:
  - **Brand column**: logo + name (unless hidden).
  - **Text column**: hero → status → CTA.
- CTA uses `projectVisuals` gradient colors.

**Per‑project overrides:**
1. **Lumira**
   - Brand column: logo + name.
   - Name: **Space Grotesk**, weight **400**, lowercase, **white**.
2. **Kincstartó**
   - **Column order swapped**: text column first, brand column second.
3. **Szárnyfeszítő**
   - **No name**, larger logo.

## Responsive
- On mobile: stack vertically, brand first, then text.
- Keep text column left‑aligned on mobile.

## Implementation Notes
- Use Option 1: add a **featured layout mode** to `ProjectCard` with per‑project overrides.
- Keep CTA styles derived from existing `project-modal__cta`.

## Acceptance Criteria
- Featured cards are full‑width, two‑column layout.
- CTA left‑aligned, colored per project.
- Lumira name is Space Grotesk 400 lowercase and white.
- Kincstartó text column appears before brand column.
- Szárnyfeszítő has no name and larger logo.
