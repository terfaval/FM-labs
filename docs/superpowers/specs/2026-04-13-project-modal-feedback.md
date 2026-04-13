# Project Modal "Írd meg" Inline Contact

Date: 2026-04-13

## Summary
Add a secondary “Írd meg” button next to the existing “Fedezd fel” CTA in every project modal. Clicking it reveals a lightweight inline contact form inside the modal. The form omits the subject field; submissions set the subject to the project title. Uses the existing external form endpoint.

## Goals
- Provide a quick feedback path per project (bug reports, observations).
- Keep the UI minimal and consistent with existing modal styling.
- Reuse the existing external form endpoint.

## Non-Goals
- No modal overlays within modals.
- No new backend routes.
- No additional content changes.

## Architecture
- Add an inline feedback form component used inside project modals.
- Keep it lightweight: intro text, name/email/message, and submit.
- Subject is implicit: project title.

## UX Copy
Intro text (can be refined):
“Ha hibát találtál vagy van egy észrevételed, itt gyorsan jelezheted.”

## Behavior
- “Írd meg” button toggles the inline form open/closed.
- Button label switches to “Bezárás” when open.
- Form submission uses `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT`.
- Subject is set to the project title.

## Form Fields
- Name (optional)
- Email (optional, recommended)
- Message (required)
- Hidden subject (project title)
- Honeypot field (hidden)

## Validation
- Message required.
- If email provided, basic format validation.

## Styling
- “Írd meg” button uses a distinct, muted color from “Fedezd fel”.
- Inline form card is lighter than the main contact card (reduced padding/border weight).

## Testing & Verification
- Manual: open any modal, toggle “Írd meg”, verify form shows and submits.

