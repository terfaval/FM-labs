import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectGallery } from "./ProjectGallery";
import type { Project } from "@/lib/content/types";
import type { MirachaiModalModel } from "@/lib/content/mirachaiModalModel";

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

  it("renders Mirachai custom modal when Mirachai card is opened", () => {
    const mirachai = project({ slug: "mirachai", title: "Mirachai" });
    const mirachaiModal: MirachaiModalModel = {
      brand: {
        logo: "/mirachai/logo.svg",
        name: "Mirachai",
        tagline: "Digitális tearituálék",
        appUrl: "https://mirachai.vercel.app",
      },
      hero: {
        title: "Mirachai",
        intro: "Egy lassabb teaböngészési tér.",
      },
      blocks: [
        {
          id: "BLOCK_01",
          type: "cinematic-image",
          title: "Lassabb böngészés",
          text: "Atmoszférikus tér.",
          media: ["/mirachai/screens/Slide1.PNG"],
          layout: "single-screen-large",
        },
      ],
      closing: {
        title: "Tea mint felfedezés",
        text: "Lezáró szöveg.",
        layout: "featured-standard-closing",
      },
    };

    render(
      <ProjectGallery
        topFeatured={[]}
        kincstarto={undefined}
        featuredRest={[]}
        rest={[mirachai]}
        lumiraModal={null}
        kincstartoModal={null}
        derengoModal={null}
        mirachaiModal={mirachaiModal}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Mirachai/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Tea mint felfedezés")).toBeInTheDocument();
  });
});
