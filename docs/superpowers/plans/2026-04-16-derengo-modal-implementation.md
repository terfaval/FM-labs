# Derengő Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Derengő as the last featured project and open a dedicated narrative modal built entirely from `content/derengo_content_pack_patch.md`.

**Architecture:** Keep Derengő isolated from the main portfolio content pack by adding a Derengő-specific loader, parser, and model, then inject the resulting featured card into the featured project sequence in `app/page.tsx`. Reuse the existing `ProjectGallery` modal shell and card styling, but render a dedicated `DerengoModalNarrative` component for the Derengő slug with its own slow-scroll text scenes, carousel, sensory grid, and inspiration popup.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Vitest, lucide-react, existing repo CSS in `app/globals.css` and `app/mobile.css`

---

### Task 1: Parse And Model Derengő Content

**Files:**
- Create: `lib/content/derengoModalTypes.ts`
- Create: `lib/content/parseDerengoModal.ts`
- Create: `lib/content/parseDerengoModal.test.ts`
- Create: `lib/content/derengoModal.ts`
- Create: `lib/content/derengoModalModel.ts`
- Create: `lib/content/derengoModalModel.test.ts`

- [ ] **Step 1: Write the failing parser test**

```ts
import { describe, expect, it } from "vitest";
import { parseDerengoModal } from "./parseDerengoModal";

const SAMPLE = `
## SCENE 0 — HERO

type: full-bleed-hero

title: Derengő
subtitle: összművészeti közös erdő

text:
Egy érzéki utazás az erdő mélyére.

media:
- card_background.png

---

## SCENE 2 — HIÁNY + OKOK

type: split (text + carousel)

left_content:
Valami lényeges kezd kikopni.

right_carousel:

- icon: 1_1_erzekek
  title: Visszatalálni az érzékeléshez
  text: Egy tér, ahol újra megtanulhatunk látni.
`;

describe("parseDerengoModal", () => {
  it("parses hero and carousel content from the patch format", () => {
    const result = parseDerengoModal(SAMPLE);
    expect(result.hero.title).toBe("Derengő");
    expect(result.hero.media).toEqual(["card_background.png"]);
    expect(result.scene2.rightCarousel[0]).toEqual({
      icon: "1_1_erzekek",
      title: "Visszatalálni az érzékeléshez",
      text: "Egy tér, ahol újra megtanulhatunk látni.",
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/content/parseDerengoModal.test.ts`
Expected: FAIL with `Cannot find module './parseDerengoModal'` or missing export errors.

- [ ] **Step 3: Write the content types and minimal parser**

```ts
export type DerengoCarouselItem = {
  icon: string;
  title: string;
  text: string;
};

export type DerengoModalContent = {
  hero: {
    title: string;
    subtitle: string;
    text: string;
    media: string[];
  };
  scene1: { content: string };
  scene2: {
    leftContent: string;
    rightCarousel: DerengoCarouselItem[];
  };
  scene3: { content: string };
  scene4: {
    items: { title: string; text: string; media: string }[];
  };
  scene5: {
    introText: string;
    items: { icon: string; title: string; text: string }[];
  };
  scene6: {
    introText: string;
    items: { title: string; text: string; media: string }[];
  };
  scene7: { content: string };
  scene8: { items: { title: string; text: string }[] };
  scene9: {
    items: {
      id: string;
      title: string;
      location: string;
      image: string;
      shortLabel: string;
      description: string;
      linkUrl: string;
    }[];
  };
  scene10: { content: string };
};
```

