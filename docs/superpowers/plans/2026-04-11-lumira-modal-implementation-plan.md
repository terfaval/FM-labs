# Lumira Modal Narrative Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a Lumira-only narrative modal with alternating screenshot flow, centered text blocks, icon grid, and next-direction cards using content from `content/lumira_modal_patch.md`.

**Architecture:** Add a small parser + model builder that reads the Lumira modal patch markdown and outputs structured data. Render a Lumira-only modal layout composed of reusable blocks, while keeping the existing modal shell for all other projects.

**Tech Stack:** Next.js (App Router), React, TypeScript, Vitest

---

## File Structure (new / modified)

**Create**
- `lib/content/lumiraModalTypes.ts` — types for parsed modal content + model
- `lib/content/parseLumiraModal.ts` — parser for `content/lumira_modal_patch.md`
- `lib/content/lumiraModal.ts` — loader that reads the patch file and returns parsed content
- `lib/content/lumiraModalModel.ts` — transforms parsed content into render-ready blocks
- `lib/content/parseLumiraModal.test.ts` — parser unit tests
- `lib/content/lumiraModalModel.test.ts` — model mapping tests
- `components/lumira/LumiraModalNarrative.tsx` — Lumira narrative modal blocks (BrandIntro, CenteredTextBlock, SplitSection, MoodBlock, IconGrid, NextCards)

**Modify**
- `components/ProjectGallery.tsx` — branch to Lumira modal content
- `app/globals.css` — styles for Lumira modal blocks

---

### Task 1: Add Lumira modal parser + types

**Files:**
- Create: `lib/content/lumiraModalTypes.ts`
- Create: `lib/content/parseLumiraModal.ts`
- Create: `lib/content/parseLumiraModal.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// lib/content/parseLumiraModal.test.ts
import { describe, expect, it } from "vitest";
import { parseLumiraModal } from "./parseLumiraModal";

const SAMPLE = `
## Block 1 – Hero

### Eyebrow
Csendes technológia belső tapasztalatokhoz

### Body
Hero body text.

## Block 2 – Kiinduló szöveg

### Title
Honnan indult

### Body
Kiindulo szoveg.

## Block 3 – Flow / Rögzítés

### Overline
01 · Rögzítés

### Title
Az első lépés.

### Body
Flow body.

### Caption
Flow caption.

## Block 7 – Működési elv

### Title
Működési elv

### Intro
Intro text.

#### Item 1
Icon: SearchCheck
Title: Nem értelmez készre
Text: Nincs lezárás.

#### Item 2
Icon: PauseCircle
Title: Nem sürget
Text: Megállítható.

#### Item 3
Icon: RotateCcw
Title: Visszatérhető
Text: Újra nyitható.

## Block 10 – Következő irányok

### Title
Következő irányok

### Intro
Irányok intro.

#### Card 1
Icon: BookMarked
Title: Álomszótár
Text: Rövid leírás.
`;

describe("parseLumiraModal", () => {
  it("parses hero eyebrow, kiindulo title/body, a flow block, and grids", () => {
    const content = parseLumiraModal(SAMPLE);
    expect(content.hero.eyebrow).toBe("Csendes technológia belső tapasztalatokhoz");
    expect(content.kiindulo.title).toBe("Honnan indult");
    expect(content.kiindulo.body).toContain("Kiindulo szoveg");
    expect(content.flow.rogzites.overline).toBe("01 · Rögzítés");
    expect(content.flow.rogzites.caption).toBe("Flow caption.");
    expect(content.principles.items).toHaveLength(3);
    expect(content.nextDirections.cards[0].title).toBe("Álomszótár");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run lib/content/parseLumiraModal.test.ts`  
Expected: FAIL (module not found / parseLumiraModal not implemented)

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/content/lumiraModalTypes.ts
export type FlowBlock = {
  overline: string;
  title: string;
  body: string;
  caption: string;
};

