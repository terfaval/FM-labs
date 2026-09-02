import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HomePage from "./page";
import type { Project } from "@/lib/content/types";

const lumira: Project = {
  slug: "lumira",
  title: "Lumira",
  hero: "Dream workbench",
  card: "Card",
  what: "What",
  use: "Use",
  features: ["A"],
  unique: "Unique",
  status: "Aktív",
  direction: ["Direction"],
};

vi.mock("@/lib/content/loadContent", () => ({
  loadContent: () => ({
    meta: {
      title: "FM Labs",
      role: "Role",
      language: "hu",
      tagline: "Tagline",
      intro: "Intro",
      about: "About",
      subtitle: "Portfolio",
      description: "Description",
      approach: "",
      approachItems: [],
      collaboration: "Collaboration",
      contactTitle: "Contact",
      contactIntro: "Contact intro",
      contactHelper: "Contact helper",
      contactSubmitLabel: "Send",
    },
    featuredProjects: [lumira],
    otherProjects: [],
  }),
}));

vi.mock("@/lib/content/lumiraModal", () => ({
  loadLumiraModalContent: () => ({}),
}));

vi.mock("@/lib/content/lumiraModalModel", () => ({
  buildLumiraModalModel: () => null,
}));

vi.mock("@/lib/content/kincstartoModal", () => ({
  loadKincstartoModalContent: () => ({}),
}));

vi.mock("@/lib/content/kincstartoModalModel", () => ({
  buildKincstartoModalModel: () => null,
}));

vi.mock("@/lib/content/derengoModal", () => ({
  loadDerengoModalContent: () => ({}),
}));

vi.mock("@/lib/content/derengoModalModel", () => ({
  buildDerengoModalModel: () => ({
    project: {
      ...lumira,
      slug: "derengo",
      title: "Derengő",
    },
  }),
}));

vi.mock("@/lib/content/szarnyfeszitoModalModel", () => ({
  buildSzarnyfeszitoModalModel: () => null,
}));

vi.mock("@/lib/content/urbanEcoLabModal", () => ({
  loadUrbanEcoLabModalContent: () => ({}),
}));

vi.mock("@/lib/content/urbanEcoLabModalModel", () => ({
  buildUrbanEcoLabModalModel: () => null,
}));

vi.mock("@/lib/content/noviraModalModel", () => ({
  buildNoviraModalModel: () => null,
}));

vi.mock("@/lib/content/mirachaiModalModel", () => ({
  buildMirachaiModalModel: () => null,
}));

vi.mock("@/lib/content/deskResearchModalModel", () => ({
  buildDeskResearchModalModel: () => ({
    project: {
      ...lumira,
      slug: "deskresearch",
      title: "Desk Research",
    },
  }),
}));

vi.mock("@/lib/journal/store", () => ({
  createDefaultJournalStore: () => ({
    listPublished: () => [],
  }),
}));

vi.mock("@/components/journal/JournalSection", () => ({
  JournalSection: () => <section>Fejlesztési napló</section>,
}));

describe("HomePage", () => {
  it("does not render the public development journal section", async () => {
    render(await HomePage());

    expect(screen.queryByText("Fejlesztési napló")).not.toBeInTheDocument();
  });
});
