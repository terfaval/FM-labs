# Lumira Modal Tweaks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the Lumira modal background/overlay, text colors, split layout for blocks 02/04, and add “Fedezd fel” CTAs, all Lumira-only.

**Architecture:** Keep the existing modal shell and narrative component. Apply Lumira-only styling via a modal class, drive split alignment via the model’s `imageSide`, and reuse the existing CTA gradient variables.

**Tech Stack:** Next.js (app router), React, CSS, Vitest

---

### Task 1: Add tests for new Lumira modal behaviors

**Files:**
- Modify: `components/lumira/LumiraModalNarrative.test.tsx`

- [ ] **Step 1: Write failing tests for CTA + split alignment**

```tsx
it("renders two Fedezd fel CTAs", () => {
  const html = renderToStaticMarkup(<LumiraModalNarrative model={MODEL} />);
  const matches = html.match(/Fedezd fel/g) ?? [];
  expect(matches).toHaveLength(2);
});

it("adds image-right class when imageSide is right", () => {
  const html = renderToStaticMarkup(<LumiraModalNarrative model={MODEL} />);
  expect(html).toContain("lumira-modal__split--image-right");
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- LumiraModalNarrative.test.tsx`
Expected: FAIL (CTA text missing, split class missing)

- [ ] **Step 3: Commit**

```bash
git add components/lumira/LumiraModalNarrative.test.tsx
git commit -m "test: cover lumira modal cta and split alignment"
```

---

### Task 2: Update Lumira modal component to render CTAs and image-side classes

**Files:**
- Modify: `components/lumira/LumiraModalNarrative.tsx`

- [ ] **Step 1: Add CTA to brand header and closing**

```tsx
const CTA = (
  <a
    className="project-modal__cta lumira-modal__cta"
    href="https://lumira-sage.vercel.app"
    target="_blank"
    rel="noreferrer"
  >
    Fedezd fel
  </a>
);
```

Use it in two places:
- Inside `.lumira-modal__brand` (under tagline)
- After the closing text block

- [ ] **Step 2: Respect imageSide with a split modifier class**

```tsx
const imageRight = section.imageSide === "right";
return (
  <section
    className={cx(
      "lumira-modal__split",
      imageRight && "lumira-modal__split--image-right"
    )}
  >
    <div className="lumira-modal__split-image">
      <img src={section.imageSrc} alt={section.imageAlt} />
    </div>
    <div className="lumira-modal__split-text">...</div>
  </section>
);
```

- [ ] **Step 3: Run tests**

Run: `npm run test -- LumiraModalNarrative.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/lumira/LumiraModalNarrative.tsx
git commit -m "feat: add lumira modal ctas and split alignment"
```

---

### Task 3: Force blocks 02 and 04 to be text-left / image-right

**Files:**
- Modify: `lib/content/lumiraModalModel.ts`

- [ ] **Step 1: Update imageSide for Keret és irány and Visszatérés**

```ts
{
  ...content.flow.keret,
  imageSrc: "/lumira/screens/direction.PNG",
  imageAlt: "Keret és irány képernyő",
  imageSide: "right",
},
...
{
  ...content.flow.visszateres,
  imageSrc: "/lumira/screens/dream list.PNG",
  imageAlt: "Visszatérés képernyő",
  imageSide: "right",
},
```

- [ ] **Step 2: Run tests**

Run: `npm run test -- LumiraModalNarrative.test.tsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add lib/content/lumiraModalModel.ts
git commit -m "feat: align lumira flow 02 and 04 to image right"
```

---

### Task 4: Apply Lumira-only modal background/overlay + CTA gradient

**Files:**
- Modify: `components/ProjectGallery.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add Lumira modal class + background override**

```tsx
const isLumira = project.slug === "lumira";
const style = visual
  ? ({
      "--card-bg": `url("${visual.background}")`,
      "--card-overlay": visual.overlay,
      "--cta-from": visual.ctaFrom,
      "--cta-to": visual.ctaTo,
    } as CSSProperties)
  : undefined;

const lumiraStyle = isLumira
  ? ({
      ...style,
      "--card-bg": 'url("/lumira/background.png")',
    } as CSSProperties)
  : style;

<div className={cx("project-modal", isLumira && "project-modal--lumira")}
     style={lumiraStyle}>
```

- [ ] **Step 2: Add Lumira modal overlay + text color rules**

```css
.project-modal--lumira::before {
  background-image: var(--card-bg);
}

.project-modal--lumira::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(
      90deg,
      rgba(18, 26, 38, 0.28) 0%,
      rgba(18, 26, 38, 0.32) 40%,
      rgba(18, 26, 38, 0.6) 70%,
      rgba(18, 26, 38, 0.85) 100%
    ),
    radial-gradient(
      circle at 70% 55%,
      rgba(140, 190, 235, 0.18) 0%,
      rgba(140, 190, 235, 0.08) 40%,
      rgba(140, 190, 235, 0) 70%
    );
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
  pointer-events: none;
}

.project-modal--lumira {
  color: rgba(245, 248, 252, 0.92);
}

.project-modal--lumira h1,
.project-modal--lumira h2,
.project-modal--lumira h3 {
  color: rgba(245, 248, 252, 0.95);
}
```

Add CTA spacing:

```css
.lumira-modal__cta {
  margin-top: 22px;
}
```

Add split order on desktop for image-right, and reset for mobile:

```css
.lumira-modal__split--image-right .lumira-modal__split-image {
  order: 2;
}

.lumira-modal__split--image-right .lumira-modal__split-text {
  order: 1;
}

@media (max-width: 900px) {
  .lumira-modal__split--image-right .lumira-modal__split-image,
  .lumira-modal__split--image-right .lumira-modal__split-text {
    order: 0;
  }
}
```

- [ ] **Step 3: Run tests**

Run: `npm run test -- LumiraModalNarrative.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/ProjectGallery.tsx app/globals.css
git commit -m "feat: style lumira modal background overlay and ctas"
```

---

### Task 5: Final verification

- [ ] **Step 1: Run full test suite (if fast) or lint**

Run: `npm run test`
Expected: PASS

- [ ] **Step 2: Commit if needed**

```bash
git status -sb
```

---

## Self-Review Checklist
- Spec coverage: background/overlay, white text, CTA placement, 02/04 layout, CTA link target
- Placeholder scan: none
- Type consistency: `imageSide` and classnames align

---

Plan complete.
