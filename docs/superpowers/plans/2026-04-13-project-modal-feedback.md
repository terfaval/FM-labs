# Project Modal Feedback CTA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an “Írd meg” button next to the “Fedezd fel” CTA in all project modals that reveals a lightweight inline contact form whose subject is the project title.

**Architecture:** Introduce a small reusable `ProjectFeedbackForm` component that handles the inline form and submission. Render it beside the existing CTA in modal narratives (Lumira + Kincstartó). Use the existing contact validation and endpoint.

**Tech Stack:** Next.js (App Router), React 19, TypeScript, Vitest.

---

## File Structure / Responsibilities

- **Create:** `components/ProjectFeedbackForm.tsx` — inline form UI + submit logic.
- **Modify:** `components/lumira/LumiraModalNarrative.tsx` — add “Írd meg” button + inline form.
- **Modify:** `components/kincstarto/KincstartoModalNarrative.tsx` — add “Írd meg” button + inline form.
- **Modify:** `app/globals.css` — add CTA variant styling + light form styling.
- **Test:** Manual modal interaction (no automated tests required).

> Constraint: AGENTS.md requests working directly on `main` and no worktrees, so do not create a worktree even though the default skill suggests it.

---

### Task 1: Create ProjectFeedbackForm Component

**Files:**
- Create: `components/ProjectFeedbackForm.tsx`

- [ ] **Step 1: Add the component**

Create `components/ProjectFeedbackForm.tsx`:
```tsx
"use client";

import { useId, useMemo, useState } from "react";
import { validateContact } from "@/lib/contact/validateContact";

type Status = "idle" | "loading" | "success" | "error";

type ProjectFeedbackFormProps = {
  projectTitle: string;
  formEndpoint: string;
};

export function ProjectFeedbackForm({ projectTitle, formEndpoint }: ProjectFeedbackFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ message?: string; email?: string }>({});
  const [feedback, setFeedback] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const formId = useId();

  const isBusy = status === "loading";
  const hasSuccess = status === "success";
  const hasError = status === "error";

  const labels = useMemo(
    () => ({
      name: `project-name-${formId}`,
      email: `project-email-${formId}`,
      message: `project-message-${formId}`,
      honeypot: `project-company-${formId}`,
      panel: `project-panel-${formId}`
    }),
    [formId]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formEndpoint) {
      setStatus("error");
      setFeedback("A küldés most nem érhetõ el.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    if ((formData.get("company") ?? "").toString().trim().length > 0) {
      setStatus("success");
      setFeedback("Köszönöm, az üzenet megérkezett.");
      form.reset();
      return;
    }

    const message = (formData.get("message") ?? "").toString();
    const email = (formData.get("email") ?? "").toString();

    const validation = validateContact({ message, email });
    if (!validation.valid) {
      setErrors(validation.errors);
      setStatus("error");
      setFeedback("Kérlek, ellenõrizd a mezõket.");
      return;
    }

    setErrors({});
    setStatus("loading");
    setFeedback("");

    formData.set("subject", projectTitle);

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      });

      if (!response.ok) {
        throw new Error("request_failed");
      }

      setStatus("success");
      setFeedback("Köszönöm, az üzenet megérkezett.");
      form.reset();
    } catch {
      setStatus("error");
      setFeedback("Most nem sikerült elküldeni. Próbáld újra késõbb.");
    }
  }

  return (
    <div className="project-feedback">
      <button
        type="button"
        className="project-feedback__cta"
        aria-expanded={isOpen}
        aria-controls={labels.panel}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? "Bezárás" : "Írd meg"}
      </button>

      {isOpen ? (
        <div className="project-feedback__card" id={labels.panel}>
          <p className="project-feedback__intro">
            Ha hibát találtál vagy van egy észrevételed, itt gyorsan jelezheted.
          </p>

          <form className="contact-form" onSubmit={handleSubmit} role="form">
            <div className="contact-row">
              <label htmlFor={labels.name}>Név</label>
              <input id={labels.name} name="name" type="text" autoComplete="name" />
            </div>

            <div className="contact-row">
              <label htmlFor={labels.email}>Email cím</label>
              <input
                id={labels.email}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email ? (
                <span className="contact-error">{errors.email}</span>
              ) : null}
            </div>

            <div className="contact-row">
              <label htmlFor={labels.message}>Üzenet</label>
              <textarea
                id={labels.message}
                name="message"
                required
                rows={4}
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message ? (
                <span className="contact-error">{errors.message}</span>
              ) : null}
            </div>

            <div className="contact-honeypot" aria-hidden="true">
              <label htmlFor={labels.honeypot}>Cég</label>
              <input id={labels.honeypot} name="company" type="text" tabIndex={-1} />
            </div>

            <button className="contact-submit" type="submit" disabled={isBusy}>
              {isBusy ? "Küldés..." : "Üzenet küldése"}
            </button>

            <p
              className={`contact-feedback ${hasSuccess ? "is-success" : ""} ${
                hasError ? "is-error" : ""
              }`}
              role="status"
              aria-live="polite"
            >
              {feedback}
            </p>
          </form>
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ProjectFeedbackForm.tsx
git commit -m "feat: add project feedback form component"
```

