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

### 2) Icon Grid & Mood Block Colors
- **Működési elv** icons + text **black**.
- **Mood block** text **black**.

### 3) Image Pair Composition (Split Sections)
- Two images are **grouped** and **vertically centered** in the split block.
- Images slightly **smaller** than full width.
- If image column is **right**: second image is **down-left** and **smaller**.
- If image column is **left**: second image is **down-right** and **smaller**.
- **Overlap amount:** ~40% (secondary overlaps primary by about 40%).
- **Secondary size:** ~50% of the primary width.

### 4) Next Directions Cards
- Remove **“Jóga tudástér mélyítése”** card.

### 5) CTA Glow
- CTA shadow/glow should match the button gradient (use `--cta-from/--cta-to`), not a blue-tinted glow.

## Acceptance Criteria
- Kincstartó BrandIntro uses default font and black text/logo.
- Kincstartó icon grid and mood block use black text/icons.
- Split section images are paired, diagonally offset per side, smaller, and vertically centered as a group.
- Next directions list excludes “Jóga tudástér mélyítése”.
- CTA glow matches button colors.
- No changes to non-Kincstartó modals.

