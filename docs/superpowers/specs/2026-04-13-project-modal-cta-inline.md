# Project Modal CTA Placement + Footer Inline Buttons

Date: 2026-04-13

## Summary
Remove the “Ird meg” button from the modal header CTA block. In the modal footer CTA block, keep both buttons side-by-side, centered, with their own content-driven widths and padding, separated only by the gap. Preserve the inverse styling for “Ird meg.”

## Scope
- Both project modals (Lumira and Kincstarto).
- Footer CTA layout + header CTA removal only.

## Non-Goals
- No changes to form behavior, validation, or endpoints.
- No changes to the rest of modal content.

## UI Behavior
- Header CTA: only “Fedezd fel”.
- Footer CTA: “Fedezd fel” + “Ird meg” inline, centered, width auto (content + padding), only `gap` between them.
- “Ird meg” keeps inverse styling.

## Implementation Notes
- Remove `ProjectFeedbackForm` from header CTA group in both modal components.
- Keep footer CTA group and apply a modifier class that sets inline/flex layout with centered alignment and resets button width to auto.
- Do not use equal-width grid in the footer CTA group.

## Accessibility
- Keep existing ARIA attributes on the feedback toggle.
- Preserve focus-visible styles.

## Testing
- Update snapshot/DOM tests if modal CTA structure is asserted.
- No new tests required.
