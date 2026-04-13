# Contact Section + External Form Endpoint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a calm contact section after “Együttműködés” with a working form that forwards messages via a free external form endpoint, plus minimal validation and anti-abuse.

**Architecture:** Extend content meta fields for contact copy, render a new client-side `ContactSection` component after the Collaboration section, and submit directly to a configured external form endpoint. Validation lives in a small shared helper with tests.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, CSS in `app/globals.css`.

---

## File Structure

- Modify: `content/portfolio_content_pack.md` (add contact copy in META)
- Modify: `lib/content/types.ts` (extend `Meta` type)
- Modify: `lib/content/parseContent.ts` (add new meta keys)
- Modify: `lib/content/parseContent.test.ts` (cover new meta fields)
- Create: `lib/contact/validateContact.ts` (validation helper)
- Create: `lib/contact/validateContact.test.ts` (unit tests)
- Create: `components/ContactSection.tsx` (form UI + client submit)
- Modify: `app/page.tsx` (render contact section after collaboration)
- Modify: `app/globals.css` (contact form styles)

---

### Task 1: Extend Content Meta + Parsing (TDD)

**Files:**
- Modify: `lib/content/parseContent.test.ts`
- Modify: `lib/content/types.ts`
- Modify: `lib/content/parseContent.ts`
- Modify: `content/portfolio_content_pack.md`

- [ ] **Step 1: Write failing test for new meta fields**

Update the `SAMPLE` block and assertions to include contact fields.

```ts
// lib/content/parseContent.test.ts
const SAMPLE = `## META

title: Test Title
role: Test Role
language: hu

tagline:
Rovid tagline.

intro:
Elso bekezdes.

Masodik bekezdes.

about:
About szoveg.

approach:
Approach szoveg.

collaboration:
Collab szoveg.

contact_title:
Irj nyugodtan

contact_intro:
Rovid intro.

contact_helper:
Helper szoveg.

contact_submit_label:
Uzenet kuldese

---

## FEATURED PROJECTS

---

### demo

// ... unchanged ...
`;

it("parses meta and projects", () => {
  const content = parseContent(SAMPLE);
  expect(content.meta.title).toBe("Test Title");
  expect(content.meta.contactTitle).toBe("Irj nyugodtan");
  expect(content.meta.contactIntro).toBe("Rovid intro.");
  expect(content.meta.contactHelper).toBe("Helper szoveg.");
  expect(content.meta.contactSubmitLabel).toBe("Uzenet kuldese");
  expect(content.featuredProjects).toHaveLength(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- lib/content/parseContent.test.ts`

Expected: FAIL because `contactTitle` (and others) are missing from `Meta`.

- [ ] **Step 3: Update `Meta` type and parsing keys**

```ts
// lib/content/types.ts
export type Meta = {
  title: string;
  role: string;
  language: string;
  tagline: string;
  intro: string;
  about: string;
  approach: string;
  approachItems: string[];
  collaboration: string;
  contactTitle: string;
  contactIntro: string;
  contactHelper: string;
  contactSubmitLabel: string;
};
```

```ts
// lib/content/parseContent.ts
const META_KEYS = [
  "title",
  "role",
  "language",
  "tagline",
  "intro",
  "about",
  "approach",
  "collaboration",
  "contact_title",
  "contact_intro",
  "contact_helper",
  "contact_submit_label"
] as const;

// ...
for (const key of META_KEYS) {
  const value = values[key]?.value ?? "";
  switch (key) {
    case "contact_title":
      meta.contactTitle = value;
      break;
    case "contact_intro":
      meta.contactIntro = value;
      break;
    case "contact_helper":
      meta.contactHelper = value;
      break;
    case "contact_submit_label":
      meta.contactSubmitLabel = value;
      break;
    default:
      meta[key] = value as Meta[Exclude<keyof Meta, "approachItems">];
  }
}
```

- [ ] **Step 4: Add contact copy to the content pack**

```md
# content/portfolio_content_pack.md (inside ## META)

contact_title:
Írj nyugodtan

contact_intro:
Ha bármelyik projekt felkeltette az érdeklődésed, vagy van egy ötleted, amin együtt gondolkodnál, küldj üzenetet.

contact_helper:
Az üzeneted közvetlenül megkapom emailben. Ha megadsz email címet, válaszolni is tudok rá.

contact_submit_label:
Üzenet küldése
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test -- lib/content/parseContent.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/content/types.ts lib/content/parseContent.ts lib/content/parseContent.test.ts content/portfolio_content_pack.md
git commit -m "feat: add contact meta fields"
```

---

### Task 2: Add Validation Helper (TDD)