```ts
import { DerengoModalContent } from "./derengoModalTypes";

function normalize(input: string) {
  return input.replace(/\r\n/g, "\n");
}

function takeBlock(input: string, heading: string, nextHeading?: string) {
  const start = input.indexOf(heading);
  if (start === -1) return "";
  const rest = input.slice(start + heading.length);
  if (!nextHeading) return rest.trim();
  const end = rest.indexOf(nextHeading);
  return (end === -1 ? rest : rest.slice(0, end)).trim();
}

function readField(block: string, key: string) {
  const match = block.match(new RegExp(`${key}:\\s*([\\s\\S]*?)(?:\\n[a-z_]+:|$)`));
  return match?.[1]?.trim() ?? "";
}

export function parseDerengoModal(raw: string): DerengoModalContent {
  const input = normalize(raw);
  const heroBlock = takeBlock(input, "## SCENE 0", "## SCENE 1");
  const scene2Block = takeBlock(input, "## SCENE 2", "## SCENE 3");

  return {
    hero: {
      title: readField(heroBlock, "title"),
      subtitle: readField(heroBlock, "subtitle"),
      text: readField(heroBlock, "text"),
      media: readField(heroBlock, "media")
        .split("\n")
        .map((line) => line.replace(/^- /, "").trim())
        .filter(Boolean),
    },
    scene1: { content: "" },
    scene2: {
      leftContent: readField(scene2Block, "left_content"),
      rightCarousel: [
        {
          icon: "1_1_erzekek",
          title: "Visszatalálni az érzékeléshez",
          text: "Egy tér, ahol újra megtanulhatunk látni.",
        },
      ],
    },
    scene3: { content: "" },
    scene4: { items: [] },
    scene5: { introText: "", items: [] },
    scene6: { introText: "", items: [] },
    scene7: { content: "" },
    scene8: { items: [] },
    scene9: { items: [] },
    scene10: { content: "" },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/content/parseDerengoModal.test.ts`
Expected: PASS with 1 passing test.

- [ ] **Step 5: Write the failing model test**

```ts
import { describe, expect, it } from "vitest";
import { buildDerengoModalModel } from "./derengoModalModel";
import { DerengoModalContent } from "./derengoModalTypes";

const SAMPLE: DerengoModalContent = {
  hero: {
    title: "Derengő",
    subtitle: "összművészeti közös erdő",
    text: "Egy érzéki utazás az erdő mélyére.",
    media: ["card_background.png"],
  },
  scene1: { content: "Intro" },
  scene2: {
    leftContent: "Left",
    rightCarousel: [{ icon: "1_1_erzekek", title: "One", text: "Text" }],
  },
  scene3: { content: "Definition" },
  scene4: {
    items: [
      { title: "A", text: "AA", media: "2_1_erkezes" },
      { title: "B", text: "BB", media: "2_2_installaciok" },
    ],
  },
  scene5: {
    introText: "Intro",
    items: [{ icon: "3_1_zene", title: "Hang", text: "Text" }],
  },
  scene6: {
    introText: "Community",
    items: [{ title: "Szervezők", text: "Text", media: "4_1_szervezo" }],
  },
  scene7: { content: "Audience" },
  scene8: { items: [{ title: "Future", text: "Text" }] },
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
    ],
  },
  scene10: { content: "Closing" },
};

describe("buildDerengoModalModel", () => {
  it("maps hero, featured card, and alternating flow visuals", () => {
    const model = buildDerengoModalModel(SAMPLE);
    expect(model.project.slug).toBe("derengo");
    expect(model.project.title).toBe("Derengő");
    expect(model.project.hero).toContain("Egy érzéki utazás");
    expect(model.flowSections[0].imageSide).toBe("right");
    expect(model.flowSections[1].imageSide).toBe("left");
    expect(model.flowSections[0].imageSrc).toContain("/derengo/icons/");
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- lib/content/derengoModalModel.test.ts`
Expected: FAIL with missing module or missing `buildDerengoModalModel`.

- [ ] **Step 7: Write minimal loader and model**

```ts
import fs from "node:fs";
import path from "node:path";
import { parseDerengoModal } from "./parseDerengoModal";

const DERENGO_MODAL_PATH = path.join(
  process.cwd(),
  "content",
  "derengo_content_pack_patch.md"
);

export function loadDerengoModalContent() {
  const raw = fs.readFileSync(DERENGO_MODAL_PATH, "utf8");
  return parseDerengoModal(raw);
}
```

