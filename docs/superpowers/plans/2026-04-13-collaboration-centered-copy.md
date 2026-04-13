# Collaboration Centered Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Center-align all collaboration copy in the “Együttmûködés” block while keeping the inline contact form left-aligned.

**Architecture:** Add a wrapper class to the collaboration block and apply `text-align: center` there, then override the contact card to keep its contents left-aligned. No content changes in code.

**Tech Stack:** Next.js (App Router), React 19, TypeScript, Vitest.

---

## File Structure / Responsibilities

- **Modify:** `components/CollaborationBlock.tsx` — ensure wrapper class exists (already present), no logic changes if already wrapped.
- **Modify:** `app/globals.css` — add centered alignment on collaboration block and left alignment override for contact card.
- **Test:** Manual visual check (no automated test required for CSS alignment).

> Constraint: AGENTS.md requests working directly on `main` and no worktrees, so do not create a worktree even though the default skill suggests it.

---

### Task 1: Add Center Alignment Styles for Collaboration Block

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add styles**

Add to `app/globals.css`:
```css
.collaboration-block {
  text-align: center;
}

.collaboration-block .contact-card {
  text-align: left;
}
```

- [ ] **Step 2: Manual verification**

Run: `npm run dev`
Expected: Collaboration paragraphs, contact rows, and CTA appear centered; the form card remains left-aligned.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: center collaboration copy"
```

---

## Self-Review Checklist

**Spec coverage:**
- Collaboration copy centered — Task 1
- Form card left-aligned — Task 1

**Placeholder scan:** No TODO/TBD placeholders in steps.

**Type consistency:** No type changes.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-13-collaboration-centered-copy.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
