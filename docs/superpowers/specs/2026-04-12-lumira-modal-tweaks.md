# Lumira Modal Visual Adjustments (Lumira-only)

Date: 2026-04-12  
Scope: **Lumira project modal only** (no changes to other project modals)

## Goal
Improve the Lumira modal’s visual readability and consistency with the Lumira featured card by aligning background/overlay styling, ensuring white text, adjusting split layout for specific flow blocks, and adding CTA buttons in header and closing blocks.

## Constraints
- Applies **only** to Lumira modal (narrative modal).  
- Keep existing modal shell, close button, and scroll behavior.  
- Use existing Lumira card overlay styling (same gradient stack as the Lumira card).  
- All text in the Lumira modal is white or near-white.  
- CTA links open in a new tab to `https://lumira-sage.vercel.app`.

## Changes

### 1) Background + Overlay (Lumira modal only)
- Modal background image: `public/lumira/background.png`.
- Overlay: reuse the Lumira card overlay gradients (same as `.project-card--lumira-glass`).
- Overlay sits above the background image and below content.

### 2) Typography / Color
- All text in the Lumira modal is white / near-white.  
- Keep existing hierarchy (hero, captions, etc.), but ensure colors are white or off-white.

### 3) Split Sections (flow layout)
- For blocks **02** and **04**: text on the left, image on the right.  
- Keep the general alternation elsewhere unchanged.

### 4) CTAs
- Add a **“Fedezd fel”** CTA to:
  - **Brand/intro header block**: placed directly under tagline, centered, with a realistic gap (~20–24px).
  - **Closing block**: placed under the closing text, centered.
- CTA style: reuse Lumira card CTA (same gradient colors) and existing pill button shape.
- CTA behavior: open in new tab (`target="_blank"`, `rel="noreferrer"`).

## Acceptance Criteria
- Lumira modal uses `public/lumira/background.png` and the Lumira card overlay gradients.
- All Lumira modal text renders in white/near-white.
- Flow blocks 02 and 04: text left, image right.
- CTAs appear in header and closing blocks, centered, with realistic spacing, and open the correct URL.
- No changes to non-Lumira modals.
