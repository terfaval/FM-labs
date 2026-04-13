# Contact Section Inside Együttmûködés (Centered CTA)

Date: 2026-04-13

## Summary
Move the contact experience into the existing “Együttmûködés” section and remove the separate Kontakt section entirely. The block becomes a single-column flow: collaboration copy, fixed contact rows, a centered CTA button, and an inline contact form card that toggles open. The text/contact/CTA group is centered; the form remains left-aligned in its card. The CTA uses a new warm terracotta tone.

## Goals
- Keep the contact UI calm, readable, and consistent with existing typography.
- Keep the contact UI inside the existing “Együttmûködés” section (no separate Kontakt section).
- Allow visitors to send a message that arrives at the owner’s email.
- If the visitor provides an email, reply-to should use that address.
- Keep deployment compatible with Vercel Hobby and avoid databases.
- Keep UI minimal, accessible, and consistent with existing styles.

## Non-Goals
- No CRM, inbox, or admin UI.
- No database or persistent storage.
- No complex anti-spam tooling beyond lightweight measures.
- No modal or overlay UX.

## Architecture
- Keep the `SectionBlock` for “Együttmûködés” and render the contact UI there.
- Remove the separate “Kontakt” section entirely.
- Replace the current Collaboration block content with:
  - Collaboration text (from content pack)
  - 3 fixed contact rows (phone, email, LinkedIn)
  - Centered CTA button that toggles the form card inline
  - Contact form card hidden by default, shown after CTA click
- The form submits directly to an external endpoint (Formspree or similar).
- No new Next.js API routes.

## Content Source of Truth
- Collaboration copy continues to come from `content/portfolio_content_pack.md`.
- Contact links (phone/email/linkedin) are fixed values (not content-driven).
- Contact form copy uses contact-related meta fields:
  - `contactTitle` (no longer used in UI)
  - `contactIntro`
  - `contactHelper`
  - `contactSubmitLabel`

## Contact Rows (Centered Group)
- Phone: `+36308269351` (tel: link)
- Email: `mate.fater@gmail.com` (mailto: link)
- LinkedIn: `https://www.linkedin.com/in/matefater/` (opens in new tab)

## CTA Behavior
- Button label:
  - Closed: “Lépjünk kapcsolatba”
  - Open: “Bezárás”
- Toggling is client-side; no page navigation.

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
- Single-column layout inside the Együttmûködés section.
- Collaboration text, contact rows, and CTA button centered.
- Contact form card remains left-aligned and uses existing `contact-card` styling.
- CTA uses a new warm terracotta tone (new CSS variable).
- No new animations introduced.
- Mobile: stack everything vertically (default behavior).

## Testing & Verification
- Manual testing:
  - Toggle CTA open/close
  - Submit with/without optional fields
  - Validate loading, success, error states
  - Confirm honeypot blocks submission
  - Verify reply-to behavior via provider

## Rollout Notes
- External endpoint configured with the target email.
- Public email + phone intentionally displayed as requested.
- Confirm the form endpoint and any required hidden fields once provider is selected.
