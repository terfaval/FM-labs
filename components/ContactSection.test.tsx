import React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ContactSection } from "./ContactSection";

const meta = {
  contactTitle: "Kontakt",
  contactIntro: "Írj pár sort.",
  contactHelper: "Válaszolok 1-2 napon belül.",
  contactSubmitLabel: "Küldés",
  collaboration: ""
} as const;

describe("ContactSection", () => {
  it("reveals the contact form card after CTA click", () => {
    render(<ContactSection meta={meta} formEndpoint="https://example.com" />);

    expect(screen.queryByRole("form")).toBeNull();

    const cta = screen.getByRole("button", { name: "Lépjünk kapcsolatba" });
    fireEvent.click(cta);

    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("renders a centered header group when centered layout is enabled", () => {
    const { container } = render(
      <ContactSection meta={meta} formEndpoint="https://example.com" centered />
    );

    const group = container.querySelector(".contact-header");
    expect(group).not.toBeNull();
  });
});
