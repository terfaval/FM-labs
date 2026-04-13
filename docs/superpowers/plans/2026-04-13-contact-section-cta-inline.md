# Contact Section CTA Inline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the always-visible contact form with a CTA-triggered inline reveal inside the Kontakt section, keeping the section single-column and the form in a card.

**Architecture:** Keep `ContactSection` as the main UI for the Kontakt section. Add a CTA toggle that reveals the form card inline and insert fixed contact rows above the CTA. Styling stays in `app/globals.css` using existing contact-card patterns with minimal new classes.

**Tech Stack:** Next.js (App Router), React 19, TypeScript, Vitest.

---

## File Structure / Responsibilities

- **Modify:** `components/ContactSection.tsx` — add CTA toggle, contact rows, and conditional form card rendering.
- **Modify:** `app/globals.css` — add minimal styles for contact rows + CTA wrapper; reuse existing contact-card styles.
- **Modify:** `vitest.config.ts` — switch test environment to jsdom and add setup file.
- **Create:** `vitest.setup.ts` — add jest-dom matchers.
- **Create:** `components/ContactSection.test.tsx` — test CTA toggle reveals form card.
- **Modify:** `package.json` — add React Testing Library + jsdom dev deps.

> Constraint: AGENTS.md requests working directly on `main` and no worktrees, so do not create a worktree even though the default skill suggests it.

---

### Task 1: Add Test Tooling for React Component Tests

**Files:**
- Modify: `package.json`
- Modify: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Add test dependencies**

Update `package.json` devDependencies to include:
```json
{
  "@testing-library/jest-dom": "^6.4.8",
  "@testing-library/react": "^16.0.0",
  "jsdom": "^24.0.0"
}
```

- [ ] **Step 2: Update Vitest config to jsdom + setup file**

Update `vitest.config.ts` to:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    passWithNoTests: true
  }
});
```

- [ ] **Step 3: Add Vitest setup file**

Create `vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Install dependencies**

Run: `npm install`
Expected: packages installed, no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "test: add react component testing setup"
```

---

### Task 2: Write Failing Test for CTA Toggle Behavior

**Files:**
- Create: `components/ContactSection.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/ContactSection.test.tsx`:
```tsx
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContactSection } from "./ContactSection";

const meta = {
  contactTitle: "Kontakt",
  contactIntro: "Írj pár sort.",
  contactHelper: "Válaszolok 1-2 napon belül.",
  contactSubmitLabel: "Küldés",
  collaboration: ""
} as const;

describe("ContactSection", () => {
  it("reveals the contact form card after CTA click", () => {
    render(<ContactSection meta={meta} formEndpoint="https://example.com" />);

    expect(screen.queryByRole("form")).toBeNull();

    const cta = screen.getByRole("button", { name: "Lépjünk kapcsolatba" });
    fireEvent.click(cta);

    expect(screen.getByRole("form")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/ContactSection.test.tsx`
Expected: FAIL because the CTA and form toggle do not exist yet.

- [ ] **Step 3: Commit**

```bash
git add components/ContactSection.test.tsx
git commit -m "test: add failing contact section CTA toggle test"
```

---

### Task 3: Implement CTA Toggle + Inline Contact Card

**Files:**
- Modify: `components/ContactSection.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Update ContactSection layout + toggle**

Modify `components/ContactSection.tsx` to:
```tsx
"use client";

import { useId, useMemo, useState } from "react";
import { Meta } from "@/lib/content/types";
import { validateContact } from "@/lib/contact/validateContact";

type Status = "idle" | "loading" | "success" | "error";

type ContactSectionProps = {
  meta: Meta;
  formEndpoint: string;
};

const CONTACT_LINKS = [
  { label: "Telefon", value: "+36308269351", href: "tel:+36308269351" },
  { label: "Email", value: "mate.fater@gmail.com", href: "mailto:mate.fater@gmail.com" },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/matefater",
    href: "https://www.linkedin.com/in/matefater/"
  }
] as const;

export function ContactSection({ meta, formEndpoint }: ContactSectionProps) {
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
      name: `contact-name-${formId}`,
      email: `contact-email-${formId}`,
      subject: `contact-subject-${formId}`,
      message: `contact-message-${formId}`,
      honeypot: `contact-company-${formId}`,
      panel: `contact-panel-${formId}`
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
    <div className="contact-section">
      <p className="contact-intro">{meta.contactIntro}</p>

      <div className="contact-links">
        {CONTACT_LINKS.map((link) => (
          <div className="contact-link" key={link.label}>
            <span className="contact-link__label">{link.label}</span>
            <a
              href={link.href}
              target={link.label === "LinkedIn" ? "_blank" : undefined}
              rel={link.label === "LinkedIn" ? "noreferrer" : undefined}
            >
              {link.value}
            </a>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="contact-cta"
        aria-expanded={isOpen}
        aria-controls={labels.panel}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? "Bezárás" : "Lépjünk kapcsolatba"}
      </button>

      {isOpen ? (
        <div className="contact-card" id={labels.panel}>
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
              {errors.email ? <span className="contact-error">{errors.email}</span> : null}
            </div>

            <div className="contact-row">
              <label htmlFor={labels.subject}>Tárgy</label>
              <input id={labels.subject} name="subject" type="text" />
            </div>

            <div className="contact-row">
              <label htmlFor={labels.message}>Üzenet</label>
              <textarea
                id={labels.message}
                name="message"
                required
                rows={6}
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
              {isBusy ? "Küldés..." : meta.contactSubmitLabel}
            </button>

            <p className="contact-helper">{meta.contactHelper}</p>

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

- [ ] **Step 2: Add minimal styles for links + CTA**

Update `app/globals.css` with:
```css
.contact-section {
  display: grid;
  gap: 16px;
}

.contact-links {
  display: grid;
  gap: 10px;
}

.contact-link {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  align-items: baseline;
  color: var(--muted);
}

.contact-link__label {
  font-weight: 600;
  color: var(--text);
}

.contact-cta {
  justify-self: start;
  border-radius: 999px;
  padding: 10px 22px;
  border: 1px solid var(--line);
  background: #fff;
  font-weight: 600;
  cursor: pointer;
}

.contact-cta:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

- [ ] **Step 3: Run tests to verify they pass**

Run: `npm test -- components/ContactSection.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/ContactSection.tsx app/globals.css
git commit -m "feat: toggle contact form inline under CTA"
```

---

## Self-Review Checklist

**Spec coverage:**
- CTA toggles inline form card in Kontakt section — Task 3
- Fixed contact rows above CTA — Task 3
- Single-column layout and minimal styling — Task 3
- Form behavior, honeypot, validation preserved — Task 3
- External endpoint remains — Task 3

**Placeholder scan:** No TODO/TBD placeholders in steps.

**Type consistency:** `ContactSection` props unchanged; labels and state names consistent across steps.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-13-contact-section-cta-inline.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
