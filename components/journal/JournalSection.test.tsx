import React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { JournalSection } from "./JournalSection";

const entries = [
  {
    id: "a",
    date: "2026-05-14",
    project: "portfolio",
    type: "planning",
    status: "published",
    title: "A",
    summary: "Summary A",
    body: "Body A",
    steps: [{ label: "L1", text: "T1" }],
    nextStep: "Next A",
  },
  {
    id: "b",
    date: "2026-05-13",
    project: "lumira",
    type: "feature",
    status: "published",
    title: "B",
    summary: "Summary B",
    body: "Body B",
    steps: [{ label: "L1", text: "T1" }],
    nextStep: "Next B",
  },
] as const;

describe("JournalSection", () => {
  it("hides the section when there are no published entries", () => {
    const { container } = render(
      <JournalSection
        entries={[
          {
            ...entries[0],
            status: "draft",
          },
        ]}
      />
    );

    expect(container.querySelector("#project-journal")).toBeNull();
  });

  it("expands entry body on click", () => {
    render(<JournalSection entries={[...entries]} />);
    expect(screen.queryByText("Body A")).toBeNull();

    const firstTitle = screen.getByText("A");
    const firstButton = firstTitle.closest("button");
    if (!firstButton) {
      throw new Error("Entry button not found");
    }
    fireEvent.click(firstButton);

    expect(screen.getByText("Body A")).toBeInTheDocument();
  });

  it("filters by project", () => {
    render(<JournalSection entries={[...entries]} />);

    fireEvent.change(screen.getByLabelText("Projekt"), {
      target: { value: "lumira" },
    });

    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.queryByText("A")).toBeNull();
  });
});