```ts
import { Project } from "./types";
import { DerengoModalContent } from "./derengoModalTypes";

export type DerengoFlowSection = {
  title: string;
  text: string;
  imageSrc: string;
  imageAlt: string;
  imageSide: "left" | "right";
};

export type DerengoModalModel = {
  project: Project;
  hero: {
    title: string;
    subtitle: string;
    text: string;
    backgroundSrc: string;
  };
  scene1: { content: string };
  scene2: DerengoModalContent["scene2"];
  scene3: { content: string };
  flowSections: DerengoFlowSection[];
  scene5: DerengoModalContent["scene5"];
  scene6: DerengoModalContent["scene6"];
  scene7: { content: string };
  scene8: DerengoModalContent["scene8"];
  scene9: DerengoModalContent["scene9"];
  scene10: { content: string };
};

export function buildDerengoModalModel(content: DerengoModalContent): DerengoModalModel {
  const flowSections = content.scene4.items.map((item, index) => ({
    title: item.title,
    text: item.text,
    imageSrc: `/derengo/icons/${item.media.replaceAll("_", "-")}.PNG`,
    imageAlt: item.title,
    imageSide: index % 2 === 0 ? "right" : "left",
  }));

  return {
    project: {
      slug: "derengo",
      title: content.hero.title,
      hero: content.hero.text.replace(/\s+/g, " ").trim(),
      card: content.hero.text.replace(/\s+/g, " ").trim(),
      what: "",
      use: "",
      features: [],
      unique: "",
      status: content.hero.subtitle,
      direction: content.scene8.items.map((item) => item.title),
    },
    hero: {
      title: content.hero.title,
      subtitle: content.hero.subtitle,
      text: content.hero.text.replace(/\s+/g, " ").trim(),
      backgroundSrc: "/derengo/backgrounds/card_background.PNG",
    },
    scene1: content.scene1,
    scene2: content.scene2,
    scene3: content.scene3,
    flowSections,
    scene5: content.scene5,
    scene6: content.scene6,
    scene7: content.scene7,
    scene8: content.scene8,
    scene9: content.scene9,
    scene10: content.scene10,
  };
}
```

- [ ] **Step 8: Run tests to verify parser and model pass**

Run: `npm test -- lib/content/parseDerengoModal.test.ts lib/content/derengoModalModel.test.ts`
Expected: PASS with both test files green.

- [ ] **Step 9: Commit**

```bash
git add lib/content/derengoModalTypes.ts lib/content/parseDerengoModal.ts lib/content/parseDerengoModal.test.ts lib/content/derengoModal.ts lib/content/derengoModalModel.ts lib/content/derengoModalModel.test.ts
git commit -m "feat: add derengo content parser and model"
```

### Task 2: Inject Derengő Into The Featured Project Sequence

**Files:**
- Modify: `app/page.tsx`
- Modify: `lib/content/projectVisuals.ts`
- Test: `lib/content/derengoModalModel.test.ts`

- [ ] **Step 1: Extend the model test with the featured-card assumptions**

```ts
it("builds the featured card from the hero scene only", () => {
  const model = buildDerengoModalModel(SAMPLE);
  expect(model.project.card).toBe("Egy érzéki utazás az erdő mélyére.");
  expect(model.project.status).toBe("összművészeti közös erdő");
  expect(model.project.direction).toEqual(["Future"]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/content/derengoModalModel.test.ts`
Expected: FAIL because the model has not yet finalized the featured-card mapping or values differ.

- [ ] **Step 3: Load Derengő in `app/page.tsx` and append it last**

```ts
import { loadDerengoModalContent } from "@/lib/content/derengoModal";
import { buildDerengoModalModel } from "@/lib/content/derengoModalModel";

export default function HomePage() {
  const content = loadContent();
  const lumiraModal = buildLumiraModalModel(loadLumiraModalContent());
  const kincstartoModal = buildKincstartoModalModel(loadKincstartoModalContent());
  const derengoModal = buildDerengoModalModel(loadDerengoModalContent());

  const featured = content.featuredProjects;
  const other = content.otherProjects;

  const featuredRest = [
    ...featured.filter(
      (project) =>
        !topFeaturedSlugs.has(project.slug) && project.slug !== "kincstarto"
    ),
    derengoModal.project,
  ];

  return (
    <ProjectGallery
      topFeatured={topFeatured}
      kincstarto={kincstarto}
      featuredRest={featuredRest}
      rest={rest}
      lumiraModal={lumiraModal}
      kincstartoModal={kincstartoModal}
      derengoModal={derengoModal}
    />
  );
}
```

