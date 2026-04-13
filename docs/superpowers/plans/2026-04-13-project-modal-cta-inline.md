# Project Modal CTA Placement + Footer Inline Buttons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the feedback CTA from modal headers and make footer CTA buttons inline, centered, with content-based widths and only the gap between them, while keeping the inverse styling for “Ird meg.”

**Architecture:** Keep header CTA as a simple single-link group. Use a footer-only modifier class to apply inline/flex layout and reset button widths to auto; keep the inverse variant on the feedback button.

**Tech Stack:** Next.js (App Router), React, CSS

---

## File Structure / Responsibilities
- Modify: `components/lumira/LumiraModalNarrative.tsx` — remove feedback CTA from header.
- Modify: `components/kincstarto/KincstartoModalNarrative.tsx` — same as above.
- Modify: `app/globals.css` — update footer CTA layout to inline centered and width auto.
- (Optional) Test: `components/lumira/LumiraModalNarrative.test.tsx` — only if DOM expectations change.

### Task 1: Remove feedback CTA from modal headers

**Files:**
- Modify: `components/lumira/LumiraModalNarrative.tsx`
- Modify: `components/kincstarto/KincstartoModalNarrative.tsx`

- [ ] **Step 1: Update header CTA groups**

In both modal components, ensure the header CTA group only contains the “Fedezd fel” link. Remove the `ProjectFeedbackForm` from the header CTA group. The footer CTA group remains unchanged.

- [ ] **Step 2: Commit**

```bash
git add components/lumira/LumiraModalNarrative.tsx components/kincstarto/KincstartoModalNarrative.tsx
git commit -m "Remove feedback CTA from modal headers"
```

### Task 2: Make footer CTA inline, centered, width auto

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Update footer CTA layout styles**

Replace the footer CTA group layout rules with inline/flex centered styles and reset button widths to auto:

```css
.project-modal__cta-group--footer {
  display: inline-flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  width: auto;
}

.project-modal__cta-group--footer .project-modal__cta,
.project-modal__cta-group--footer .project-feedback__cta {
  width: auto;
}
```

Keep the existing inverse button styles.

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "Update footer CTA layout to inline centered"
```

---

## Self-Review
- **Spec coverage:** Header CTA only “Fedezd fel”, footer CTA inline centered with content width; inverse style retained.
- **Placeholder scan:** No TODO/TBD.
- **Type consistency:** No new types introduced.

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-13-project-modal-cta-inline.md`. Two execution options:**

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
