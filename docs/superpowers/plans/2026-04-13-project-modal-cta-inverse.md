# Project Modal Footer CTA + Inverse Feedback Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the modal footer CTA row show two equal-width buttons side-by-side and render the “Ird meg” button in inverse style (white background with brand border/text), without changing the header CTA.

**Architecture:** Add a footer-only modifier class to the CTA group for layout, and add a `variant` prop on `ProjectFeedbackForm` to switch the toggle button style. CSS handles width and inverse visuals.

**Tech Stack:** Next.js (App Router), React, CSS

---

## File Structure / Responsibilities
- Modify: `components/ProjectFeedbackForm.tsx` — add `variant` prop and apply class for inverse button.
- Modify: `components/lumira/LumiraModalNarrative.tsx` — add footer CTA group modifier and pass inverse variant to `ProjectFeedbackForm` in footer CTA only.
- Modify: `components/kincstarto/KincstartoModalNarrative.tsx` — same as above for footer CTA only.
- Modify: `app/globals.css` — add styles for footer CTA group equal-width layout and inverse button variant.
- (Optional) Test: `components/lumira/LumiraModalNarrative.test.tsx` — only if snapshot/DOM expectations change.

### Task 1: Add inverse variant to feedback CTA button

**Files:**
- Modify: `components/ProjectFeedbackForm.tsx`

- [ ] **Step 1: Write the failing test (only if a component test exists and is easy to extend)**

If there is a React/DOM test file for `ProjectFeedbackForm`, add an assertion that the inverse variant applies a class name. Example (adjust paths/framework as needed):

```tsx
import { render } from "@testing-library/react";
import { ProjectFeedbackForm } from "@/components/ProjectFeedbackForm";

it("adds inverse class when variant is inverse", () => {
  const { getByRole } = render(
    <ProjectFeedbackForm projectTitle="X" formEndpoint="/" variant="inverse" />
  );
  expect(getByRole("button", { name: /ird meg/i })).toHaveClass(
    "project-feedback__cta--inverse"
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run (only if a test was added): `npm test -- --runTestsByPath <path-to-test>`
Expected: FAIL because the class does not exist yet.

- [ ] **Step 3: Implement variant prop and class name**

Update the props and class binding:

```tsx
type ProjectFeedbackFormProps = {
  projectTitle: string;
  formEndpoint: string;
  variant?: "default" | "inverse";
};

// ...inside component
const ctaClassName = [
  "project-feedback__cta",
  variant === "inverse" ? "project-feedback__cta--inverse" : "",
]
  .filter(Boolean)
  .join(" ");
```

Use it on the button:

```tsx
<button
  type="button"
  className={ctaClassName}
  aria-expanded={isOpen}
  aria-controls={labels.panel}
  onClick={() => setIsOpen((prev) => !prev)}
>
  {isOpen ? "Bezaras" : "Ird meg"}
</button>
```

- [ ] **Step 4: Run test to verify it passes**

Run (only if a test was added): `npm test -- --runTestsByPath <path-to-test>`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/ProjectFeedbackForm.tsx
# plus test file if added
git commit -m "Add inverse variant for project feedback CTA"
```

### Task 2: Apply footer CTA group modifier and inverse variant in modals

**Files:**
- Modify: `components/lumira/LumiraModalNarrative.tsx`
- Modify: `components/kincstarto/KincstartoModalNarrative.tsx`

- [ ] **Step 1: Update footer CTA group class and pass inverse variant**

Create a footer CTA group class on the **footer** `cta` only (not header). Example:

```tsx
const ctaFooter = (
  <div className="project-modal__cta-group project-modal__cta-group--footer">
    <a
      className="project-modal__cta lumira-modal__cta"
      href="https://lumira-sage.vercel.app"
      target="_blank"
      rel="noreferrer"
    >
      Fedezd fel
    </a>
    <ProjectFeedbackForm
      projectTitle={model.brand.name}
      formEndpoint={formEndpoint}
      variant="inverse"
    />
  </div>
);
```

Ensure the **header** CTA remains unchanged (still uses the existing `cta`). Repeat the same structure for Kincstarto.

- [ ] **Step 2: Commit**

```bash
git add components/lumira/LumiraModalNarrative.tsx components/kincstarto/KincstartoModalNarrative.tsx
git commit -m "Style footer CTA group with inverse feedback button"
```

### Task 3: Add CSS for footer equal-width layout and inverse button

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add footer CTA group layout rules**

Add styles near existing `.project-modal__cta-group` / `.project-feedback__cta`:

```css
.project-modal__cta-group--footer {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  align-items: center;
  width: 100%;
}

.project-modal__cta-group--footer .project-modal__cta,
.project-modal__cta-group--footer .project-feedback__cta {
  width: 100%;
  justify-content: center;
}

.project-feedback__cta--inverse {
  background: #ffffff;
  color: var(--cta-from, var(--accent));
  border-color: currentColor;
}

.project-feedback__cta--inverse:hover {
  background: color-mix(in srgb, #ffffff 88%, currentColor 12%);
}
```

If the brand color differs per modal, keep using `--cta-from` / `--cta-to` where available; otherwise fall back to `--accent`.

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "Add footer CTA layout and inverse feedback button styles"
```

---

## Self-Review
- **Spec coverage:** Footer CTA row layout + inverse button style implemented; header CTA unchanged.
- **Placeholder scan:** No TODO/TBD; concrete steps only.
- **Type consistency:** `variant` is optional and checked against the same string literal in all tasks.

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-13-project-modal-cta-inverse.md`. Two execution options:**

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
