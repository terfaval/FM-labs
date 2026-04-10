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

collaboration:
Collab szoveg.

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
