# Mobile Responsive CSS Design

Date: 2026-04-13

## Context
The app is a content-driven portfolio. The content is the source of truth and must remain unchanged. The request is to make the UI readable and comfortable on mobile with a single breakpoint at `900px`.

## Goals
- Make the layout readable and usable on small screens.
- Keep changes scoped to presentation only.
- Use a separate mobile CSS file for overrides.

## Non-Goals
- No content changes.
- No new features or components.
- No refactors outside layout and typography adjustments.

## Approach
### Structure
- Create `app/mobile.css` as a dedicated mobile override file.
- Load it after `app/globals.css` in `app/layout.tsx` to ensure overrides apply.
- All rules in `app/mobile.css` live under `@media (max-width: 900px)`.

### Mobile Overrides (900px and below)
- **Page frame**: reduce `main` padding for small screens.
- **Grid layouts**: switch multi-column grids to single-column for:
  - `project-grid.two`, `approach-grid`, `about-block`, `site-header`,
    `project-card__split`, `project-card__panel`, and Lumira modal splits.
- **Typography**: reduce large hero sizes:
  - `hero-title`, `site-header__title`, `site-header__tagline`.
- **Card spacing**: reduce padding for project cards and panels.
- **Modals**:
  - tighter `modal-backdrop` padding,
  - reduced `project-modal__body` padding,
  - modal grids to one column where applicable.

## Data Flow
No data flow changes. Only CSS overrides.

## Error Handling
No error handling changes.

## Testing
- Manual check at widths above and below `900px` to confirm:
  - single-column layout,
  - readable typography,
  - modal usability.

## Risks
- Override conflicts if selector specificity is too low. Mitigation: keep selectors identical to existing ones and place the mobile import after globals.