---

### Task 2: Add “Írd meg” CTA to Lumira Modal

**Files:**
- Modify: `components/lumira/LumiraModalNarrative.tsx`

- [ ] **Step 1: Render the feedback form near CTA**

Update `components/lumira/LumiraModalNarrative.tsx`:
```tsx
import { ProjectFeedbackForm } from "@/components/ProjectFeedbackForm";

// inside LumiraModalNarrative
const formEndpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? "";

const cta = (
  <div className="project-modal__cta-group">
    <a
      className="project-modal__cta lumira-modal__cta"
      href="https://lumira-sage.vercel.app"
      target="_blank"
      rel="noreferrer"
    >
      Fedezd fel
    </a>
    <ProjectFeedbackForm projectTitle={model.brand.name} formEndpoint={formEndpoint} />
  </div>
);
```

- [ ] **Step 2: Commit**

```bash
git add components/lumira/LumiraModalNarrative.tsx
git commit -m "feat: add feedback CTA to lumira modal"
```

---

### Task 3: Add “Írd meg” CTA to Kincstartó Modal

**Files:**
- Modify: `components/kincstarto/KincstartoModalNarrative.tsx`

- [ ] **Step 1: Render the feedback form near CTA**

Update `components/kincstarto/KincstartoModalNarrative.tsx` similarly:
```tsx
import { ProjectFeedbackForm } from "@/components/ProjectFeedbackForm";

// where CTA is rendered
const formEndpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? "";

<div className="project-modal__cta-group">
  <a className="project-modal__cta" href={model.brand.website} target="_blank" rel="noreferrer">
    Fedezd fel
  </a>
  <ProjectFeedbackForm projectTitle={model.brand.name} formEndpoint={formEndpoint} />
</div>
```

- [ ] **Step 2: Commit**

```bash
git add components/kincstarto/KincstartoModalNarrative.tsx
git commit -m "feat: add feedback CTA to kincstarto modal"
```

---

### Task 4: Style the Feedback CTA + Light Form

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add styles**

Add to `app/globals.css`:
```css
.project-modal__cta-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: center;
}

.project-feedback {
  display: grid;
  gap: 12px;
  width: 100%;
}

.project-feedback__cta {
  border-radius: 999px;
  padding: 12px 24px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
  color: inherit;
  font-weight: 600;
  cursor: pointer;
}

.project-feedback__card {
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--text);
}

.project-feedback__intro {
  margin: 0 0 12px;
  color: var(--muted);
}

.project-feedback .contact-submit {
  background: var(--accent);
  color: #fff;
  border-color: transparent;
}
```

- [ ] **Step 2: Manual verification**

Run: `npm run dev`
Expected: “Írd meg” button appears next to “Fedezd fel”, opens a light form, subject sent as project title.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: add project modal feedback CTA"
```

---

## Self-Review Checklist

**Spec coverage:**
- “Írd meg” CTA in all modals — Tasks 2 & 3
- Inline form with intro text — Task 1
- Subject auto-set to project title — Task 1
- Light styling + distinct CTA color — Task 4

**Placeholder scan:** No TODO/TBD placeholders in steps.

**Type consistency:** `ProjectFeedbackFormProps` used consistently.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-13-project-modal-feedback.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
