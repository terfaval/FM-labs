import { describe, expect, it } from "vitest";
import { parseDerengoModal } from "./parseDerengoModal";
import { loadDerengoModalContent } from "./derengoModal";

const SAMPLE = `
## SCENE 0 — HERO

type: full-bleed-hero

title: Derengő
subtitle: összművészeti közös erdő

text:
Egy érzéki utazás az erdő mélyére.

media:
- card_background.png

---

## SCENE 1 — BEVEZETŐ

type: text-reveal (centered)

content:
Nyitó szöveg.

---

## SCENE 2 — HIÁNY + OKOK

type: split (text + carousel)

left_content:
Valami lényeges kezd kikopni.

right_carousel:

- icon: 1_1_erzekek
  title: Visszatalálni az érzékeléshez
  text: Egy tér, ahol újra megtanulhatunk látni.

carousel_behavior:
- autoplay: true
- loop: true
`;

describe("parseDerengoModal", () => {
  it("parses hero and carousel content from the patch format", () => {
    const result = parseDerengoModal(SAMPLE);

    expect(result.hero.title).toBe("Derengő");
    expect(result.hero.subtitle).toBe("összművészeti közös erdő");
    expect(result.hero.media).toEqual(["card_background.png"]);
    expect(result.scene1.content).toBe("Nyitó szöveg.");
    expect(result.scene2.leftContent).toBe("Valami lényeges kezd kikopni.");
    expect(result.scene2.rightCarousel[0]).toEqual({
      icon: "1_1_erzekek",
      title: "Visszatalálni az érzékeléshez",
      text: "Egy tér, ahol újra megtanulhatunk látni.",
    });
  });

  it("loads the real Derengő patch from disk", () => {
    const content = loadDerengoModalContent();

    expect(content.hero.title).toBe("Derengő");
    expect(content.scene2.rightCarousel).toHaveLength(4);
    expect(content.scene4.items).toHaveLength(4);
    expect(content.scene5.items).toHaveLength(5);
    expect(content.scene6.items).toHaveLength(3);
    expect(content.scene8.items).toHaveLength(3);
    expect(content.scene9.items).toHaveLength(9);
    expect(content.scene10.content).toContain("tovább él");
  });
});
