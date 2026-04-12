import fs from "fs";
import path from "path";
import { KincstartoModalContent } from "./kincstartoModalTypes";

function sliceAfter(raw: string, heading: string) {
  const index = raw.indexOf(heading);
  if (index === -1) return "";
  return raw.slice(index + heading.length).trim();
}

function takeSection(raw: string, heading: string, nextHeading?: string) {
  const start = raw.indexOf(heading);
  if (start === -1) return "";
  const rest = raw.slice(start + heading.length);
  if (!nextHeading) return rest.trim();
  const end = rest.indexOf(nextHeading);
  if (end === -1) return rest.trim();
  return rest.slice(0, end).trim();
}

function parseListItems(section: string) {
  return section
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [titlePart, textPart] = line.split("—").map((piece) => piece.trim());
      return { title: titlePart.replace(/^\d+\)\s*/, ""), text: textPart ?? "" };
    });
}

export function loadKincstartoModalContent(): KincstartoModalContent {
  const filePath = path.join(process.cwd(), "content", "kincstarto_modal_patch.md");
  const raw = fs.readFileSync(filePath, "utf-8");

  const brandBlock = takeSection(raw, "## Brand", "## Kiinduló blokk");
  const tagline = sliceAfter(brandBlock, "Tagline:").split("\n")[0]?.trim() ?? "";

  const intro = takeSection(raw, "## Kiinduló blokk", "## Működési elv");
  const principlesBlock = takeSection(raw, "## Működési elv", "## Könyv blokk");
  const books = takeSection(raw, "## Könyv blokk", "## Meditáció blokk");
  const meditation = takeSection(raw, "## Meditáció blokk", "## Jóga blokk");
  const yoga = takeSection(raw, "## Jóga blokk", "## Mood blokk");
  const mood = takeSection(raw, "## Mood blokk", "## Következő irányok");
  const nextDirectionsBlock = takeSection(raw, "## Következő irányok", "## Záró blokk");
  const closing = takeSection(raw, "## Záró blokk");

  const principleItems = parseListItems(principlesBlock).map((item) => {
    const icons = ["bookmark", "rotate-ccw", "compass"];
    return { ...item, icon: icons.shift() ?? "bookmark" };
  });

  const nextDirections = parseListItems(nextDirectionsBlock).filter(
    (card) => card.title !== "Jóga tudástér mélyítése"
  );

  return {
    brand: { tagline },
    intro: { body: intro },
    principles: {
      title: "Működési elv",
      items: principleItems.map((item, index) => ({
        icon: ["bookmark", "rotate-ccw", "compass"][index] ?? "bookmark",
        title: item.title,
        text: item.text,
      })),
    },
    books: { title: "Könyvtár", body: books },
    meditation: { title: "Meditáció", body: meditation },
    yoga: { title: "Jóga", body: yoga },
    mood: { text: mood },
    nextDirections: {
      title: "Következő irányok",
      cards: nextDirections,
    },
    closing: { body: closing },
  };
}
