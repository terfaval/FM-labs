import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/content/types";

const lumiraProject: Project = {
  slug: "lumira",
  title: "Lumira",
  hero: "Dream workbench",
  card: "Card summary",
  what: "What",
  use: "Use",
  features: ["A"],
  unique: "Unique",
  status: "Aktív",
  direction: ["Direction"],
};

describe("ProjectCard", () => {
  it("shows a redesign notice on the Lumira featured card", () => {
    render(<ProjectCard project={lumiraProject} featured full featuredLayout />);

    expect(screen.getByText("Újratervezés alatt")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Elérhető és kipróbálható, de az oldal még átalakítás alatt áll."
      )
    ).toBeInTheDocument();
  });
});
