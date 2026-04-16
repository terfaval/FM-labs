# Derengő Featured Card And Narrative Modal Design

## Goal

Add the Derengő project to the app as the last featured project card and open a dedicated narrative modal that follows `content/derengo_content_pack_patch.md`.

The implementation must reuse the existing project card and modal shell patterns where practical, while keeping Derengő's presentation slower, more atmospheric, and more scroll-led than the standard case-study modals.

## Source Of Truth

1. `content/derengo_content_pack_patch.md`
2. Active ticket instructions
3. Existing featured-card and modal patterns in the repo

The main content pack remains unchanged for Derengő. Derengő data is loaded only from its patch file.

## Scope

- Add Derengő as a featured project card, shown last in the featured sequence
- Derive the card content from `SCENE 0` hero content in the Derengő patch
- Build a dedicated Derengő modal narrative from the scene structure in the patch
- Reuse the existing modal shell, spacing patterns, and existing "future directions" card pattern
- Add only the minimum parsing/model layer needed for Derengő

Out of scope:

- Generalizing all narrative modals into a new shared scene engine
- Editing `content/portfolio_content_pack.md`
- Introducing new product features or additional content beyond the patch

## Data Design

Derengő gets its own loader and model, following the existing Lumira and Kincstartó pattern.

The loader reads `content/derengo_content_pack_patch.md` and maps it into:

- featured card data
- hero data
- reveal-text sections
- carousel slides
- flow sections
- sensory grid items
- community cards
- future-direction cards
- inspiration items
- closing text

The featured card is injected into the featured list in app code rather than parsed from the main portfolio content pack.

## UI Design

### Featured Card

- Reuse the existing featured project card component and styling
- Show Derengő as the last featured project
- Use `SCENE 0` title for the card title
- Use the hero text as the card's short atmospheric text, collapsed only as needed for card readability
- Use the Derengő hero background asset as the card background
- Handle label/status metadata through the same surface already used by other cards, without introducing a new metadata system

### Modal Structure

The modal remains inside the existing `ProjectGallery` modal shell and closes with the same shell interactions.

A dedicated `DerengoModalNarrative` component renders these sections in order:

1. Full-bleed hero with image, subtitle, and hero copy
2. Centered reveal intro text
3. Split scene with left text and right autoplay carousel
4. Centered reveal definition text
5. Four alternating split flow blocks
6. Centered sensory intro and 3+2 icon grid
7. Community intro and 3-card grid
8. Centered "kinek szól" text block
9. Reused future-direction card pattern
10. Interactive inspiration grid with popup overlay
11. Centered closing text

### Motion And Interaction

- Reveal text uses subtle staged appearance on scroll
- Carousel autoplay is slow, loops, supports chevron navigation, and supports mobile swipe
- Carousel transitions remain soft, using fade or gentle sliding
- Inspiration cards open an internal overlay popup
- Popup closes on close button, `Escape`, and overlay click
- Motion stays minimal and calm

## Styling Constraints

- Preserve the app's calm modal rhythm and whitespace
- Avoid loud landing-page styling
- Avoid introducing a separate design system
- Use lucide-react icons where the ticket explicitly requires icons
- Keep icon sizes consistent within each scene

## Testing Strategy

Follow TDD during implementation.

Required tests:

- Derengő content parsing/model test for the patch structure
- Narrative component render tests for the main scenes
- Carousel behavior tests for manual navigation and loop-safe state transitions
- Inspiration popup open/close behavior tests, including `Escape`

Verification after implementation:

- targeted tests for new parser/model and component behavior
- full project test/build commands already used in this repo where applicable

## Implementation Notes

- Do not modify unrelated project content
- Do not change the existing main content parser for Derengő support
- Prefer small Derengő-specific files over broad refactors
- Work directly on `main`, with no worktree and no subagents
