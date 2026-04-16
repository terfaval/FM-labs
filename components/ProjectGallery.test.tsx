import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectGallery } from "./ProjectGallery";
import type { Project } from "@/lib/content/types";

function project(partial: Partial<Project> & Pick<Project, "slug" | "title">): Project {
  return {
    slug: partial.slug,
    title: partial.title,
    hero: partial.hero ?? "Hero",
    card: partial.card ?? "Card",
    what: partial.what ?? "What",
    use: partial.use ?? "Use",
    features: partial.features ?? ["A", "B"],
    unique: partial.unique ?? "Unique",
    status: partial.status ?? "Status",
    direction: partial.direction ?? ["Direction"],
  };
}

describe("ProjectGallery", () => {
  it("opens a modal when clicking a featured project card", () => {
    const lumira = project({ slug: "lumira", title: "Lumira" });
    const szarnyfeszito = project({ slug: "szarnyfeszito", title: "Szarnyfeszito" });
    const derengo = project({ slug: "derengo", title: "Derengő", status: "" });

    render(
      <ProjectGallery
        topFeatured={[lumira, szarnyfeszito]}
        kincstarto={project({ slug: "kincstarto", title: "Kincstarto" })}
        featuredRest={[derengo]}
        rest={[]}
        lumiraModal={null}
        kincstartoModal={null}
        derengoModal={null}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Derengő/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

