# Kincstartó Modal Tweaks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply Kincstartó-only visual tweaks (fonts, colors, image pairing, CTA glow) and remove one Next Directions card.

**Architecture:** Adjust Kincstartó modal rendering to apply Kincstartó-specific styles and layout classes. Update CSS under Kincstartó modal scope only. Remove one card from Kincstartó modal content.

**Tech Stack:** Next.js, React, CSS, Vitest

---

### Task 1: Remove the “Jóga tudástér mélyítése” card

**Files:**
- Modify: `lib/content/kincstartoModal.ts`

- [ ] **Step 1: Filter out the card**

```ts
const nextDirections = parseListItems(nextDirectionsBlock).filter(
  (card) => card.title !== "Jóga tudástér mélyítése"
);
```

- [ ] **Step 2: Commit**

```bash
git add lib/content/kincstartoModal.ts
git commit -m "feat: remove kincstarto next directions card"
```

---

### Task 2: Kincstartó-specific typography and colors

**Files:**
- Modify: `components/kincstarto/KincstartoModalNarrative.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add Kincstartó modal scope class**

```tsx
<div className="lumira-modal kincstarto-modal kincstarto-modal--dark-text">
```

- [ ] **Step 2: Add CSS for Kincstartó black text/icon colors**

```css
.kincstarto-modal--dark-text,
.kincstarto-modal--dark-text .lumira-modal__brand-name,
.kincstarto-modal--dark-text .lumira-modal__brand-tagline,
.kincstarto-modal--dark-text .lumira-modal__icon-card,
.kincstarto-modal--dark-text .lumira-modal__icon,
.kincstarto-modal--dark-text .lumira-modal__mood,
.kincstarto-modal--dark-text h3,
.kincstarto-modal--dark-text p {
  color: #1f1c19;
}

.kincstarto-modal--dark-text .lumira-modal__brand img {
  filter: none;
}

.kincstarto-modal--dark-text .lumira-modal__brand-name,
.kincstarto-modal--dark-text .lumira-modal__brand-tagline {
  font-family: var(--font-body), "Segoe UI", system-ui, sans-serif;
}
```

- [ ] **Step 3: Commit**

```bash
git add components/kincstarto/KincstartoModalNarrative.tsx app/globals.css
git commit -m "feat: style kincstarto modal text colors"
```

---

### Task 3: Image pair composition

**Files:**
- Modify: `components/kincstarto/KincstartoModalNarrative.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Wrap image pair in a group container**

```tsx
<div className="lumira-modal__split-image kincstarto-modal__image-group">
  <img className="kincstarto-modal__image kincstarto-modal__image--primary" ... />
  <img className="kincstarto-modal__image kincstarto-modal__image--secondary" ... />
</div>
```

- [ ] **Step 2: Add side-aware offset class**

```tsx
<section
  className={cx(
    "lumira-modal__split",
    section.imageSide === "right" && "lumira-modal__split--image-right",
    section.imageSide === "right"
      ? "kincstarto-modal__pair--image-right"
      : "kincstarto-modal__pair--image-left"
  )}
>
```

- [ ] **Step 3: CSS for diagonal stacking and sizing**

```css
.kincstarto-modal__image-group {
  display: grid;
  gap: 16px;
  justify-items: center;
  align-items: center;
  align-self: center;
}

.kincstarto-modal__image {
  width: 88%;
  max-width: 420px;
  border-radius: 16px;
  box-shadow: 0 16px 32px rgba(12, 18, 26, 0.18);
}

.kincstarto-modal__image--secondary {
  width: 76%;
}

.kincstarto-modal__pair--image-right .kincstarto-modal__image--secondary {
  transform: translate(-28px, 22px);
}

.kincstarto-modal__pair--image-left .kincstarto-modal__image--secondary {
  transform: translate(28px, 22px);
}
```

- [ ] **Step 4: Commit**

```bash
git add components/kincstarto/KincstartoModalNarrative.tsx app/globals.css
git commit -m "feat: stack kincstarto modal images diagonally"
```

---

### Task 4: CTA glow color

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Update CTA box-shadow to use CTA colors**

```css
.project-modal__cta {
  box-shadow: 0 14px 28px color-mix(in srgb, var(--cta-from) 55%, transparent);
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat: match cta glow to button colors"
```

---

### Task 5: Tests

- [ ] **Step 1: Run tests**

Run: `npm run test`
Expected: PASS

- [ ] **Step 2: Check git status**

Run: `git status -sb`
Expected: clean

---

## Self-Review Checklist
- BrandIntro uses default font + black text
- Icon grid + mood text black
- Image pair stacked diagonally with correct direction and vertical centering
- Next directions card removed
- CTA glow matches button colors
- No changes to non-Kincstartó modals

---

Plan complete.
