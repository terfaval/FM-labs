import { LumiraModalContent } from "./lumiraModalTypes";

type SectionMap = Record<string, string[]>;

type BlockMap = Record<string, SectionMap>;

function normalizeLines(input: string) {
  return input.replace(/\r\n/g, "\n").split("\n");
}

function collectSections(lines: string[]): BlockMap {
  const blocks: BlockMap = {};
  let currentBlock = "";
  let currentKey = "";

  for (const raw of lines) {
    const line = raw.trimEnd();
    const blockMatch = line.match(/^##\s+Block\s+(\d+)\s+(?:–|â€“|-)\s+(.+)$/);
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
  const hero = blocks["1"] ?? {};
  const kiindulo = blocks["2"] ?? {};
  const rogzites = blocks["3"] ?? {};
  const keret = blocks["4"] ?? {};
  const mood = blocks["5"] ?? {};
  const feldolgozas = blocks["6"] ?? {};
  const principles = blocks["7"] ?? {};
  const visszateres = blocks["8"] ?? {};
  const elokeszites = blocks["9"] ?? {};
  const nextDirections = blocks["10"] ?? {};
  const closing = blocks["11"] ?? {};

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
      second: "",
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
