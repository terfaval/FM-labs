# Urbanecolab Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the `urbanecolab` project to “További projektek” and render a dedicated interactive modal from `content/urban-eco-learning-lab.content.md` without modifying that content file.

**Architecture:** Parse the content file into a typed model on the server, pass the model to the client `ProjectGallery`, and render a dedicated `UrbanEcoLabModalNarrative` component when the selected project slug is `urbanecolab`. Keep parsing tolerant (content is source of truth) and map `media` identifiers to real `public/urbanecolab/icons/*` filenames.

**Tech Stack:** Next.js App Router, React, TypeScript, `next/font/google`, existing modal/layout patterns in `components/ProjectGallery.tsx`.

---

### Task 1: Parse Urbanecolab content into a model

**Files:**
- Create: `lib/content/urbanEcoLabModalTypes.ts`
- Create: `lib/content/parseUrbanEcoLabModal.ts`
- Create: `lib/content/urbanEcoLabModal.ts`
- Create: `lib/content/urbanEcoLabModalModel.ts`

- [ ] Implement a tolerant parser for `content/urban-eco-learning-lab.content.md`:
  - Split sections by `---`.
  - Extract the H1 title (`# ...`) for project title.
  - Parse each `## <section>` block into structured data.
  - Special-cases:
    - `learning-logic` has intro text + items + outro text (duplicate `text:` key).
    - `competencies.items[*].text` spans multiple lines until `media:`.
    - `school-integration.text` uses `text: |` multiline.
  - Provide `resolveIconSrc(media)` mapping to handle filename mismatches (spaces/diacritics).

- [ ] Expose:
  - `loadUrbanEcoLabModalContent()` → raw text
  - `buildUrbanEcoLabModalModel(raw)` → `{ project, tagline, hero, intro, principles, ... }`

### Task 2: Add the project to “További projektek” without editing the base content pack

**Files:**
- Modify: `lib/content/loadContent.ts`

- [ ] After parsing `content/portfolio_content_pack.md`, attempt to load and parse `content/urban-eco-learning-lab.content.md` and append its `project` to `otherProjects` if missing.
- [ ] Keep this optional (do not throw if file missing).

### Task 3: Wire the model into the homepage ProjectGallery modal

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/ProjectGallery.tsx`
- Modify: `lib/content/projectVisuals.ts`

- [ ] In `app/page.tsx`, load/build `urbanecolab` model and pass as `urbanEcoLabModal` prop to `ProjectGallery`.
- [ ] In `components/ProjectGallery.tsx`, add a `slug === "urbanecolab"` branch to render `UrbanEcoLabModalNarrative`.
- [ ] Add `projectVisuals.urbanecolab` with `logo: "/urbanecolab/logo.svg"` (background can be `none`, appUrl empty).

### Task 4: Build the Urbanecolab modal UI + interactions

**Files:**
- Create: `components/urbanecolab/UrbanEcoLabModalNarrative.tsx`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] Modal sections:
  - Brand/hero/intro (standard spacing).
  - Principles: 3-column grid with icons (`/urbanecolab/icons/*`).
  - Learning logic: title + top text + 3 items + bottom text.
  - Competencies: 2-column interactive switcher:
    - left: big image + title + text
    - right: stacked thumbnails (button selects)
    - auto-advance every few seconds, pause on hover of left panel.
  - Age groups: flow-like list; each item has “Bővebben” button opening a popup showing `/urbanecolab/age-groups/Slide{n}.JPG`.
  - Modules: grid layout (up to 6).
  - School integration: 1-slide carousel with chevrons.
  - Mood: simple centered paragraph block.
  - Roadmap: flow-style grid based on available items (content currently has 4; render 4).
  - Closing + open call (always-open `ProjectFeedbackForm`).

- [ ] Montserrat:
  - Add `Montserrat` font in `app/layout.tsx` as `--font-urbanecolab`.
  - Apply to `.urbanecolab-modal`.

### Task 5: Minimal verification

**Run:**
- [ ] `npm.cmd run build` → expected: success

