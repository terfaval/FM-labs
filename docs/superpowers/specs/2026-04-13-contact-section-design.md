# Contact Section + Email Forwarding (External Form Endpoint)

Date: 2026-04-13

## Summary
Add a minimalist contact section after the “Együttműködés” block. The form submits directly to a free external form endpoint (Formspree or equivalent), avoiding domain verification and keeping the Vercel Hobby deployment simple. The content remains the source of truth in the markdown content pack.

## Goals
- Provide a clean, calm contact module that fits the current portfolio style.
- Allow visitors to send a message that arrives at the owner’s email.
- If the visitor provides an email, reply-to should use that address.
- Keep deployment compatible with Vercel Hobby and avoid databases.
- Keep UI minimal, accessible, and consistent with existing typography.

## Non-Goals
- No CRM, inbox, or admin UI.
- No database or persistent storage.
- No complex anti-spam tooling beyond lightweight measures.

## Architecture
- Add a new `ContactSection` component rendered after the Collaboration section on the homepage.
- The form submits directly to an external endpoint (Formspree or similar) to forward emails.
- No new Next.js API routes in the initial version (simplifies hosting and avoids domain constraints).

## Content Source of Truth
- Extend `content/portfolio_content_pack.md` META section with contact section copy:
  - contactTitle
  - contactIntro
  - contactHelper
  - contactSubmitLabel
- The copy is rendered verbatim; no re-writing or implicit changes.

## Form Fields
- Name (optional)
- Email (optional, recommended)
- Subject (optional)
- Message (required)
- Honeypot field (hidden)

## UX & Validation
- Client-side validation:
  - Message required
  - If email is provided, validate basic email format
- States:
  - Idle
  - Loading (disable submit)
  - Success (quiet confirmation)
  - Error (quiet retry guidance)

## Anti-Abuse
- Honeypot field; if filled, block submission.
- Optional lightweight rate-limiting only if needed later; not in this version.

## Email Behavior (Provider Side)
- Subject template: `[Portfolio kapcsolat] {subject or “Üzenet”}`
- Body includes:
  - Name
  - Email
  - Subject
  - Message
  - Timestamp
  - User agent (if readily available; optional)
- Reply-To set to visitor email if provided.

## Accessibility
- Proper labels for all fields.
- Visible focus states.
- Keyboard navigation supported.
- Textarea size and spacing to support comfortable reading and editing.

## Testing & Verification
- Manual testing:
  - Fill and submit with/without optional fields
  - Validate loading, success, error states
  - Confirm honeypot blocks submission
  - Verify reply-to behavior via provider

## Rollout Notes
- External endpoint configured with the target email.
- No public email address shown in UI.
- Confirm the form endpoint and any required hidden fields once provider is selected.