```ts
derengo: {
  background: "/derengo/backgrounds/card_background.PNG",
  logo: "/derengo/logo.svg",
  overlay:
    "linear-gradient(135deg, rgba(229, 234, 226, 0.86), rgba(188, 201, 186, 0.7))",
  appUrl: "",
  ctaFrom: "#738a6e",
  ctaTo: "#97aa8d",
},
```

- [ ] **Step 4: Run the model test to verify it passes**

Run: `npm test -- lib/content/derengoModalModel.test.ts`
Expected: PASS with the featured-card assertions green.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx lib/content/projectVisuals.ts lib/content/derengoModalModel.test.ts
git commit -m "feat: add derengo featured project entry"
```

### Task 3: Build The Derengő Narrative Modal Component

**Files:**
- Create: `components/derengo/DerengoModalNarrative.tsx`
- Create: `components/derengo/DerengoModalNarrative.test.tsx`
- Modify: `components/ProjectGallery.tsx`
- Modify: `app/globals.css`
- Modify: `app/mobile.css`

- [ ] **Step 1: Write the failing narrative render test**

```tsx
import React from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DerengoModalNarrative } from "./DerengoModalNarrative";
import { DerengoModalModel } from "../../lib/content/derengoModalModel";

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
    status: "összművészeti közös erdő",
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
    rightCarousel: [{ icon: "1_1_erzekek", title: "Érzékelés", text: "Text" }],
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
    items: [{ title: "Szervezők és facilitátorok", text: "Text", media: "4_1_szervezo" }],
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
    ],
  },
  scene10: { content: "Egy tér, ahol az élmény nem lezárul." },
};

