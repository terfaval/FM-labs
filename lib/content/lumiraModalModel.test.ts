import { describe, expect, it } from "vitest";
import { buildLumiraModalModel } from "./lumiraModalModel";
import { LumiraModalContent } from "./lumiraModalTypes";

const SAMPLE: LumiraModalContent = {
  hero: { eyebrow: "Eyebrow", body: "Body", cta: "CTA" },
  kiindulo: { title: "Honnan indult", body: "Kiindulo" },
  flow: {
    rogzites: { overline: "01", title: "Rogzites", body: "A", caption: "C1" },
    keret: { overline: "02", title: "Keret", body: "B", caption: "C2" },
    feldolgozas: { overline: "03", title: "Feld", body: "C", caption: "C3" },
    visszateres: { overline: "04", title: "Vissza", body: "D", caption: "C4" },
    elokeszites: { overline: "05", title: "Elokesz", body: "E", caption: "C5" },
  },
  mood: { first: "Mood1", second: "Mood2" },
  principles: { title: "Mûködési elv", intro: "Intro", items: [] },
  nextDirections: { title: "Következõ irányok", intro: "Intro2", cards: [] },
  closing: { body: "Outro" },
};

describe("buildLumiraModalModel", () => {
  it("maps flow blocks to images and alternates sides", () => {
    const model = buildLumiraModalModel(SAMPLE);
    const flow = model.flowSections;
    expect(flow[0].imageSide).toBe("right");
    expect(flow[1].imageSide).toBe("left");
    expect(flow[2].imageSide).toBe("right");
    expect(flow[3].imageSide).toBe("left");
    expect(flow[4].imageSide).toBe("right");
    expect(flow[0].imageSrc).toContain("raw input.PNG");
    expect(flow[1].imageSrc).toContain("direction.PNG");
    expect(flow[2].imageSrc).toContain("question.PNG");
    expect(flow[3].imageSrc).toContain("dream list.PNG");
    expect(flow[4].imageSrc).toContain("exercises.PNG");
  });
});
