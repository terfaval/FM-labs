# Desk Research Modal: Sample Output Block Recommendation

## Current issues to solve before adding the block
- The modal currently repeats large image sections (B1, B2, B3 steps, B5, B7), so a new full-width screenshot block would increase repetition.
- `lib/content/deskResearchModalModel.ts` uses fallback mapping for missing media refs, so many sections can end up showing the same `modal background.png` visual.
- The current narrative already has strong workflow + principles + delivery content; the sample section should be compact, browseable, and clearly separated as "example output".

## Recommended placement
Place the new section **after BLOCK_07 (Kutatásból delivery)** and **before BLOCK_08 mood + BLOCK_09 future**.

Why this placement works:
- BLOCK_07 explains deliverables conceptually.
- The sample block proves that deliverable structure with concrete preview.
- Mood/future/closing remains reflective and not overly operational.

## Recommended section structure
Title: `Minta kutatási output`

Intro: use the provided Swiss brand-collaboration mapping context copy (shortened to 2 paragraphs max).

Then show 2 tabs (preferred) or 2 stacked panels on mobile:
- `Quantity pipeline` — `quantity_data.xlsx`
- `Quality pipeline` — `quality_data.xlsx`

Each tab:
- Subheader text (short)
- Compact table preview (20–50 rows max)
- 6–7 selected columns only
- Horizontal scroll allowed
- Optional quick text filter (if trivial)

Below the tabs/panels:
- 2–4 record cards from real rows
- concise fields only
- no raw URL fields, no sensitive notes

## Workbook field mapping (based on actual files)

### Quantity (`public/deskresearch/sample/quantity_data.xlsx`)
Use these columns:
- `name`
- `city`
- `entity_type`
- `fit_score`
- `quantity_status`
- `legal_eligibility_status`
- `rationale` (truncate)

Do not show:
- `source_url_*`
- `client_compliance_notes`
- `legal_notes` (full text)
- `email`, `phone`, exact addresses unless needed

### Quality (`public/deskresearch/sample/quality_data.xlsx`)
Use these columns:
- `name`
- `city`
- `entity_type` or `subtype`
- `legal_feasibility_status`
- `fit_score`
- `collaboration_potential`
- `rationale` (truncate)

Optional small extra field if needed:
- `source_quality`

Do not show:
- `source_url_*`
- `client_compliance_notes`
- raw `gm_*` diagnostic fields
- exact coordinates/technical enrichment internals

## Recommended implementation approach
Create a sanitized local content model:
- `lib/content/deskResearchSampleOutput.ts`

Content of this file:
- metadata (`title`, intros, pipeline labels/subtitles)
- selected table columns
- selected preview rows (capped)
- 2–4 record cards for each pipeline (or shared)

Data generation path:
- Build-time/local extraction from `quantity_data.xlsx` and `quality_data.xlsx`
- Save only sanitized fields to TS/JSON
- Render modal from sanitized model

Note to include in code:
- `TODO: confirm whether full sample export can be public`

## Suggested UI components/patterns to reuse
From current codebase:
- `lumira-modal__icon-grid` style card rhythm (for record cards)
- `lumira-modal__next-card` visual language (for compact record summaries)
- `mirachai` structured text style for explanatory paragraph formatting

New minimal additions (DeskResearch-specific):
- tab switcher (`quantity` / `quality`)
- lightweight table wrapper with horizontal scroll
- status chips + score badge styles

## Suggested icon list for the sample block
- `Table2` (table preview)
- `Rows3` (pipeline rows)
- `ClipboardCheck` (validation)
- `FileSpreadsheet` (export)
- `ShieldCheck` (compliance-aware feasibility)
- `SearchCheck` (review readiness)

## Needed asset list (for this ticket)
No new image assets are strictly required.

Optional later additions:
- small anonymized sheet thumbnail PNG for quick visual anchor
- small legend icon strip (status meanings)

## Suggested location for anonymized sample export/download
Inside the sample output block footer:
- button/link: `Minta export (anonimizált)`
- opens/downloads a curated static sample (not full raw workbook by default)

If direct workbook links are needed, keep them secondary and clearly labeled as sample-only.

## Suggested location for “service packages / starting points”
Not in this ticket’s block itself.

Best placement for later:
- After BLOCK_09 (Future directions), before closing CTA.
- Format: 3 compact cards (`Discovery sprint`, `Workflow setup`, `Ongoing operations`) without pricing table tone.

This keeps the current modal editorial and capability-first, not sales-page-like.
