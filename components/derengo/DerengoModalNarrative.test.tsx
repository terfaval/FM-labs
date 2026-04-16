import React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DerengoModalNarrative } from "./DerengoModalNarrative";
import type { DerengoModalModel } from "../../lib/content/derengoModalModel";

const MODEL: DerengoModalModel = {
  project: {
    slug: "derengo",
    title: "Derengő",
    hero: "Egy érzéki utazás az erdő mélyére.",
    card: "Egy érzéki utazás az erdő mélyére.",
    what: "",
    use: "",
    features: [],
    unique: "",
    status: "",
    direction: ["Felfedező hétvégék"],
  },
  hero: {
    title: "Derengő",
    subtitle: "összművészeti közös erdő",
    text: "Egy érzéki utazás az erdő mélyére.",
    backgroundSrc: "/derengo/backgrounds/card_background.PNG",
  },
  scene1: { content: "A Derengő egy közösen teremtett érzéki utazás." },
  scene2: {
    leftContent: "Valami lényeges kezd kikopni.",
    rightCarousel: [
      { icon: "1_1_erzekek", title: "Érzékelés", text: "Text 1" },
      { icon: "1_3_muveszet", title: "Művészet", text: "Text 2" },
      { icon: "1_4_kapcsolat", title: "Kapcsolódás", text: "Text 3" },
    ],
  },
  scene3: { content: "A Derengő nem fesztivál." },
  flowSections: [
    {
      title: "Megérkezés és lelassulás",
      text: "Text",
      imageSrc: "/derengo/icons/2-1-ekrezes.PNG",
      imageAlt: "Megérkezés és lelassulás",
      imageSide: "right",
    },
  ],
  scene5: {
    introText: "Az élmény nem programokból áll össze.",
    items: [{ icon: "3_1_zene", title: "Hang", text: "Text" }],
  },
  scene6: {
    introText: "A Derengő nem egy szervezett esemény.",
    items: [
      {
        title: "Szervezők és facilitátorok",
        text: "Text",
        media: "4_1_szervezo",
      },
    ],
  },
  scene7: { content: "A Derengő azoknak szól." },
  scene8: { items: [{ title: "Felfedező hétvégék", text: "Text" }] },
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
      {
        id: "darmstadt",
        title: "Darmstadt",
        location: "Németország",
        image: "darmstadt.jpg",
        shortLabel: "Filtered",
        description: "Desc",
        linkUrl: "https://example.com/darmstadt",
      },
    ],
  },
  scene10: { content: "Egy tér, ahol az élmény nem lezárul." },
};

describe("DerengoModalNarrative", () => {
  it("renders the brand intro, png-based sensory blocks, and an inline contact form", () => {
    const { container } = render(<DerengoModalNarrative model={MODEL} />);

    expect(container.querySelector(".derengo-modal__hero")).toBeNull();
    expect(container.querySelector(".derengo-modal__brand")).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Derengő" })).toBeInTheDocument();
    expect(screen.getByText("összművészeti közös erdő")).toBeInTheDocument();
    expect(screen.queryByText("Egy érzéki utazás az erdő mélyére.")).toBeNull();
    expect(screen.getByText("Megérkezés és lelassulás")).toBeInTheDocument();
    expect(screen.getByText("Felfedező hétvégék")).toBeInTheDocument();
    expect(
      container.querySelector('img[src="/derengo/icons/5-1-felfedezes.PNG"]')
    ).not.toBeNull();
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Darmstadt/i })).toBeNull();
    expect(
      screen.queryByText(
        "Írj néhány sort arról, mi fogott meg benne, vagy hogyan kapcsolódnál a projekthez."
      )
    ).toBeNull();

    const sensoryImage = container.querySelector(
      '.derengo-modal__sensory-card img[src="/derengo/icons/3-1-zene.PNG"]'
    );
    expect(sensoryImage).not.toBeNull();
    expect(container.querySelector(".derengo-modal__sensory-card h3")).toBeNull();
    expect(
      container.querySelector('.derengo-modal__community-icon img[src="/derengo/icons/4-1-szervezo.PNG"]')
    ).not.toBeNull();
  });

  it("cycles carousel items with chevron controls and uses png icons", async () => {
    const { container } = render(<DerengoModalNarrative model={MODEL} />);
    const carouselCard = container.querySelector(".derengo-modal__carousel-card");
    expect(carouselCard).not.toBeNull();

    expect(
      container.querySelector('.derengo-modal__carousel-icon img[src="/derengo/icons/1-1-erzekek.PNG"]')
    ).not.toBeNull();
    expect(
      within(carouselCard as HTMLElement).getByRole("heading", { name: "Érzékelés" })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Következő"));

    await waitFor(() => {
      expect(
        within(carouselCard as HTMLElement).getByRole("heading", { name: "Művészet" })
      ).toBeInTheDocument();
    });
    expect(
      container.querySelector('.derengo-modal__carousel-icon img[src="/derengo/icons/1-3-muveszet.PNG"]')
    ).not.toBeNull();

    fireEvent.click(screen.getByLabelText("Előző"));

    await waitFor(() => {
      expect(
        within(carouselCard as HTMLElement).getByRole("heading", { name: "Érzékelés" })
      ).toBeInTheDocument();
    });
  });

  it("opens the inspiration popup and auto-advances the image slideshow", async () => {
    vi.useFakeTimers();
    try {
      render(<DerengoModalNarrative model={MODEL} />);

      fireEvent.click(screen.getByRole("button", { name: /Arte Sella/i }));
      const dialog = screen.getByRole("dialog", { name: "Arte Sella" });
      expect(dialog).toBeInTheDocument();

      const mainImage = within(dialog).getByRole("img", { name: "Arte Sella" });
      expect(mainImage.getAttribute("src")).toContain("artesella.jpg");

      await act(async () => {
        vi.advanceTimersByTime(5200);
      });

      expect(mainImage.getAttribute("src")).toContain("artesella_1.jpeg");

      await act(async () => {
        fireEvent.keyDown(window, { key: "Escape" });
      });
      expect(screen.queryByRole("dialog", { name: "Arte Sella" })).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});
