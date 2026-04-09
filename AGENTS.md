# AGENTS.md — FM-Lab

Purpose:
Define how the development agent (Codex) should work on this repository.

This project is a **content-driven portfolio web app**.
The content is the source of truth, not the code.

---

## Prime Directive

Do not invent features.
Do not reinterpret the product.
Do not redesign the system.

Build only what is defined by:
- the content file
- the active ticket

---

## Source of Truth

1. `/content/portfolio_content_pack.md`
2. Active ticket instructions
3. Existing code structure

If something is unclear:
- do not guess
- implement the simplest valid interpretation

---

## Scope Control

- Work strictly within the ticket
- No extra features
- No refactors outside scope
- No “improvements” unless requested

If something feels missing:
- finish the task anyway
- do not expand scope

---

## Content Handling

- The markdown file is the single source of truth
- Do not rewrite or modify content
- Only parse and display it

If structure is difficult:
- create a simple transform layer
- keep it minimal and readable

---

## Architecture Rules

- Keep everything simple
- No overengineering
- No unnecessary abstractions
- No complex state management
- No backend unless explicitly required

---

## UI Rules

- Focus on readability
- Use whitespace generously
- Avoid heavy styling
- Avoid “startup” design patterns
- No animations unless explicitly requested

This is a calm, structured interface — not a marketing page.

---

## File Creation

Allowed:
- components
- simple parsing utilities
- layout files

Not allowed:
- adding systems (auth, CMS, etc.)
- introducing new architectural layers

---

## Commit Discipline

- Keep commits scoped
- Separate structure changes from styling when possible
- Do not modify unrelated files

---

## Definition of Done

A task is complete when:
- the feature works
- content is correctly rendered
- layout is readable
- no unnecessary complexity was introduced

---

## Operating Principle

Clarity over cleverness.  
Structure over features.  
Content over code.