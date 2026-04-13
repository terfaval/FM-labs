import { describe, expect, it } from "vitest";
import { loadLumiraModalContent } from "./lumiraModal";
import { parseLumiraModal } from "./parseLumiraModal";

const SAMPLE = `
## Block 1 – Hero

### Eyebrow
Csendes technológia belső tapasztalatokhoz

### Body
Hero body text.

## Block 2 – Kiinduló szöveg

### Title
Honnan indult

### Body
Kiindulo szoveg.

## Block 3 – Flow / Rögzítés

### Overline
01 · Rögzítés

### Title
Az első lépés.

### Body
Flow body.

### Caption
Flow caption.

## Block 7 – Működési elv

### Title
Működési elv

### Intro
Intro text.

#### Item 1
Icon: SearchCheck
Title: Nem értelmez készre
Text: Nincs lezárás.

#### Item 2
Icon: PauseCircle
Title: Nem sürget
Text: Megállítható.

#### Item 3
Icon: RotateCcw
Title: Visszatérhető
Text: Újra nyitható.

## Block 10 – Következő irányok

### Title
Következő irányok

### Intro
Irányok intro.

#### Card 1
Icon: BookMarked
Title: Álomszótár
Text: Rövid leírás.
`;

describe("parseLumiraModal", () => {
  it("parses hero eyebrow, kiindulo title/body, a flow block, and grids", () => {
    const content = parseLumiraModal(SAMPLE);
    expect(content.hero.eyebrow).toBe("Csendes technológia belső tapasztalatokhoz");
    expect(content.kiindulo.title).toBe("Honnan indult");
    expect(content.kiindulo.body).toContain("Kiindulo szoveg");
    expect(content.flow.rogzites.overline).toBe("01 · Rögzítés");
    expect(content.flow.rogzites.caption).toBe("Flow caption.");
    expect(content.principles.items).toHaveLength(3);
    expect(content.nextDirections.cards[0].title).toBe("Álomszótár");
  });
});

describe("loadLumiraModalContent", () => {
  it("loads the lumira modal content from disk", () => {
    const content = loadLumiraModalContent();
    expect(content.hero.eyebrow.length).toBeGreaterThan(0);
    expect(content.kiindulo.body.length).toBeGreaterThan(0);
  });
});
