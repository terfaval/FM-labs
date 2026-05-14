import { describe, expect, it } from "vitest";
import { buildMirachaiModalModel } from "./mirachaiModalModel";

describe("buildMirachaiModalModel", () => {
  it("loads hero, seven blocks, and closing from the Mirachai patch", () => {
    const model = buildMirachaiModalModel();

    expect(model.brand.name).toBe("Mirachai");
    expect(model.hero.intro.length).toBeGreaterThan(0);
    expect(model.brand.logo).toBe("/mirachai/logo.svg");

    expect(model.blocks).toHaveLength(7);
    expect(model.blocks[0]?.layout).toBe("single-screen-large");
    expect(model.blocks[1]?.media).toEqual([
      "/mirachai/screens/Slide1.PNG",
      "/mirachai/screens/Slide2.PNG",
    ]);
    expect(model.blocks[5]?.layout).toBe("featured-journey-multi-screen");
    expect(model.blocks[5]?.media).toEqual([
      "/mirachai/screens/Slide6.PNG",
      "/mirachai/screens/Slide7.PNG",
      "/mirachai/screens/Slide8.PNG",
      "/mirachai/screens/Slide9.PNG",
      "/mirachai/screens/Slide10.PNG",
    ]);
    expect(model.blocks[5]?.steps).toHaveLength(5);

    expect(model.closing.title.toLowerCase()).toContain("felfedez");
    expect(model.closing.text.length).toBeGreaterThan(0);
  });
});

