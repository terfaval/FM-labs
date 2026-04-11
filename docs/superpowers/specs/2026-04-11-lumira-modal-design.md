# Lumira Modal Narrative Redesign (Lumira-only)

Date: 2026-04-11  
Scope: **Lumira project modal only** (no changes to other project modals)

## Goal
Redesign the Lumira project modal into a **screen-driven narrative flow** where screenshots lead the story, text is minimal and centered, and the layout alternates rhythmically. Keep the existing modal shell (width, scroll, close control).

## Constraints
- **Applies only to Lumira** (`project.slug === "lumira"`).
- **Hero body and CTA are NOT shown** in the modal.
- Opening block shows **only**: logo + name + tagline.
- Typography for opening block: **Space Grotesk, weight 400**, **white**.
- Use **Lucide icons** for icon-based sections.
- Respect alternation rule for image sections.

## Content Source
Use **exact copy** from `content/lumira_modal_patch.md`. Do not paraphrase. Long paragraphs only in intro and outro.

## Assets
Screenshots in `public/lumira/screens/`:
- `raw input.PNG` (Rögzítés)
- `direction.PNG` (Keret és irány)
- `question.PNG` (Feldolgozás)
- `dream list.PNG` (Visszatérés)
- `exercises.PNG` (Előkészítés)

Logo: `public/lumira/logo.svg`

## Layout Structure (Top → Bottom)
1. **BrandIntro (NEW)**
   - Content: logo, name “lumira” (lowercase), tagline “Csendes technológia belső tapasztalatokhoz”
   - Centered, max-width 720px
   - Space Grotesk 400, white text
   - No hero body/CTA

2. **CenteredTextBlock — Kiinduló**
   - Title + single paragraph
   - Centered, max-width 640px
   - Line-height ≥ 1.6

3. **SplitSection — Flow / Rögzítés**
   - Text left, image right
   - Image: `raw input.PNG`

4. **SplitSection — Flow / Keret és irány**
   - Image left, text right
   - Image: `direction.PNG`

5. **MoodBlock**
   - Centered, large, light-weight, ~80% opacity

6. **SplitSection — Flow / Feldolgozás**
   - Text left, image right
   - Image: `question.PNG`

7. **IconGrid — Működési elv**
   - Title + intro centered
   - 3 columns desktop, 1 column mobile
   - Lucide icons (per copy)
   - Calm, minimal card chrome

8. **SplitSection — Flow / Visszatérés**
   - Image left, text right
   - Image: `dream list.PNG`

9. **SplitSection — Flow / Előkészítés**
   - Text left, image right
   - Image: `exercises.PNG`

10. **NextCards — Következő irányok**
    - Distinct from IconGrid
    - 3 horizontal cards desktop; mobile scroll or stack
    - Slight lift / glass style, subtle hover

11. **CenteredTextBlock — Záró**
    - Centered, max-width 600px
    - Slightly smaller text, extra vertical whitespace

## Alternation Rule
For all image-based sections:
- Alternate image side each time
- Mobile: stack with **image first**
- Keep screenshots large enough to be legible

## Typography & Alignment
- All **non-hero** text centered by default.
- In SplitSection, text can align left on wide screens if needed for balance, but keep centered on mobile.
- Avoid long paragraphs except Kiinduló and Záró.

## Visual Rules
- Vertical spacing: **80–120px** between blocks
- Screenshots: slight zoom (scale 1.03–1.05), soft shadow/glow, optional vignette
- Icon sizes: **28–32px**
- Calm palette, no heavy borders

## Components (Reusable)
Create reusable blocks to keep layout CMS-ready:
- `NarrativeModal` (Lumira-only orchestration)
- `BrandIntro`
- `CenteredTextBlock`
- `SplitSection`
- `MoodBlock`
- `IconGrid`
- `NextCards`

## Behavior
- Keep existing modal shell, close button, and scroll behavior.
- Only Lumira uses the narrative layout; others keep current modal layout.

## Acceptance Criteria
- Linear narrative flow with alternating screenshots.
- Logo + name + tagline opening block only (no hero body/CTA).
- IconGrid and NextCards are visually distinct.
- Responsive: images stack first on mobile.
- Text remains readable; screenshots still visually rich.