**Files:**
- Create: `lib/contact/validateContact.ts`
- Create: `lib/contact/validateContact.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// lib/contact/validateContact.test.ts
import { describe, expect, it } from "vitest";
import { validateContact } from "./validateContact";

describe("validateContact", () => {
  it("requires message", () => {
    const result = validateContact({ message: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.message).toBeDefined();
  });

  it("accepts empty email", () => {
    const result = validateContact({ message: "Szia" });
    expect(result.valid).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = validateContact({ message: "Szia", email: "bad-email" });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- lib/contact/validateContact.test.ts`

Expected: FAIL (module not found).

- [ ] **Step 3: Implement minimal validation helper**

```ts
// lib/contact/validateContact.ts
export type ContactValidationInput = {
  message: string;
  email?: string;
};

export type ContactValidationResult = {
  valid: boolean;
  errors: { message?: string; email?: string };
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(
  input: ContactValidationInput
): ContactValidationResult {
  const errors: ContactValidationResult["errors"] = {};

  if (!input.message || input.message.trim().length === 0) {
    errors.message = "Az üzenet megadása kötelező.";
  }

  if (input.email && !EMAIL_REGEX.test(input.email.trim())) {
    errors.email = "Kérlek, érvényes email címet adj meg.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- lib/contact/validateContact.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/contact/validateContact.ts lib/contact/validateContact.test.ts
git commit -m "feat: add contact validation"
```

---

### Task 3: Create ContactSection Component

**Files:**
- Create: `components/ContactSection.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Implement ContactSection component**

```tsx
// components/ContactSection.tsx
"use client";

import { useId, useMemo, useState } from "react";
import { Meta } from "@/lib/content/types";
import { validateContact } from "@/lib/contact/validateContact";

type Status = "idle" | "loading" | "success" | "error";

type ContactSectionProps = {
  meta: Meta;
  formEndpoint: string;
};

export function ContactSection({ meta, formEndpoint }: ContactSectionProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ message?: string; email?: string }>(
    {}
  );
  const [feedback, setFeedback] = useState<string>("");
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
      honeypot: `contact-company-${formId}`
    }),
    [formId]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formEndpoint) {
      setStatus("error");
      setFeedback("A küldés most nem érhető el.");
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
      setFeedback("Kérlek, ellenőrizd a mezőket.");
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
      setFeedback("Most nem sikerült elküldeni. Próbáld újra később.");
    }
  }

  return (
    <div className="contact-card">
      <p className="contact-intro">{meta.contactIntro}</p>

      <form className="contact-form" onSubmit={handleSubmit}>
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
  );
}
```

- [ ] **Step 2: Add minimal styles**

```css
/* app/globals.css */
.contact-card {
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 24px;
  background: var(--card);
  display: grid;
  gap: 20px;
}

.contact-intro {
  margin: 0;
  color: var(--muted);
  font-size: 16px;
}

.contact-form {
  display: grid;
  gap: 16px;
}

.contact-row {
  display: grid;
  gap: 6px;
}

.contact-row label {
  font-weight: 600;
  font-size: 14px;
}

.contact-row input,
.contact-row textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--line);
  padding: 12px 14px;
  font: inherit;
  color: var(--text);
  background: #fff;
}

.contact-row textarea {
  resize: vertical;
  min-height: 160px;
}

.contact-row input:focus-visible,
.contact-row textarea:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.contact-honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.contact-submit {
  justify-self: start;
  border-radius: 999px;
  padding: 10px 22px;
  border: 1px solid var(--line);
  background: #fff;
  font-weight: 600;
  cursor: pointer;
}

.contact-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.contact-helper {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
}

.contact-feedback {
  margin: 0;
  font-size: 14px;
  min-height: 20px;
}

.contact-feedback.is-success {
  color: var(--accent);
}

.contact-feedback.is-error {
  color: #b63b3b;
}

@media (max-width: 600px) {
  .contact-card {
    padding: 20px;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ContactSection.tsx app/globals.css
git commit -m "feat: add contact section component"
```

---

### Task 4: Render Contact Section on Home Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Render new section after Collaboration**

```tsx
// app/page.tsx
import { ContactSection } from "@/components/ContactSection";

// ... inside HomePage return

<SectionBlock title={content.meta.contactTitle} id="kontakt">
  <ContactSection
    meta={content.meta}
    formEndpoint={process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? ""}
  />
</SectionBlock>
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: render contact section"
```

---

## Self-Review

- Spec coverage: Content fields, UI, validation, honeypot, success/error states, and external endpoint are all covered.
- Placeholder scan: No TODO/TBD placeholders.
- Type consistency: Contact meta field names match across types, parser, and usage.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-13-contact-section-implementation.md`. Two execution options:

1. Subagent-Driven (recommended) - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. Inline Execution - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
