# Project Modal CTA Row + Inverse Feedback Button

Date: 2026-04-13

## Summary
Adjust the project modal footer CTA row so the "Fedezd fel" and "Ird meg" buttons sit next to each other with equal width, and the "Ird meg" button uses an inverse style (white background with colored border and text). The modal header CTA remains unchanged.

## Scope
- Only the footer CTA row inside project modals.
- Visual-only changes; no new functionality or content.

## Non-Goals
- No changes to the modal header CTA group.
- No changes to form behavior, validation, or endpoints.
- No new components beyond small prop/styling adjustments.

## UI Behavior
- Footer CTA group shows two buttons in a single row.
- Buttons have equal width and consistent height/padding.
- "Ird meg" is inverse: white background, brand color text and border.

## Implementation Notes
- Add a modifier class to the footer CTA group (e.g., `project-modal__cta-group--footer`) to enforce equal-width buttons and horizontal layout.
- Add a `variant="inverse"` option to `ProjectFeedbackForm` to style the toggle button accordingly.
- Keep existing CTA classes for the default (non-inverse) case.

## Accessibility
- Preserve existing `aria-expanded` and `aria-controls` for the feedback toggle.
- Maintain visible focus styles for both CTA buttons.

## Testing
- If any modal CTA snapshot/DOM tests exist, update expected markup/classes.
- No new tests required.
