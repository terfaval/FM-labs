# Lumira Modal Overlay Darkening + Border Removal Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Lumira modal overlay ~20–25% darker than the Lumira card and remove the white border on the Lumira modal only.

**Architecture:** Adjust Lumira-only overlay opacity and border in `app/globals.css`. Keep the existing modal shell and Lumira-only class.

**Tech Stack:** Next.js, CSS

---

### Task 1: Darken Lumira modal overlay

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Increase overlay alpha values**

```css
.project-modal--lumira::after {
  background-image:
    linear-gradient(
      90deg,
      rgba(18, 26, 38, 0.24) 0%,
      rgba(18, 26, 38, 0.3) 40%,
      rgba(18, 26, 38, 0.56) 70%,
      rgba(18, 26, 38, 0.78) 100%
    ),
    radial-gradient(
      circle at 70% 55%,
      rgba(140, 190, 235, 0.15) 0%,
      rgba(140, 190, 235, 0.08) 40%,
      rgba(140, 190, 235, 0) 70%
    );
}
```

- [ ] **Step 2: Run tests**

Run: `npm run test -- LumiraModalNarrative.test.tsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: darken lumira modal overlay"
```

---

### Task 2: Remove Lumira modal border

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Override border for Lumira modal**

```css
.project-modal--lumira {
  border: none;
}
```

- [ ] **Step 2: Run tests**

Run: `npm run test -- LumiraModalNarrative.test.tsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: remove lumira modal border"
```

---

### Task 3: Final verification

- [ ] **Step 1: Run full test suite**

Run: `npm run test`
Expected: PASS

- [ ] **Step 2: Check git status**

Run: `git status -sb`
Expected: clean

---

## Self-Review Checklist
- Overlay darker than Lumira card, but background still visible
- Lumira modal has no border
- No changes to non-Lumira modals

---

Plan complete.
