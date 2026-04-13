# Collaboration Block Centered Copy

Date: 2026-04-13

## Summary
Center-align all collaboration copy in the “Együttmûködés” block while keeping the contact CTA group centered and the inline form card left-aligned. Content remains sourced from the content pack, which has already been edited by the user.

## Goals
- Center-align all collaboration text paragraphs in the “Együttmûködés” block.
- Keep contact rows and CTA centered.
- Keep the inline form card left-aligned for readability.

## Non-Goals
- No content editing in code (content pack is the source of truth).
- No layout changes outside the collaboration block.
- No new animations.

## Architecture
- Use a wrapper class on the collaboration block to apply centered text alignment.
- Override alignment for the contact form card to remain left-aligned.

## Content Source of Truth
- Collaboration copy comes from `content/portfolio_content_pack.md` (already edited by user).

## Styling
- `collaboration-block` gets `text-align: center`.
- `collaboration-block .contact-card` gets `text-align: left` to keep the form left-aligned.

## Testing & Verification
- Manual: verify collaboration paragraphs, contact rows, and CTA are centered; form card remains left-aligned.

