# Contact Section + Email Forwarding (External Form Endpoint)

Date: 2026-04-13

## Summary
Add a minimalist contact experience embedded inside the existing “Együttműködés” block. The block becomes a two-column layout: the left column shows the collaboration copy plus direct contact links; the right column contains the contact form. The form submits directly to a free external form endpoint (Formspree or equivalent), avoiding domain verification and keeping the Vercel Hobby deployment simple. The content remains the source of truth in the markdown content pack.

## Goals
- Provide a calm, readable contact module that fits the current portfolio style.
- Keep the contact UI inside the existing Collaboration section (no separate section title).
- Allow visitors to send a message that arrives at the owner’s email.
- If the visitor provides an email, reply-to should use that address.
- Keep deployment compatible with Vercel Hobby and avoid databases.
- Keep UI minimal, accessible, and consistent with existing typography.

## Non-Goals
- No CRM, inbox, or admin UI.
- No database or persistent storage.
- No complex anti-spam tooling beyond lightweight measures.

## Architecture
- Keep the `SectionBlock` for “Együttműködés”, but do not render a section title.
- Replace the current `CollaborationBlock` content with a two-column layout:
  - Left: collaboration text + 3 contact rows with icons (phone, email, LinkedIn)
  - Right: contact form
- The form submits directly to an external endpoint (Formspree or similar).
- No new Next.js API routes in the initial version (simplifies hosting and avoids domain constraints).

## Content Source of Truth
- The collaboration copy continues to come from `content/portfolio_content_pack.md`.
- Contact links (phone/email/linkedin) are fixed values (not content-driven).
- Contact form copy uses contact-related meta fields:
  - contactTitle (unused in UI, but may remain for future)
  - contactIntro
  - contactHelper
  - contactSubmitLabel

## Contact Rows (Left Column)
- Phone: `+36308269351` (tel: link)
- Email: `mate.fater@gmail.com` (mailto: link)
- LinkedIn: `https://www.linkedin.com/in/matefater/` (opens in new tab)

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

## Styling
- Two-column grid layout for the Collaboration block.
- Left column text centered; contact rows below with icons and subtle color.
- Right column uses the existing contact card form styling.
- Mobile: stack columns vertically, form below text.

## Testing & Verification
- Manual testing:
  - Fill and submit with/without optional fields
  - Validate loading, success, error states
  - Confirm honeypot blocks submission
  - Verify reply-to behavior via provider

## Rollout Notes
- External endpoint configured with the target email.
- Public email + phone intentionally displayed as requested.
- Confirm the form endpoint and any required hidden fields once provider is selected.

