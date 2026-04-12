# Lumira Modal Transparency + Split Order Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Lumira modal overlay more transparent and set split ordering so blocks 01/03/05 have image left, 02/04 have text left, with mobile image-first.

**Architecture:** Adjust Lumira-only overlay opacity in `app/globals.css` and set per-section image side in the Lumira modal model. Keep Lumira modal shell unchanged.

**Tech Stack:** Next.js, React, CSS, Vitest

---

### Task 1: Update model imageSide for 01/03/05 and keep 02/04 text-left

**Files:**
- Modify: `lib/content/lumiraModalModel.ts`

- [ ] **Step 1: Set imageSide values**

```ts
const flowSections: FlowSectionModel[] = [
  {
    ...content.flow.rogzites,
    imageSrc: "/lumira/screens/raw input.PNG",
    imageAlt: "Rögzítés képernyő",
    imageSide: "left",
  },
  {
    ...content.flow.keret,
    imageSrc: "/lumira/screens/direction.PNG",
    imageAlt: "Keret és irány képernyő",
    imageSide: "right",
  },
  {
    ...content.flow.feldolgozas,
    imageSrc: "/lumira/screens/question.PNG",
    imageAlt: "Feldolgozás képernyő",
    imageSide: "left",
  },
  {
    ...content.flow.visszateres,
    imageSrc: "/lumira/screens/dream list.PNG",
    imageAlt: "Visszatérés képernyő",
    imageSide: "right",
  },
  {
    ...content.flow.elokeszites,
    imageSrc: "/lumira/screens/exercises.PNG",
    imageAlt: "Előkészítés képernyő",
    imageSide: "left",
  },
];
```

- [ ] **Step 2: Run tests**

Run: `npm run test -- LumiraModalNarrative.test.tsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add lib/content/lumiraModalModel.ts
git commit -m "feat: adjust lumira flow image sides"
```

---

### Task 2: Reduce Lumira modal overlay opacity (~20–30%)

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Adjust overlay alpha values**

Change the Lumira modal overlay to lower opacity by ~20–30%:

```css
.project-modal--lumira::after {
  background-image:
    linear-gradient(
      90deg,
      rgba(18, 26, 38, 0.2) 0%,
      rgba(18, 26, 38, 0.24) 40%,
      rgba(18, 26, 38, 0.45) 70%,
      rgba(18, 26, 38, 0.65) 100%
    ),
    radial-gradient(
      circle at 70% 55%,
      rgba(140, 190, 235, 0.12) 0%,
      rgba(140, 190, 235, 0.06) 40%,
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
git commit -m "feat: reduce lumira modal overlay opacity"
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
- Spec coverage: overlay transparency, 01/03/05 image-left, 02/04 text-left, mobile image-first unchanged
- Placeholder scan: none
- Type consistency: `imageSide` matches CSS ordering

---

Plan complete.
