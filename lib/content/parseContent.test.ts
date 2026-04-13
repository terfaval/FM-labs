import { describe, expect, it } from "vitest";
import { loadContent } from "./loadContent";
import { parseContent } from "./parseContent";

const SAMPLE = `## META

title: Test Title
role: Test Role
language: hu

tagline:
Rovid tagline.

intro:
Elso bekezdes.

Masodik bekezdes.

about:
About szoveg.

approach:
Approach szoveg.

collaboration:
Collab szoveg.

contact_title:
Irj nyugodtan

contact_intro:
Rovid intro.

contact_helper:
Helper szoveg.

contact_submit_label:
Uzenet kuldese

---

## FEATURED PROJECTS

---

### demo

title: Demo

hero:
Hero szoveg.

card:
Card szoveg.

what:
What szoveg.

use:
Use szoveg.

features:

* Elso
* Masodik

unique:
Unique szoveg.

status:
Status szoveg.

direction:

* Egy
* Ketto

---

## OTHER PROJECTS

---
`;

describe("parseContent", () => {
  it("parses meta and projects", () => {
  const content = parseContent(SAMPLE);
  expect(content.meta.title).toBe("Test Title");
  expect(content.meta.contactTitle).toBe("Irj nyugodtan");
  expect(content.meta.contactIntro).toBe("Rovid intro.");
  expect(content.meta.contactHelper).toBe("Helper szoveg.");
  expect(content.meta.contactSubmitLabel).toBe("Uzenet kuldese");
  expect(content.featuredProjects).toHaveLength(1);
    expect(content.featuredProjects[0].slug).toBe("demo");
    expect(content.featuredProjects[0].features).toEqual(["Elso", "Masodik"]);
  });
});

describe("loadContent", () => {
  it("loads the content pack from disk", () => {
    const content = loadContent();
    expect(content.meta.title.length).toBeGreaterThan(0);
  });
});