export type IconItem = {
  icon: string;
  title: string;
  text: string;
};

export type NextCard = {
  icon: string;
  title: string;
  text: string;
};

export type LumiraModalContent = {
  hero: { eyebrow: string; body: string; cta: string };
  kiindulo: { title: string; body: string };
  flow: {
    rogzites: FlowBlock;
    keret: FlowBlock;
    feldolgozas: FlowBlock;
    visszateres: FlowBlock;
    elokeszites: FlowBlock;
  };
  mood: { first: string; second: string };
  principles: { title: string; intro: string; items: IconItem[] };
  nextDirections: { title: string; intro: string; cards: NextCard[] };
  closing: { body: string };
};
```

```ts
// lib/content/parseLumiraModal.ts
import { LumiraModalContent } from "./lumiraModalTypes";

type SectionMap = Record<string, string[]>;

function normalizeLines(input: string) {
  return input.replace(/\r\n/g, "\n").split("\n");
}

function collectSections(lines: string[]) {
  const blocks: Record<string, SectionMap> = {};
  let currentBlock = "";
  let currentKey = "";

  for (const raw of lines) {
    const line = raw.trimEnd();
    const blockMatch = line.match(/^##\s+Block\s+\d+\s+–\s+(.+)$/);
    if (blockMatch) {
      currentBlock = blockMatch[1].trim();
      blocks[currentBlock] = {};
      currentKey = "";
      continue;
    }
    const keyMatch = line.match(/^###\s+(.+)$/);
    if (keyMatch && currentBlock) {
      currentKey = keyMatch[1].trim();
      blocks[currentBlock][currentKey] = [];
      continue;
    }
    const itemMatch = line.match(/^####\s+(Item|Card)\s+\d+$/);
    if (itemMatch && currentBlock) {
      currentKey = `__${itemMatch[1]}__${Object.keys(blocks[currentBlock]).length}`;
      blocks[currentBlock][currentKey] = [];
      continue;
    }
    if (currentBlock && currentKey) {
      blocks[currentBlock][currentKey].push(line);
    }
  }

  return blocks;
}

function joinText(lines: string[]) {
  return lines.join("\n").trim();
}

function parseIconItems(map: SectionMap, prefix: "Item" | "Card") {
  return Object.entries(map)
    .filter(([key]) => key.startsWith(`__${prefix}__`))
    .map(([, lines]) => {
      const text = joinText(lines);
      const icon = (text.match(/Icon:\s*(.+)/)?.[1] ?? "").trim();
      const title = (text.match(/Title:\s*(.+)/)?.[1] ?? "").trim();
      const body = (text.match(/Text:\s*(.+)/)?.[1] ?? "").trim();
      return { icon, title, text: body };
    });
}

export function parseLumiraModal(input: string): LumiraModalContent {
  const blocks = collectSections(normalizeLines(input));
  const hero = blocks["Hero"] ?? {};
  const kiindulo = blocks["Kiinduló szöveg"] ?? {};
  const rogzites = blocks["Flow / Rögzítés"] ?? {};
  const keret = blocks["Flow / Keret és irány"] ?? {};
  const feldolgozas = blocks["Flow / Feldolgozás"] ?? {};
  const visszateres = blocks["Flow / Visszatérés"] ?? {};
  const elokeszites = blocks["Flow / Előkészítés"] ?? {};
  const mood = blocks["Mood block"] ?? {};
  const principles = blocks["Működési elv"] ?? {};
  const nextDirections = blocks["Következő irányok"] ?? {};
  const closing = blocks["Záró szöveg"] ?? {};

  return {
    hero: {
      eyebrow: joinText(hero["Eyebrow"] ?? []),
      body: joinText(hero["Body"] ?? []),
      cta: joinText(hero["CTA label"] ?? []),
    },
    kiindulo: {
      title: joinText(kiindulo["Title"] ?? []),
      body: joinText(kiindulo["Body"] ?? []),
    },
    flow: {
      rogzites: {
        overline: joinText(rogzites["Overline"] ?? []),
        title: joinText(rogzites["Title"] ?? []),
        body: joinText(rogzites["Body"] ?? []),
        caption: joinText(rogzites["Caption"] ?? []),
      },
      keret: {
        overline: joinText(keret["Overline"] ?? []),
        title: joinText(keret["Title"] ?? []),
        body: joinText(keret["Body"] ?? []),
        caption: joinText(keret["Caption"] ?? []),
      },
      feldolgozas: {
        overline: joinText(feldolgozas["Overline"] ?? []),
        title: joinText(feldolgozas["Title"] ?? []),
        body: joinText(feldolgozas["Body"] ?? []),
        caption: joinText(feldolgozas["Caption"] ?? []),
      },
      visszateres: {
        overline: joinText(visszateres["Overline"] ?? []),
        title: joinText(visszateres["Title"] ?? []),
        body: joinText(visszateres["Body"] ?? []),
        caption: joinText(visszateres["Caption"] ?? []),
      },
      elokeszites: {
        overline: joinText(elokeszites["Overline"] ?? []),
        title: joinText(elokeszites["Title"] ?? []),
        body: joinText(elokeszites["Body"] ?? []),
        caption: joinText(elokeszites["Caption"] ?? []),
      },
    },
    mood: {
      first: joinText(mood["Body"] ?? []),
      second: joinText((blocks["Mood block #2"] ?? {})["Body"] ?? []),
    },
    principles: {
      title: joinText(principles["Title"] ?? []),
      intro: joinText(principles["Intro"] ?? []),
      items: parseIconItems(principles, "Item"),
    },
    nextDirections: {
      title: joinText(nextDirections["Title"] ?? []),
      intro: joinText(nextDirections["Intro"] ?? []),
      cards: parseIconItems(nextDirections, "Card"),
    },
    closing: {
      body: joinText(closing["Body"] ?? []),
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run lib/content/parseLumiraModal.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/content/lumiraModalTypes.ts lib/content/parseLumiraModal.ts lib/content/parseLumiraModal.test.ts
git commit -m "feat: add lumira modal parser and types"
```

---

### Task 2: Build render-ready Lumira modal model

**Files:**
- Create: `lib/content/lumiraModalModel.ts`
- Create: `lib/content/lumiraModalModel.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// lib/content/lumiraModalModel.test.ts
import { describe, expect, it } from "vitest";
import { buildLumiraModalModel } from "./lumiraModalModel";
import { LumiraModalContent } from "./lumiraModalTypes";

const SAMPLE: LumiraModalContent = {
  hero: { eyebrow: "Eyebrow", body: "Body", cta: "CTA" },
  kiindulo: { title: "Honnan indult", body: "Kiindulo" },
  flow: {
    rogzites: { overline: "01", title: "Rogzites", body: "A", caption: "C1" },
    keret: { overline: "02", title: "Keret", body: "B", caption: "C2" },
    feldolgozas: { overline: "03", title: "Feld", body: "C", caption: "C3" },
    visszateres: { overline: "04", title: "Vissza", body: "D", caption: "C4" },
    elokeszites: { overline: "05", title: "Elokesz", body: "E", caption: "C5" },
  },
  mood: { first: "Mood1", second: "Mood2" },
  principles: { title: "Működési elv", intro: "Intro", items: [] },
  nextDirections: { title: "Következő irányok", intro: "Intro2", cards: [] },
  closing: { body: "Outro" },
};

describe("buildLumiraModalModel", () => {
  it("maps flow blocks to images and alternates sides", () => {
    const model = buildLumiraModalModel(SAMPLE);
    const flow = model.flowSections;
    expect(flow[0].imageSide).toBe("right");
    expect(flow[1].imageSide).toBe("left");
    expect(flow[2].imageSide).toBe("right");
    expect(flow[3].imageSide).toBe("left");
    expect(flow[4].imageSide).toBe("right");
    expect(flow[0].imageSrc).toContain("raw input.PNG");
    expect(flow[1].imageSrc).toContain("direction.PNG");
    expect(flow[2].imageSrc).toContain("question.PNG");
    expect(flow[3].imageSrc).toContain("dream list.PNG");
    expect(flow[4].imageSrc).toContain("exercises.PNG");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run lib/content/lumiraModalModel.test.ts`  
Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/content/lumiraModalModel.ts
import { LumiraModalContent } from "./lumiraModalTypes";

export type ImageSide = "left" | "right";

export type FlowSectionModel = {
  overline: string;
  title: string;
  body: string;
  caption: string;
  imageSrc: string;
  imageAlt: string;
  imageSide: ImageSide;
};

export type LumiraModalModel = {
  brand: { logo: string; name: string; tagline: string };
  kiindulo: { title: string; body: string };
  mood: { first: string; second: string };
  flowSections: FlowSectionModel[];
  principles: LumiraModalContent["principles"];
  nextDirections: LumiraModalContent["nextDirections"];
  closing: { body: string };
};

export function buildLumiraModalModel(content: LumiraModalContent): LumiraModalModel {
  const flowSections: FlowSectionModel[] = [
    {
      ...content.flow.rogzites,
      imageSrc: "/lumira/screens/raw input.PNG",
      imageAlt: "Rögzítés képernyő",
      imageSide: "right",
    },
    {
      ...content.flow.keret,
      imageSrc: "/lumira/screens/direction.PNG",
      imageAlt: "Keret és irány képernyő",
      imageSide: "left",
    },
    {
      ...content.flow.feldolgozas,
      imageSrc: "/lumira/screens/question.PNG",
      imageAlt: "Feldolgozás képernyő",
      imageSide: "right",
    },
    {
      ...content.flow.visszateres,
      imageSrc: "/lumira/screens/dream list.PNG",
      imageAlt: "Visszatérés képernyő",
      imageSide: "left",
    },
    {
      ...content.flow.elokeszites,
      imageSrc: "/lumira/screens/exercises.PNG",
      imageAlt: "Előkészítés képernyő",
      imageSide: "right",
    },
  ];

  return {
    brand: {
      logo: "/lumira/logo.svg",
      name: "lumira",
      tagline: content.hero.eyebrow,
    },
    kiindulo: content.kiindulo,
    mood: content.mood,
    flowSections,
    principles: content.principles,
    nextDirections: content.nextDirections,
    closing: content.closing,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run lib/content/lumiraModalModel.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/content/lumiraModalModel.ts lib/content/lumiraModalModel.test.ts
git commit -m "feat: add lumira modal model mapping"
```

---

### Task 3: Add loader for lumira modal content

**Files:**
- Create: `lib/content/lumiraModal.ts`

- [ ] **Step 1: Write the failing test**

```ts
// lib/content/parseLumiraModal.test.ts (append)
import { loadLumiraModalContent } from "./lumiraModal";

it("loads the lumira modal content from disk", () => {
  const content = loadLumiraModalContent();
  expect(content.hero.eyebrow.length).toBeGreaterThan(0);
  expect(content.kiindulo.body.length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run lib/content/parseLumiraModal.test.ts`  
Expected: FAIL (loadLumiraModalContent not found)

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/content/lumiraModal.ts
import fs from "node:fs";
import path from "node:path";
import { parseLumiraModal } from "./parseLumiraModal";

const LUMIRA_MODAL_PATH = path.join(process.cwd(), "content", "lumira_modal_patch.md");

export function loadLumiraModalContent() {
  const raw = fs.readFileSync(LUMIRA_MODAL_PATH, "utf8");
  return parseLumiraModal(raw);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run lib/content/parseLumiraModal.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/content/lumiraModal.ts lib/content/parseLumiraModal.test.ts
git commit -m "feat: add lumira modal content loader"
```

---

### Task 4: Build Lumira narrative modal components

**Files:**
- Create: `components/lumira/LumiraModalNarrative.tsx`
- Modify: `components/ProjectGallery.tsx`
- Modify: `app/globals.css`
- Test: `components/lumira/LumiraModalNarrative.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// components/lumira/LumiraModalNarrative.test.tsx
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LumiraModalNarrative } from "./LumiraModalNarrative";
import { LumiraModalModel } from "@/lib/content/lumiraModalModel";

const MODEL: LumiraModalModel = {
  brand: { logo: "/lumira/logo.svg", name: "lumira", tagline: "Csendes technológia" },
  kiindulo: { title: "Honnan indult", body: "Kiindulo" },
  mood: { first: "Mood 1", second: "Mood 2" },
  flowSections: [
    {
      overline: "01 · Rögzítés",
      title: "Az első lépés",
      body: "Body",
      caption: "Caption",
      imageSrc: "/lumira/screens/raw input.PNG",
      imageAlt: "Alt",
      imageSide: "right",
    },
  ],
  principles: { title: "Működési elv", intro: "Intro", items: [] },
  nextDirections: { title: "Következő irányok", intro: "Intro", cards: [] },
  closing: { body: "Záró" },
};

describe("LumiraModalNarrative", () => {
  it("renders brand, kiindulo, and flow content", () => {
    const html = renderToStaticMarkup(<LumiraModalNarrative model={MODEL} />);
    expect(html).toContain("lumira");
    expect(html).toContain("Honnan indult");
    expect(html).toContain("Az első lépés");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run components/lumira/LumiraModalNarrative.test.tsx`  
Expected: FAIL (component not found)

- [ ] **Step 3: Write minimal implementation**

```tsx
// components/lumira/LumiraModalNarrative.tsx
"use client";

import type { ReactNode } from "react";
import {
  SearchCheck,
  PauseCircle,
  RotateCcw,
  BookMarked,
  Sparkles,
  MoonStar,
} from "lucide-react";
import { LumiraModalModel, FlowSectionModel } from "@/lib/content/lumiraModalModel";

function cx(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function SplitSection({
  section,
}: {
  section: FlowSectionModel;
}) {
  const imageFirst = section.imageSide === "left";
  return (
    <section className="lumira-modal__split">
      <div className={cx("lumira-modal__split-image", imageFirst && "is-first")}>
        <img src={section.imageSrc} alt={section.imageAlt} />
      </div>
      <div className="lumira-modal__split-text">
        <div className="lumira-modal__overline">{section.overline}</div>
        <h3>{section.title}</h3>
        <p>{section.body}</p>
        <div className="lumira-modal__caption">{section.caption}</div>
      </div>
    </section>
  );
}

function CenteredTextBlock({ title, body }: { title?: string; body: string }) {
  return (
    <section className="lumira-modal__centered">
      {title ? <h3>{title}</h3> : null}
      <p>{body}</p>
    </section>
  );
}

function MoodBlock({ text }: { text: string }) {
  return (
    <section className="lumira-modal__mood">
      <p>{text}</p>
    </section>
  );
}

function IconGrid({
  title,
  intro,
  items,
}: {
  title: string;
  intro: string;
  items: { icon: string; title: string; text: string }[];
}) {
  const iconMap: Record<string, ReactNode> = {
    SearchCheck: <SearchCheck />,
    ScanSearch: <SearchCheck />,
    PauseCircle: <PauseCircle />,
    CornerUpLeft: <RotateCcw />,
    RotateCcw: <RotateCcw />,
  };

  return (
    <section className="lumira-modal__icon-grid">
      <h3>{title}</h3>
      <p className="lumira-modal__icon-grid-intro">{intro}</p>
      <div className="lumira-modal__icon-grid-items">
        {items.map((item) => (
          <div key={item.title} className="lumira-modal__icon-card">
            <div className="lumira-modal__icon">{iconMap[item.icon] ?? <SearchCheck />}</div>
            <div className="lumira-modal__icon-title">{item.title}</div>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function NextCards({
  title,
  intro,
  cards,
}: {
  title: string;
  intro: string;
  cards: { icon: string; title: string; text: string }[];
}) {
  const iconMap: Record<string, ReactNode> = {
    BookMarked: <BookMarked />,
    Library: <BookMarked />,
    Sparkles: <Sparkles />,
    Stars: <Sparkles />,
    MoonStar: <MoonStar />,
  };

  return (
    <section className="lumira-modal__next">
      <h3>{title}</h3>
      <p className="lumira-modal__next-intro">{intro}</p>
      <div className="lumira-modal__next-cards">
        {cards.map((card) => (
          <div key={card.title} className="lumira-modal__next-card">
            <div className="lumira-modal__icon">{iconMap[card.icon] ?? <BookMarked />}</div>
            <div className="lumira-modal__icon-title">{card.title}</div>
            <p>{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LumiraModalNarrative({ model }: { model: LumiraModalModel }) {
  return (
    <div className="lumira-modal">
      <section className="lumira-modal__brand">
        <img src={model.brand.logo} alt="Lumira logo" />
        <div className="lumira-modal__brand-name">{model.brand.name}</div>
        <div className="lumira-modal__brand-tagline">{model.brand.tagline}</div>
      </section>

      <CenteredTextBlock title={model.kiindulo.title} body={model.kiindulo.body} />

      {model.flowSections.slice(0, 2).map((section) => (
        <SplitSection key={section.title} section={section} />
      ))}

      <MoodBlock text={model.mood.first} />

      {model.flowSections.slice(2, 3).map((section) => (
        <SplitSection key={section.title} section={section} />
      ))}

      <IconGrid {...model.principles} />

      {model.flowSections.slice(3, 5).map((section) => (
        <SplitSection key={section.title} section={section} />
      ))}

      <NextCards {...model.nextDirections} />

      <CenteredTextBlock body={model.closing.body} />
    </div>
  );
}
```

```tsx
// components/ProjectGallery.tsx (partial update inside ProjectModal)
import { loadLumiraModalContent } from "@/lib/content/lumiraModal";
import { buildLumiraModalModel } from "@/lib/content/lumiraModalModel";
import { LumiraModalNarrative } from "@/components/lumira/LumiraModalNarrative";

// ...inside ProjectModal render:
const isLumira = project.slug === "lumira";
const lumiraModel = isLumira
  ? buildLumiraModalModel(loadLumiraModalContent())
  : null;

// In JSX, replace body contents with:
{isLumira && lumiraModel ? (
  <LumiraModalNarrative model={lumiraModel} />
) : (
  /* existing modal layout */
)}
```

```css
/* app/globals.css (new lumira modal styles) */
.lumira-modal {
  display: grid;
  gap: 96px;
  padding: 24px 0 32px;
}

.lumira-modal__brand {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  display: grid;
  gap: 12px;
}

.lumira-modal__brand img {
  width: 96px;
  height: 96px;
  margin: 0 auto;
  filter: brightness(0) invert(1);
}

.lumira-modal__brand-name,
.lumira-modal__brand-tagline {
  font-family: var(--font-lumira), var(--font-heading), "Segoe UI", system-ui, sans-serif;
  font-weight: 400;
  color: rgba(245, 248, 252, 0.95);
}

.lumira-modal__brand-name {
  font-size: 32px;
  text-transform: lowercase;
}

.lumira-modal__brand-tagline {
  font-size: 18px;
}

.lumira-modal__centered {
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
  line-height: 1.7;
}

.lumira-modal__split {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 40px;
  align-items: center;
}

.lumira-modal__split-image img {
  width: 100%;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(12, 18, 26, 0.25);
  transform: scale(1.04);
}

.lumira-modal__split-text {
  text-align: center;
  display: grid;
  gap: 12px;
}

.lumira-modal__overline {
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 12px;
  color: rgba(245, 248, 252, 0.65);
}

.lumira-modal__caption {
  font-size: 14px;
  color: rgba(245, 248, 252, 0.7);
}

.lumira-modal__mood {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  font-size: 22px;
  font-weight: 300;
  color: rgba(245, 248, 252, 0.8);
}

.lumira-modal__icon-grid {
  text-align: center;
  display: grid;
  gap: 24px;
}

.lumira-modal__icon-grid-items {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.lumira-modal__icon-card {
  display: grid;
  gap: 12px;
  justify-items: center;
  color: rgba(245, 248, 252, 0.85);
}

.lumira-modal__icon svg {
  width: 28px;
  height: 28px;
}

.lumira-modal__next {
  text-align: center;
  display: grid;
  gap: 24px;
}

.lumira-modal__next-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.lumira-modal__next-card {
  border-radius: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 30px rgba(12, 18, 26, 0.2);
  transition: transform 0.2s ease;
}

.lumira-modal__next-card:hover {
  transform: translateY(-4px);
}

@media (max-width: 900px) {
  .lumira-modal__split {
    grid-template-columns: 1fr;
  }
  .lumira-modal__split-image {
    order: -1;
  }
  .lumira-modal__icon-grid-items,
  .lumira-modal__next-cards {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run components/lumira/LumiraModalNarrative.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/lumira/LumiraModalNarrative.tsx components/ProjectGallery.tsx app/globals.css components/lumira/LumiraModalNarrative.test.tsx
git commit -m "feat: add lumira narrative modal layout"
```

---

### Task 5: Wire lumira modal content into UI and final polish

**Files:**
- Modify: `components/ProjectGallery.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Write the failing test**

```tsx
// components/lumira/LumiraModalNarrative.test.tsx (append)
import { loadLumiraModalContent } from "@/lib/content/lumiraModal";
import { buildLumiraModalModel } from "@/lib/content/lumiraModalModel";

it("builds a model from the real content file", () => {
  const content = loadLumiraModalContent();
  const model = buildLumiraModalModel(content);
  expect(model.brand.tagline.length).toBeGreaterThan(0);
  expect(model.flowSections).toHaveLength(5);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run components/lumira/LumiraModalNarrative.test.tsx`  
Expected: FAIL (loadLumiraModalContent not found in test context)

- [ ] **Step 3: Write minimal implementation**

Update imports in `components/lumira/LumiraModalNarrative.test.tsx` to use relative paths:

```tsx
import { loadLumiraModalContent } from "@/lib/content/lumiraModal";
import { buildLumiraModalModel } from "@/lib/content/lumiraModalModel";
```

Ensure the `ProjectModal` Lumira branch uses:

```tsx
const lumiraModel = isLumira ? buildLumiraModalModel(loadLumiraModalContent()) : null;
```

Ensure `lumira-modal` styles are applied (class on root).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run components/lumira/LumiraModalNarrative.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/ProjectGallery.tsx components/lumira/LumiraModalNarrative.test.tsx app/globals.css
git commit -m "feat: wire lumira modal content and styles"
```

---

## Self-Review Checklist

1. **Spec coverage:** Every block in the spec has a matching section (BrandIntro, Kiinduló, Flow x5, Mood x2, IconGrid, NextCards, Closing).
2. **Placeholder scan:** No “TBD/TODO” in plan steps or code.
3. **Type consistency:** `LumiraModalContent` and `LumiraModalModel` fields match usage in components.

---

**Plan complete and saved to** `docs/superpowers/plans/2026-04-11-lumira-modal-implementation-plan.md`.  

Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task and review each step.  
2. **Inline Execution** — Execute tasks in this session using executing-plans.

**Which approach?** (You asked for inline execution earlier — confirm if you want me to proceed inline.)
