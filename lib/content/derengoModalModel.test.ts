import { describe, expect, it } from "vitest";
import { buildDerengoModalModel } from "./derengoModalModel";
import type { DerengoModalContent } from "./derengoModalTypes";

const SAMPLE: DerengoModalContent = {
  hero: {
    title: "Derengő",
    subtitle: "összművészeti közös erdő",
    text: "Egy érzéki utazás az erdő mélyére.",
    media: ["card_background.png"],
  },
  scene1: { content: "Intro" },
  scene2: {
    leftContent: "Left",
    rightCarousel: [
      { icon: "1_1_erzekek", title: "One", text: "Text" },
      { icon: "1_2_csend", title: "Two", text: "Text" },
    ],
  },
  scene3: { content: "Definition" },
  scene4: {
    items: [
      { title: "A", text: "AA", media: "2_1_erkezes" },
      { title: "B", text: "BB", media: "2_2_installaciok" },
    ],
  },
  scene5: {
    introText: "Intro",
    items: [
      { icon: "3_1_zene", text: "Text" },
      { icon: "3_2_feny", text: "Text" },
    ],
  },
  scene6: {
    introText: "Community",
    items: [{ title: "Szervezők", text: "Text", media: "4_1_szervezo" }],
  },
  scene7: { content: "Audience" },
  scene8: { items: [{ title: "Future", text: "Text" }] },
  scene9: {
    items: [
      {
        id: "arte-sella",
        title: "Arte Sella",
        location: "Olaszország",
        image: "arte-sella.jpg",
        shortLabel: "Kortárs művészet az erdőben",
        description: "Desc",
        linkUrl: "https://www.artesella.it/en/",
      },
    ],
  },
  scene10: { content: "Closing" },
};

describe("buildDerengoModalModel", () => {
  it("maps hero, featured card, and alternating flow visuals", () => {
    const model = buildDerengoModalModel(SAMPLE);

    expect(model.project.slug).toBe("derengo");
    expect(model.project.title).toBe("Derengő");
    expect(model.project.hero).toBe("Egy érzéki utazás az erdő mélyére.");
    expect(model.project.card).toBe("Egy érzéki utazás az erdő mélyére.");
    expect(model.project.status).toBe("");
    expect(model.project.direction).toEqual(["Future"]);
    expect(model.flowSections[0].imageSide).toBe("right");
    expect(model.flowSections[1].imageSide).toBe("left");
    expect(model.flowSections[0].imageSrc).toContain("/derengo/icons/");
    expect(model.scene5.items[0].title).toBe("Hang");
    expect(model.scene5.items[1].title).toBe("Fény");
  });
});
