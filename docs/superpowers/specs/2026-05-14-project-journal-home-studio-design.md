# Project Journal Home + Studio Design (v1)

Date: 2026-05-14
Scope: Portfolio app, main-page journal list + hidden studio editor.

## 1. Goal

Implement a content-first Project Journal feature that:
- shows published entries on the homepage (no separate `/journal` page in v1),
- allows creating and editing entries in a hidden studio UI,
- stores data in `content/journal/journal.json`,
- keeps storage abstraction ready for later Vercel Blob migration.

## 2. Non-goals (v1)

- No public standalone journal route.
- No full auth system.
- No comments, search, multi-filter complexity, analytics.
- No extra product features outside journal list + studio editor.

## 3. Routes

- `GET /`  
  Homepage includes a new `Project Journal` section.
- `GET /studio-login`  
  Key-based login page for studio access.
- `GET /studio/journal`  
  Hidden admin/editor page (requires valid studio session).

## 4. Data model

Single source file:
- `content/journal/journal.json`

Top-level shape:

```json
{
  "schemaVersion": "v1",
  "entries": []
}
```

Entry shape:

```json
{
  "id": "string",
  "date": "YYYY-MM-DD",
  "project": "portfolio | lumira | szarnyfeszito | mirachai | novira | kincstarto | urbanecolab | desk-research",
  "type": "planning | feature | visual | refinement | research | decision",
  "status": "draft | published",
  "title": "string",
  "summary": "string",
  "body": "string",
  "steps": [
    { "label": "string", "text": "string" }
  ],
  "nextStep": "string",
  "featured": false
}
```

Validation rules:
- `id` required, unique.
- `date` required, `YYYY-MM-DD`.
- `project`, `type`, `status` required enums.
- `title`, `summary`, `body`, `nextStep` required non-empty strings.
- `steps` required array; each item needs `label` + `text`.

## 5. Storage architecture

Introduce storage interface to keep migration easy:
- `JournalStore` interface: `listAll`, `listPublished`, `upsert`, `getById`.
- `FileJournalStore` implementation for v1:
  - read/write `content/journal/journal.json`,
  - atomic writes (temp file + rename),
  - stable date-desc sorting for read output.

Later Blob migration:
- add `BlobJournalStore` with same interface,
- swap provider wiring without touching UI/API contracts.

## 6. Homepage journal UX

Add a new section on homepage:
- Title: `Project Journal`
- Content: list of published entries only, sorted newest first.

Collapsed item shows:
- date
- project tag
- type tag
- title

Expanded item shows:
- summary
- body
- steps (mini list)
- next step

Filtering:
- one `project` filter (`all` + one fixed project),
- one `type` filter (`all` + one fixed type),
- combined filtering (both applied together).

Style:
- calm, readable, minimal visual weight,
- tags are the primary differentiator,
- no animation requirement.

## 7. Studio UX

### 7.1 Login

- `studio-login` page with key input.
- Submitted key checked against `JOURNAL_STUDIO_KEY`.
- Success sets session cookie and redirects to `/studio/journal`.

### 7.2 Studio page

Single page with:
- existing entries list (all statuses),
- new entry creation,
- existing entry edit,
- JSON draft paste + parse,
- `Save Draft` and `Publish` actions.

Editor fields:
- id, date, project, type, title, summary, body, steps, nextStep, featured.

Status behavior:
- `Save Draft` => `status = draft`
- `Publish` => `status = published`

## 8. API design

- `POST /api/studio/login`  
  input: `{ key }`, sets session cookie if valid.
- `POST /api/studio/logout`  
  clears session cookie.
- `GET /api/journal`  
  returns published entries only.
- `GET /api/studio/journal`  
  returns all entries (auth required).
- `POST /api/studio/journal`  
  creates new entry, validates, writes file (auth required).
- `PUT /api/studio/journal/:id`  
  updates existing entry, validates, writes file (auth required).

Auth guard:
- route-level check for `/studio/journal` and studio API endpoints using secure cookie.

## 9. Error handling

- Validation errors return 4xx with field error details.
- Auth failures return 401/403.
- Storage failures return 500 with generic message.
- Atomic write protects file consistency on failure.

## 10. Test plan (v1)

Unit tests:
- journal schema validation (required fields, enum checks, date format).
- file store read/write behavior.
- published-only filtering.

Component/UI tests:
- homepage journal item expand/collapse behavior.
- filter behavior (project/type).

## 11. Implementation sequence

1. Add journal types/constants/validation and storage layer.
2. Add journal API endpoints (+ auth cookie handling).
3. Build `/studio-login` + `/studio/journal` pages.
4. Build homepage `Project Journal` section with filters + expand items.
5. Add tests.
6. Seed `content/journal/journal.json` with valid `v1` root structure.

## 12. Acceptance criteria

- Homepage shows only published entries with project/type/date/title and expandable full content.
- Project/type filters work correctly.
- `studio-login` protects studio access via key-based session.
- `/studio/journal` can create, edit, draft, publish entries.
- Data is persisted to `content/journal/journal.json`.
- Design stays content-first and scoped to this feature.