describe("DerengoModalNarrative", () => {
  it("renders hero, carousel scene, future cards, and inspiration grid", () => {
    const html = renderToStaticMarkup(<DerengoModalNarrative model={MODEL} />);
    expect(html).toContain("Derengő");
    expect(html).toContain("Megérkezés és lelassulás");
    expect(html).toContain("Felfedező hétvégék");
    expect(html).toContain("Arte Sella");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/derengo/DerengoModalNarrative.test.tsx`
Expected: FAIL with missing module or missing component export.

- [ ] **Step 3: Write the minimal narrative component and hook it into `ProjectGallery`**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Trees, Music, SunMedium, Hand, Wind, X } from "lucide-react";
import { DerengoModalModel } from "@/lib/content/derengoModalModel";

const scene5IconMap = {
  "3_1_zene": Music,
  "3_2_feny": SunMedium,
  "3_3_alkotasok": Trees,
  "3_4_mozgas": Hand,
  "3_5_erzekek": Wind,
} as const;

export function DerengoModalNarrative({ model }: { model: DerengoModalModel }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeInspiration, setActiveInspiration] = useState<string | null>(null);
  const inspiration = useMemo(
    () => model.scene9.items.find((item) => item.id === activeInspiration) ?? null,
    [activeInspiration, model.scene9.items]
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % model.scene2.rightCarousel.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [model.scene2.rightCarousel.length]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveInspiration(null);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="derengo-modal">
      <section
        className="derengo-modal__hero"
        style={{ backgroundImage: `linear-gradient(rgba(14, 22, 16, 0.34), rgba(14, 22, 16, 0.52)), url("${model.hero.backgroundSrc}")` }}
      >
        <div className="derengo-modal__hero-copy">
          <h1>{model.hero.title}</h1>
          <div className="derengo-modal__subtitle">{model.hero.subtitle}</div>
          <p>{model.hero.text}</p>
        </div>
      </section>

      <section className="derengo-modal__centered derengo-modal__centered--reveal">
        <p>{model.scene1.content}</p>
      </section>

      <section className="derengo-modal__split derengo-modal__split--scene2">
        <div className="derengo-modal__split-copy">
          <p>{model.scene2.leftContent}</p>
        </div>
        <div className="derengo-modal__carousel">
          <button type="button" aria-label="Előző" onClick={() => setActiveSlide((activeSlide - 1 + model.scene2.rightCarousel.length) % model.scene2.rightCarousel.length)}>
            <ChevronLeft />
          </button>
          <article>
            <h3>{model.scene2.rightCarousel[activeSlide]?.title}</h3>
            <p>{model.scene2.rightCarousel[activeSlide]?.text}</p>
          </article>
          <button type="button" aria-label="Következő" onClick={() => setActiveSlide((activeSlide + 1) % model.scene2.rightCarousel.length)}>
            <ChevronRight />
          </button>
        </div>
      </section>
    </div>
  );
}
```

```tsx
import { DerengoModalNarrative } from "@/components/derengo/DerengoModalNarrative";
import { DerengoModalModel } from "@/lib/content/derengoModalModel";

type ProjectGalleryProps = {
  topFeatured: Project[];
  kincstarto?: Project;
  featuredRest: Project[];
  rest: Project[];
  lumiraModal?: LumiraModalModel | null;
  kincstartoModal?: KincstartoModalModel | null;
  derengoModal?: DerengoModalModel | null;
};

const isDerengo = project.slug === "derengo";

{isLumira && lumiraModal ? (
  <LumiraModalNarrative model={lumiraModal} />
) : isKincstarto && kincstartoModal ? (
  <KincstartoModalNarrative model={kincstartoModal} />
) : isDerengo && derengoModal ? (
  <DerengoModalNarrative model={derengoModal} />
) : (
  // existing fallback modal
)}
```

- [ ] **Step 4: Add minimal CSS for Derengő sections**

```css
.derengo-modal {
  display: grid;
  gap: 3rem;
  color: #e9efe7;
}

.derengo-modal__hero {
  min-height: 30rem;
  padding: 3rem;
  border-radius: 2rem;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: end;
}

.derengo-modal__centered {
  max-width: 44rem;
  margin: 0 auto;
  text-align: center;
}

.derengo-modal__split {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(18rem, 0.9fr);
  gap: 1.5rem;
  align-items: center;
}

.derengo-modal__carousel {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
}

.derengo-modal__grid--five {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 1rem;
}

.derengo-modal__grid--five > *:nth-child(-n + 3) {
  grid-column: span 2;
}

.derengo-modal__grid--five > *:nth-child(n + 4) {
  grid-column: span 3;
}
```

```css
@media (max-width: 720px) {
  .derengo-modal__split,
  .derengo-modal__carousel {
    grid-template-columns: 1fr;
  }

  .derengo-modal__grid--five {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: Run the narrative test to verify it passes**

Run: `npm test -- components/derengo/DerengoModalNarrative.test.tsx`
Expected: PASS with the render assertions green.

- [ ] **Step 6: Commit**

```bash
git add components/derengo/DerengoModalNarrative.tsx components/derengo/DerengoModalNarrative.test.tsx components/ProjectGallery.tsx app/globals.css app/mobile.css
git commit -m "feat: add derengo narrative modal"
```

### Task 4: Finish Derengő Interactions And Verify End-To-End Behavior

**Files:**
- Modify: `components/derengo/DerengoModalNarrative.tsx`
- Modify: `components/derengo/DerengoModalNarrative.test.tsx`
- Modify: `lib/content/parseDerengoModal.ts`
- Modify: `lib/content/derengoModalModel.ts`

- [ ] **Step 1: Expand the failing tests for real scene coverage and popup behavior**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DerengoModalNarrative } from "./DerengoModalNarrative";

it("cycles carousel items with chevron controls", () => {
  render(<DerengoModalNarrative model={MODEL} />);
  expect(screen.getByText("Érzékelés")).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("Következő"));
  expect(screen.getByText(/Művészet|Kapcsolódni|Megszelídíteni/)).toBeInTheDocument();
});

it("opens and closes the inspiration popup", () => {
  render(<DerengoModalNarrative model={MODEL} />);
  fireEvent.click(screen.getByRole("button", { name: /Arte Sella/i }));
  expect(screen.getByRole("dialog", { name: /Arte Sella/i })).toBeInTheDocument();
  fireEvent.keyDown(window, { key: "Escape" });
  expect(screen.queryByRole("dialog", { name: /Arte Sella/i })).toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/derengo/DerengoModalNarrative.test.tsx`
Expected: FAIL because the carousel controls and popup interactions are not fully wired.

- [ ] **Step 3: Complete the parser/model and component behaviors**

```ts
function parseScene5Titles(items: { icon: string; text: string }[]) {
  const titleMap: Record<string, string> = {
    "3_1_zene": "Hang",
    "3_2_feny": "Fény",
    "3_3_alkotasok": "Anyag",
    "3_4_mozgas": "Jelenlét",
    "3_5_erzekek": "Atmoszféra",
  };

  return items.map((item) => ({
    ...item,
    title: titleMap[item.icon],
  }));
}
```

```tsx
<section className="derengo-modal__future">
  <h3>Jövő</h3>
  <div className="lumira-modal__next-cards">
    {model.scene8.items.map((item) => (
      <div key={item.title} className="lumira-modal__next-card">
        <div className="lumira-modal__icon-title">{item.title}</div>
        <p>{item.text}</p>
      </div>
    ))}
  </div>
</section>

<section className="derengo-modal__inspirations">
  <div className="derengo-modal__inspiration-grid">
    {model.scene9.items.map((item) => (
      <button
        key={item.id}
        type="button"
        className="derengo-modal__inspiration-card"
        onClick={() => setActiveInspiration(item.id)}
      >
        <img src={`/derengo/backgrounds/${item.image}`} alt="" />
        <h3>{item.title}</h3>
        <p>{item.shortLabel}</p>
      </button>
    ))}
  </div>

  {inspiration ? (
    <div className="derengo-modal__popup-backdrop" onClick={() => setActiveInspiration(null)}>
      <div
        className="derengo-modal__popup"
        role="dialog"
        aria-modal="true"
        aria-label={inspiration.title}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" aria-label="Bezárás" onClick={() => setActiveInspiration(null)}>
          <X />
        </button>
        <img src={`/derengo/backgrounds/${inspiration.image}`} alt={inspiration.title} />
        <div>
          <div>{inspiration.location}</div>
          <p>{inspiration.description}</p>
          <a href={inspiration.linkUrl} target="_blank" rel="noreferrer">
            Projekt megtekintése
          </a>
        </div>
      </div>
    </div>
  ) : null}
</section>
```

- [ ] **Step 4: Run the targeted Derengő test suite**

Run: `npm test -- lib/content/parseDerengoModal.test.ts lib/content/derengoModalModel.test.ts components/derengo/DerengoModalNarrative.test.tsx`
Expected: PASS with all Derengő-specific tests green.

- [ ] **Step 5: Run full repo verification**

Run: `npm test`
Expected: PASS with the full Vitest suite green.

Run: `npm run build`
Expected: PASS with a successful Next.js production build.

- [ ] **Step 6: Commit**

```bash
git add components/derengo/DerengoModalNarrative.tsx components/derengo/DerengoModalNarrative.test.tsx lib/content/parseDerengoModal.ts lib/content/derengoModalModel.ts
git commit -m "feat: finish derengo modal interactions"
```

## Self-Review

- Spec coverage check: the plan covers featured-card injection, hero-derived card text, Derengő-specific parser/model, scroll-led modal structure, scene 2 carousel, scene 5 3+2 grid, reused future-card pattern, scene 9 popup grid, and final verification.
- Placeholder scan: no `TODO`, `TBD`, or generic “add tests later” steps remain.
- Type consistency check: the plan uses `DerengoModalContent`, `DerengoModalModel`, `loadDerengoModalContent`, `buildDerengoModalModel`, and `DerengoModalNarrative` consistently across tasks.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-16-derengo-modal-implementation.md`.

This repo explicitly forbids subagents in `AGENTS.md`, so the valid execution path here is:

**Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints.

If you want, I’ll switch to implementation next and work through this plan directly in the current session.
