# Kincstartó Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Kincstartó modal using existing Lumira modal components and update the Kincstartó project card background to the card_background asset.

**Architecture:** Reuse the Lumira narrative modal component structure, driven by a new Kincstartó modal model and content parsing, and conditionally render it only for `project.slug === "kincstarto"`. Update `projectVisuals` to point the Kincstartó card background to its `card_background` asset.

**Tech Stack:** Next.js, React, CSS, Vitest

---

### Task 1: Add Kincstartó modal content model

**Files:**
- Create: `lib/content/kincstartoModalModel.ts`
- Modify: `lib/content/types.ts`

- [ ] **Step 1: Create the Kincstartó modal model**

```ts
import { KincstartoModalContent } from "./kincstartoModalTypes";

export type KincstartoImageSide = "left" | "right";

export type KincstartoFlowSection = {
  title: string;
  body: string;
  imageSrcs: string[];
  imageAlt: string;
  imageSide: KincstartoImageSide;
};

export type KincstartoModalModel = {
  brand: { logo: string; name: string; tagline: string };
  intro: { body: string };
  principles: KincstartoModalContent["principles"];
  flowSections: KincstartoFlowSection[];
  mood: { text: string };
  nextDirections: KincstartoModalContent["nextDirections"];
  closing: { body: string };
};

export function buildKincstartoModalModel(content: KincstartoModalContent): KincstartoModalModel {
  const flowSections: KincstartoFlowSection[] = [
    {
      ...content.books,
      imageSrcs: [
        "/kincstarto/screens/konyvtar_1.PNG",
        "/kincstarto/screens/konyvtar_2.PNG",
      ],
      imageAlt: "Könyvtár képernyő",
      imageSide: "right",
    },
    {
      ...content.meditation,
      imageSrcs: [
        "/kincstarto/screens/meditacio_1.PNG",
        "/kincstarto/screens/meditacio_2.PNG",
      ],
      imageAlt: "Meditáció képernyő",
      imageSide: "left",
    },
    {
      ...content.yoga,
      imageSrcs: [
        "/kincstarto/screens/joga_1.PNG",
        "/kincstarto/screens/joga_2.PNG",
      ],
      imageAlt: "Jóga képernyő",
      imageSide: "right",
    },
  ];

  return {
    brand: {
      logo: "/kincstarto/logo.svg",
      name: "kincstartó",
      tagline: content.brand.tagline,
    },
    intro: content.intro,
    principles: content.principles,
    flowSections,
    mood: content.mood,
    nextDirections: content.nextDirections,
    closing: content.closing,
  };
}
```

- [ ] **Step 2: Update types for new modal model**

```ts
export type KincstartoModalModel = import("./kincstartoModalModel").KincstartoModalModel;
```

- [ ] **Step 3: Commit**

```bash
git add lib/content/kincstartoModalModel.ts lib/content/types.ts
git commit -m "feat: add kincstarto modal model"
```

---

### Task 2: Parse Kincstartó modal content

**Files:**
- Create: `lib/content/kincstartoModalTypes.ts`
- Create: `lib/content/kincstartoModal.ts`

- [ ] **Step 1: Define content types**

```ts
export type KincstartoModalContent = {
  brand: { tagline: string };
  intro: { body: string };
  principles: {
    title: string;
    intro?: string;
    items: { icon: string; title: string; text: string }[];
  };
  books: { title: string; body: string };
  meditation: { title: string; body: string };
  yoga: { title: string; body: string };
  mood: { text: string };
  nextDirections: {
    title: string;
    intro?: string;
    cards: { title: string; text: string }[];
  };
  closing: { body: string };
};
```

- [ ] **Step 2: Implement the content loader**

