# Desk Research modal – capability showcase reframing (design)

Date: 2026-05-21  
Scope: `content/desk-research-tool_modal_patch.md`, Desk Research modal narrative + sample output section.

## Goal

Reframe the Desk Research featured modal into a shorter, clearer, agency-facing **desk research capability showcase**.

Core message:
- A desk research workflow that turns complex research into **structured, reviewable, client-ready delivery**.
- The Swiss brand-collaboration mapping is presented as **one pilot engagement / one sample dataset**, not the system identity.

## Non-goals

- No modal system rebuild.
- No new subsystems / architecture changes.
- No “SaaS landing page” tone, no dashboard gimmicks, no roadmap ending.

## Content-first rule

All narrative copy lives in `content/desk-research-tool_modal_patch.md`. Components should only render.

## Target modal flow

1. Hero
2. Research structure problem
3. Quantity vs quality comparison (conceptual, short)
4. Workflow overview (directional only; visual rhythm; minimal copy)
5. Reference outputs (centerpiece; proof / deliverable preview)
6. Operating principles
7. Service framing (concrete, confident; not corporate)
8. Example research use cases (compact grid/chips; shows reusability)
9. Closing (confident; no roadmap)
10. Contact (practical, calm; invites broader research inquiries)

## Planned implementation

### `content/desk-research-tool_modal_patch.md`

- Compress `HERO` intro and early blocks to reduce repetition.
- `BLOCK_03` (workflow-journey): keep icons; reduce step texts to single-sentence directional descriptions.
- Replace the “service-copy” meaning (currently hardcoded in component) with a dedicated content block (reuse existing blocks rather than adding new architecture).
- Repurpose `BLOCK_09` from “roadmap-cards” into “use case examples” (no future framing).
- Add a new `## CONTACT` section with `intro:` to drive the contact paragraph (HU-first).
- Tighten `CLOSING` to land on applicability and confidence.

### `lib/content/deskResearchModalModel.ts`

- Parse `## CONTACT` → `contact: { intro: string }` in the model.
- Keep existing block parsing intact; avoid new complex parsing.

### `components/deskresearch/DeskResearchModalNarrative.tsx`

- Reorder rendered blocks to match the target flow (without changing the modal framework).
- Reference outputs:
  - Remove `.deskresearch-sample__comparison` entirely.
  - Keep report cards; reframe fields away from “dashboard/status distribution” toward research scope/value.
  - Only the **Client-ready export** card has preview CTAs (Quantity/Quality), both with arrow icon and opening the spreadsheet preview modal.
- Remove hardcoded service-copy + contact intro; render from content model.
- Skip rendering empty/removed blocks defensively (no blank sections).

### `lib/content/deskResearchSampleOutput.ts`

- HU-first: set the main title/subtitle to Hungarian-first (keep English as secondary).
- Keep the sample dataset as-is; no new data.

### `app/globals.css`

- Normalize width rhythm: introduce one consistent “wide” wrapper for the workflow grid + report-card grid if needed, while keeping text sections aligned.
- No heavy styling, no animations.

## Acceptance criteria mapping

- Noticeably shorter narrative (target ~25–35% less explanatory text).
- Reference Outputs is the centerpiece.
- Comparison cards removed inside Reference Outputs.
- Report cards feel research-oriented; CTAs only on Client-ready export.
- Workflow is more visual, less explanatory.
- Swiss example reads as one pilot dataset, not identity.
- Layout widths feel editorial and consistent; works on desktop + mobile.

