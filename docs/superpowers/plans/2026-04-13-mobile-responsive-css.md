# Mobile Responsive CSS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated mobile CSS override file and apply 900px responsive layout adjustments without changing content.

**Architecture:** Keep all existing desktop styles in `app/globals.css` and place mobile-only overrides in `app/mobile.css` under a single `@media (max-width: 900px)` block. Import `mobile.css` after `globals.css` in `app/layout.tsx` so overrides win by cascade order.

**Tech Stack:** Next.js App Router, global CSS.

---

## File Structure

- Create: `app/mobile.css`
  - Responsibility: All mobile overrides for `max-width: 900px`.
- Modify: `app/layout.tsx`
  - Responsibility: Import `mobile.css` after `globals.css`.

---

### Task 1: Add Mobile Override Styles

**Files:**
- Create: `app/mobile.css`

- [ ] **Step 1: Create `app/mobile.css` with the mobile override block**

```css
@media (max-width: 900px) {
  main {
    padding: 28px 20px 64px;
  }

  .site-header {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .site-header__title {
    font-size: 48px;
  }

  .site-header__tagline {
    font-size: 18px;
  }

  .hero-title {
    font-size: 28px;
  }

  .about-block {
    grid-template-columns: 1fr;
  }

  .about-block__grid {
    grid-template-columns: 1fr;
  }

  .project-grid.two {
    grid-template-columns: 1fr;
  }

  .approach-grid {
    grid-template-columns: 1fr;
  }

  .approach-intro,
  .approach-outro {
    font-size: 16px;
  }

  .project-card {
    padding: 22px;
  }

  .project-card--split {
    padding: 28px;
  }

  .project-card.featured.project-card--split {
    padding: 32px;
  }

  .project-card__split,
  .project-card.featured .project-card__split,
  .project-card.featured .project-card__split--reverse,
  .project-card__panel {
    grid-template-columns: 1fr;
    text-align: left;
  }

  .project-card__brand-col,
  .project-card__panel-brand {
    align-items: flex-start;
    text-align: left;
  }

  .project-card__panel {
    padding: 32px 24px;
  }

  .project-card__logo--panel {
    width: 96px;
    height: 96px;
  }

  .modal-backdrop {
    padding: 24px 16px;
  }

  .project-modal {
    width: min(96vw, 960px);
  }

  .project-modal__body {
    padding: 12px 20px 24px;
  }

  .project-modal__grid--five {
    grid-template-columns: 1fr;
  }

  .lumira-modal {
    gap: 48px;
  }

  .lumira-modal__split,
  .lumira-modal__next-cards,
  .lumira-modal__icon-grid-items {
    grid-template-columns: 1fr;
  }

  .lumira-modal__mood {
    font-size: 18px;
  }
}
```

- [ ] **Step 2: Quick manual scan for duplicates**

Confirm there are no duplicate selectors outside `@media (max-width: 900px)` in `app/mobile.css`.

- [ ] **Step 3: Commit**

```bash
git add app/mobile.css
git commit -m "Add mobile responsive overrides"
```

---

### Task 2: Load Mobile Styles After Globals

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Import `mobile.css` after `globals.css`**

```tsx
import "./globals.css";
import "./mobile.css";
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "Load mobile overrides after globals"
```

---

### Task 3: Manual Verification

**Files:**
- None

- [ ] **Step 1: Run dev server**

Run: `npm run dev`

Expected: App loads without CSS errors.

- [ ] **Step 2: Manual check at widths**

Check around 360px–900px:
- Single-column layout for grids and cards.
- Readable header typography.
- Modals remain usable without horizontal scroll.

- [ ] **Step 3: Commit verification note (optional)**

If keeping a log, add a short note in PR or task notes. No code changes needed.

---

## Self-Review Checklist

- Spec coverage: All listed mobile overrides are implemented in `app/mobile.css`, and the file is imported after globals.
- Placeholder scan: No “TBD/TODO” markers.
- Consistency: Selector names match existing CSS and use the 900px breakpoint.