```ts
import fs from "fs";
import path from "path";
import { KincstartoModalContent } from "./kincstartoModalTypes";

export function loadKincstartoModalContent(): KincstartoModalContent {
  const filePath = path.join(process.cwd(), "content", "kincstarto_modal_patch.md");
  const raw = fs.readFileSync(filePath, "utf-8");

  return {
    brand: { tagline: "Egy személyes tér olvasáshoz, gyakorláshoz és elmélyüléshez." },
    intro: {
      body:
        "Ez a projekt egy személyes gyűjteményből indult: könyvek, jegyzetek és visszatérő gyakorlatok egy helyre rendezéséből.\nIdővel egymásra rétegződtek benne különböző irányok — olvasás, meditáció és mozgás — nem különálló funkciókként, hanem egy közös tér részeként.\n\nNem egy általános használatra tervezett alkalmazás, inkább egy belső tér, ami használat közben alakult ki, és azóta is folyamatosan formálódik.",
    },
    principles: {
      title: "Működési elv",
      items: [
        {
          icon: "bookmark",
          title: "Személyes válogatás",
          text: "Nem teljes gyűjtés, hanem tudatosan kiválasztott tartalom.",
        },
        {
          icon: "rotate-ccw",
          title: "Visszatérő használat",
          text: "Nem egyszeri felfedezésre, hanem újrahasználatra épül.",
        },
        {
          icon: "compass",
          title: "Lassú felfedezés",
          text: "A tartalom nem lineárisan, hanem saját tempóban tárul fel.",
        },
      ],
    },
    books: {
      title: "Könyvtár",
      body:
        "A könyvtár nem egy általános olvasólista, hanem egy személyes válogatás keleti filozófiáról, meditációról, pszichológiáról és ezek irodalmi megközelítéseiről.\n\nA tartalom címkék, hagyományok és szintek mentén van rendezve, így nem csak kereshető, hanem különböző nézőpontokból is bejárható.\nA rendszer egyszerű olvasási útvonalakat is képes összeállítani, amelyek egy adott téma mentén kapcsolják össze a könyveket.",
    },
    meditation: {
      title: "Meditáció",
      body:
        "A meditációs rész saját írt szövegekre épül, amelyek nem statikus formában jelennek meg, hanem időzített, ritmusra hangolt olvasási élményként.\n\nA szöveg fokozatosan jelenik meg, halk zenei aláfestéssel, így a figyelem nem csak a tartalomra, hanem az áramlására is irányul.\nIdeális esetben végigvezet, de ugyanúgy vissza lehet térni egy-egy részhez.",
    },
    yoga: {
      title: "Jóga",
      body:
        "A jóga rész a saját gyakorlásban visszatérő pózokból épül fel, kiegészítve azokkal az információkkal, amelyek segítenek pontosabban és tudatosabban végezni őket.\n\nA pózok mellett fokozatosan megjelennek a kedvenc gyakorló videók is, így a statikus tudás és a követhető gyakorlat egymás mellé kerül.",
    },
    mood: {
      text: "Nem egy hely, amit végigjársz.\nInkább egy, ahova időről időre visszatérsz.",
    },
    nextDirections: {
      title: "Következő irányok",
      cards: [
        {
          title: "Tartalom bővítése",
          text: "Új könyvek és meditációk folyamatos hozzáadása a meglévő struktúrához.",
        },
        {
          title: "Jóga tudástér mélyítése",
          text: "A gyakorlati leírások további pontosítása és rendszerezése.",
        },
        {
          title: "Anatómiai réteg",
          text: "Egy külön tudástér kialakítása, amely a test működését és a mozgás alapjait teszi érthetőbbé.",
        },
        {
          title: "Testtérkép (távlati)",
          text: "Egy vizuális felület, ahol pszichoszomatikus összefüggések mentén lehet böngészni a test működését.",
        },
      ],
    },
    closing: {
      body:
        "A projekt jelenlegi formájában használható és lezárt egységet alkot, de nem végleges.\nInkább egy olyan tér, ami a használattal együtt alakul, és mindig annyit mutat, amennyire éppen szükség van.",
    },
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/content/kincstartoModalTypes.ts lib/content/kincstartoModal.ts
git commit -m "feat: add kincstarto modal content"
```

---

### Task 3: Add Kincstartó modal component

**Files:**
- Create: `components/kincstarto/KincstartoModalNarrative.tsx`
- Modify: `components/ProjectGallery.tsx`

- [ ] **Step 1: Implement narrative component (reusing Lumira styles)**

