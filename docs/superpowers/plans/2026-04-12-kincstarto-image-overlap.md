# Kincstartó Image Overlap Adjustments Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Kincstartó image pairs smaller with ~40% overlap and secondary image at ~50% size.

**Architecture:** Adjust only the Kincstartó image pair CSS in `app/globals.css`.

**Tech Stack:** CSS

---

### Task 1: Update Kincstartó image pair sizing and overlap

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Adjust widths and offsets**

```css
.kincstarto-modal__image {
  width: 70%;
  max-width: 380px;
}

.kincstarto-modal__image--secondary {
  width: 35%;
}

.kincstarto-modal__pair--image-right .kincstarto-modal__image--secondary {
  transform: translate(-40%, 30%);
}

.kincstarto-modal__pair--image-left .kincstarto-modal__image--secondary {
  transform: translate(40%, 30%);
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat: increase kincstarto image overlap"
```

---

### Task 2: Check status

- [ ] **Step 1: Check git status**

Run: `git status -sb`
Expected: clean

---

Plan complete.
