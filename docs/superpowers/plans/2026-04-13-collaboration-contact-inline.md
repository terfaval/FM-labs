# Collaboration Contact Section Inline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the contact CTA + inline form into the existing “Együttmûködés” section and center the text/contact/CTA while keeping the form left-aligned.

**Architecture:** Keep `ContactSection` as the interactive contact UI component, and render it inside `CollaborationBlock` below the collaboration copy. Remove the separate Kontakt section from `app/page.tsx`. Add minimal CSS for centered contact group + new CTA color variable.

**Tech Stack:** Next.js (App Router), React 19, TypeScript, Vitest.

---

## File Structure / Responsibilities

- **Modify:** `components/CollaborationBlock.tsx` — render collaboration copy plus contact UI.
- **Modify:** `components/ContactSection.tsx` — add optional layout mode for centered header group vs left form.
- **Modify:** `app/page.tsx` — remove the separate Kontakt section.
- **Modify:** `app/globals.css` — add centered layout + new CTA color variable and button styling.
- **Modify:** `components/ContactSection.test.tsx` — update/extend test for centered layout (TDD).

> Constraint: AGENTS.md requests working directly on `main` and no worktrees, so do not create a worktree even though the default skill suggests it.

---

### Task 1: Write Failing Test for Centered Contact Group

**Files:**
- Modify: `components/ContactSection.test.tsx`

- [ ] **Step 1: Write the failing test**

Update `components/ContactSection.test.tsx` to include a new test that asserts the centered wrapper renders when enabled:
```tsx
import React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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

  it("renders a centered header group when centered layout is enabled", () => {
    const { container } = render(
      <ContactSection meta={meta} formEndpoint="https://example.com" centered />
    );

    const group = container.querySelector(".contact-header");
    expect(group).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/ContactSection.test.tsx`
Expected: FAIL because the `centered` prop and `.contact-header` do not exist yet.

- [ ] **Step 3: Commit**

```bash
git add components/ContactSection.test.tsx
git commit -m "test: add centered contact header expectation"
```

---

### Task 2: Implement Centered Header Layout + CTA Color

**Files:**
- Modify: `components/ContactSection.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add `centered` prop + header wrapper**

Update `components/ContactSection.tsx`:
```tsx
"use client";

import { useId, useMemo, useState } from "react";
import { Meta } from "@/lib/content/types";
import { validateContact } from "@/lib/contact/validateContact";

type Status = "idle" | "loading" | "success" | "error";

type ContactSectionProps = {
  meta: Meta;
  formEndpoint: string;
  centered?: boolean;
};

// CONTACT_LINKS unchanged

export function ContactSection({ meta, formEndpoint, centered }: ContactSectionProps) {
  // existing state + handlers

  return (
    <div className={centered ? "contact-section is-centered" : "contact-section"}>
      <div className={centered ? "contact-header" : undefined}>
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
      </div>

      {isOpen ? (
        <div className="contact-card" id={labels.panel}>
          {/* form unchanged */}
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Add new CTA color and centered styles**

Update `app/globals.css`:
```css
:root {
  --bg: #ffffff;
  --text: #1f1c19;
  --muted: #5a524c;
  --line: #e6e0d8;
  --card: #ffffff;
  --accent: #2f6f5e;
  --cta-warm: #d96a43;
}

.contact-section.is-centered {
  align-items: center;
  text-align: center;
}

.contact-header {
  display: grid;
  gap: 16px;
  justify-items: center;
}

.contact-section.is-centered .contact-links {
  justify-items: center;
}

.contact-section.is-centered .contact-link {
  justify-content: center;
}

.contact-section.is-centered .contact-card {
  text-align: left;
  align-self: stretch;
}

.contact-cta {
  background: var(--cta-warm);
  color: #fff;
  border-color: transparent;
}

.contact-cta:hover {
  background: color-mix(in srgb, var(--cta-warm) 88%, #ffffff 12%);
}
```

- [ ] **Step 3: Run tests to verify they pass**

Run: `npm test -- components/ContactSection.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/ContactSection.tsx app/globals.css
git commit -m "feat: add centered contact header and warm CTA"
```

---

### Task 3: Move Contact UI Into Collaboration Section

**Files:**
- Modify: `components/CollaborationBlock.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Render ContactSection inside CollaborationBlock**

Update `components/CollaborationBlock.tsx` to accept `formEndpoint` and render ContactSection below the collaboration copy:
```tsx
import { Meta } from "@/lib/content/types";
import { ContactSection } from "@/components/ContactSection";

function renderParagraphs(text: string) {
  return text.split(/\n\s*\n/).map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ));
}

type CollaborationBlockProps = {
  meta: Meta;
  formEndpoint: string;
};

export function CollaborationBlock({ meta, formEndpoint }: CollaborationBlockProps) {
  return (
    <div className="collaboration-block">
      {renderParagraphs(meta.collaboration)}
      <ContactSection
        meta={meta}
        formEndpoint={formEndpoint}
        centered
      />
    </div>
  );
}
```

- [ ] **Step 2: Remove separate Kontakt section from page**

Update `app/page.tsx`:
```tsx
      <SectionBlock title="Együttmûködés" id="egyuttmukodes">
        <CollaborationBlock
          meta={content.meta}
          formEndpoint={process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? ""}
        />
      </SectionBlock>

      {/* remove the entire Kontakt SectionBlock */}
```

- [ ] **Step 3: Run tests to verify they pass**

Run: `npm test -- components/ContactSection.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/CollaborationBlock.tsx app/page.tsx
git commit -m "feat: embed contact section inside collaboration"
```

---

## Self-Review Checklist

**Spec coverage:**
- Contact moved into Együttmûködés section, Kontakt removed — Task 3
- Centered text/contact/CTA group — Task 2
- CTA warm color — Task 2
- Form left-aligned in card — Task 2
- Fixed contact rows and CTA toggle preserved — Task 2

**Placeholder scan:** No TODO/TBD placeholders in steps.

**Type consistency:** `ContactSectionProps` updated with optional `centered`; usage consistent in CollaborationBlock.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-13-collaboration-contact-inline.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
