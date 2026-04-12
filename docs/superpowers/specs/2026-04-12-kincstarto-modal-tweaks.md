# Kincstartó Modal Visual Tweaks (Kincstartó-only)

Date: 2026-04-12  
Scope: **Kincstartó project modal only** (no changes to other project modals)

## Goal
Refine Kincstartó modal typography, colors, image composition, and CTA glow while keeping the existing Lumira-based component structure.

## Constraints
- Applies only to Kincstartó (`project.slug === "kincstarto"`).
- Use existing Lumira modal components; no new layout system.
- Keep layout calm, minimal, lots of whitespace.
- Lumira retains Space Grotesk; Kincstartó uses default fonts.

## Changes

### 1) Brand / Intro Typography & Color
- Kincstartó **BrandIntro** uses default font (no Space Grotesk).
- Logo + name + tagline **black**.

### 1b) Modal Background
- Kincstartó modal background uses `public/kincstarto/modal_background.png`.

### 2) Icon Grid & Mood Block Colors
- **Működési elv** icons + text **black**.
- **Mood block** text **black**.

### 2b) Section Icons
- Add block icons above titles in **Könyvtár / Meditáció / Jóga** split sections.
- Icons from `public/kincstarto/icons/`: `library.svg`, `meditations.svg`, `yoga.svg`.

### 3) Image Pair Composition (Split Sections)
- Two images are **grouped** and **vertically centered** in the split block.
- Use a **main image + small thumbnail** layout to avoid visual clutter.
- Primary image stays dominant; secondary becomes a small corner thumbnail.
- If image column is **right**: thumbnail sits at **bottom-right** of the primary.
- If image column is **left**: thumbnail sits at **bottom-left** of the primary.

### 3b) Project Card Proportions
- Kincstartó featured card uses the **same split proportions as Lumira** (text column width matches Lumira).

### 4) Next Directions Cards
- Remove **“Jóga tudástér mélyítése”** card.

### 5) CTA Glow
- CTA shadow/glow should match the button gradient (use `--cta-from/--cta-to`), not a blue-tinted glow.

## Acceptance Criteria
- Kincstartó BrandIntro uses default font and black text/logo.
- Kincstartó icon grid and mood block use black text/icons.
- Split section images are paired, diagonally offset per side, smaller, and vertically centered as a group.
- Split section titles show the correct icons above them.
- Next directions list excludes “Jóga tudástér mélyítése”.
- CTA glow matches button colors.
- Kincstartó modal background uses `modal_background.png`.
- Kincstartó featured card proportions match Lumira.
- No changes to non-Kincstartó modals.