```tsx
import React from "react";
import {
  Bookmark,
  RotateCcw,
  Compass,
} from "lucide-react";
import { KincstartoModalModel } from "@/lib/content/kincstartoModalModel";

function cx(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const iconMap = {
  bookmark: <Bookmark />,
  "rotate-ccw": <RotateCcw />,
  compass: <Compass />,
};

export function KincstartoModalNarrative({ model }: { model: KincstartoModalModel }) {
  const cta = (
    <a
      className="project-modal__cta lumira-modal__cta"
      href="https://kincstarto.vercel.app"
      target="_blank"
      rel="noreferrer"
    >
      Fedezd fel
    </a>
  );

  return (
    <div className="lumira-modal kincstarto-modal">
      <section className="lumira-modal__brand">
        <img src={model.brand.logo} alt="Kincstartó logo" />
        <div className="lumira-modal__brand-name">{model.brand.name}</div>
        <div className="lumira-modal__brand-tagline">{model.brand.tagline}</div>
        {cta}
      </section>

      <section className="lumira-modal__centered">
        <p>{model.intro.body}</p>
      </section>

      <section className="lumira-modal__icon-grid">
        <h3>{model.principles.title}</h3>
        <div className="lumira-modal__icon-grid-items">
          {model.principles.items.map((item) => (
            <div key={item.title} className="lumira-modal__icon-card">
              <div className="lumira-modal__icon">{iconMap[item.icon] ?? <Bookmark />}</div>
              <div className="lumira-modal__icon-title">{item.title}</div>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {model.flowSections.map((section, index) => (
        <section
          key={section.title}
          className={cx(
            "lumira-modal__split",
            section.imageSide === "right" && "lumira-modal__split--image-right"
          )}
        >
          <div className="lumira-modal__split-image">
            <img src={section.imageSrcs[0]} alt={section.imageAlt} />
            <img src={section.imageSrcs[1]} alt={section.imageAlt} />
          </div>
          <div className="lumira-modal__split-text">
            <h3>{section.title}</h3>
            {section.body.split(/\n\s*\n/).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}

      <section className="lumira-modal__mood">
        <p>{model.mood.text}</p>
      </section>

      <section className="lumira-modal__next">
        <h3>{model.nextDirections.title}</h3>
        <div className="lumira-modal__next-cards">
          {model.nextDirections.cards.map((card) => (
            <div key={card.title} className="lumira-modal__next-card">
              <div className="lumira-modal__icon-title">{card.title}</div>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lumira-modal__centered">
        <p>{model.closing.body}</p>
      </section>

      {cta}
    </div>
  );
}
```

- [ ] **Step 2: Render Kincstartó modal in ProjectGallery**

```tsx
import { KincstartoModalNarrative } from "@/components/kincstarto/KincstartoModalNarrative";
import { KincstartoModalModel } from "@/lib/content/kincstartoModalModel";

// in props
kincstartoModal?: KincstartoModalModel | null;

// in ProjectModal
const isKincstarto = project.slug === "kincstarto";

{isLumira && lumiraModal ? (
  <LumiraModalNarrative model={lumiraModal} />
) : isKincstarto && kincstartoModal ? (
  <KincstartoModalNarrative model={kincstartoModal} />
) : (
  ...existing...
)}
```

- [ ] **Step 3: Commit**

```bash
git add components/kincstarto/KincstartoModalNarrative.tsx components/ProjectGallery.tsx
git commit -m "feat: add kincstarto modal narrative"
```

---

### Task 4: Wire modal content into page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Load and build the Kincstartó modal model**

```tsx
import { loadKincstartoModalContent } from "@/lib/content/kincstartoModal";
import { buildKincstartoModalModel } from "@/lib/content/kincstartoModalModel";

const kincstartoModal = buildKincstartoModalModel(loadKincstartoModalContent());

<ProjectGallery
  ...
  kincstartoModal={kincstartoModal}
/>
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wire kincstarto modal content"
```

---

### Task 5: Update Kincstartó card background

**Files:**
- Modify: `lib/content/projectVisuals.ts`

- [ ] **Step 1: Point Kincstartó background to card_background**

```ts
kincstarto: {
  ...,
  background: "/kincstarto/card_background.png",
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/content/projectVisuals.ts
git commit -m "feat: update kincstarto card background"
```

---

### Task 6: Tests

- [ ] **Step 1: Run tests**

Run: `npm run test`
Expected: PASS

- [ ] **Step 2: Check git status**

Run: `git status -sb`
Expected: clean

---

## Self-Review Checklist
- Kincstartó modal uses Lumira components with new content/images
- CTA in header + closing block with correct URL
- Kincstartó card uses `card_background`
- No layout system changes or extra components beyond reuse

---

Plan complete.
