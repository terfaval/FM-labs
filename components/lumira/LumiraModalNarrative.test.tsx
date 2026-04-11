import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LumiraModalNarrative } from "./LumiraModalNarrative";
import { LumiraModalModel } from "../../lib/content/lumiraModalModel";
import { loadLumiraModalContent } from "../../lib/content/lumiraModal";
import { buildLumiraModalModel } from "../../lib/content/lumiraModalModel";

const MODEL: LumiraModalModel = {
  brand: { logo: "/lumira/logo.svg", name: "lumira", tagline: "Csendes technológia" },
  kiindulo: { title: "Honnan indult", body: "Kiindulo" },
  mood: { first: "Mood 1", second: "Mood 2" },
  flowSections: [
    {
      overline: "01 · Rögzítés",
      title: "Az elsõ lépés",
      body: "Body",
      caption: "Caption",
      imageSrc: "/lumira/screens/raw input.PNG",
      imageAlt: "Alt",
      imageSide: "right",
    },
  ],
  principles: { title: "Mûködési elv", intro: "Intro", items: [] },
  nextDirections: { title: "Következõ irányok", intro: "Intro", cards: [] },
  closing: { body: "Záró" },
};

describe("LumiraModalNarrative", () => {
  it("renders brand, kiindulo, and flow content", () => {
    const html = renderToStaticMarkup(<LumiraModalNarrative model={MODEL} />);
    expect(html).toContain("lumira");
    expect(html).toContain("Honnan indult");
    expect(html).toContain("Az elsõ lépés");
  });

  it("builds a model from the real content file", () => {
    const content = loadLumiraModalContent();
    const model = buildLumiraModalModel(content);
    expect(model.brand.tagline.length).toBeGreaterThan(0);
    expect(model.flowSections).toHaveLength(5);
  });
});
