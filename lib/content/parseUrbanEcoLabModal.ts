import type {
  UrbanEcoLabAgeGroupItem,
  UrbanEcoLabCompetencyItem,
  UrbanEcoLabLearningLogicItem,
  UrbanEcoLabModalContent,
  UrbanEcoLabModuleItem,
  UrbanEcoLabPrincipleItem,
  UrbanEcoLabRoadmapItem,
  UrbanEcoLabSchoolIntegrationItem,
} from "./urbanEcoLabModalTypes";

function normalize(input: string) {
  return input.replace(/\r\n/g, "\n");
}

function collapseText(lines: string[]) {
  const paragraphs: string[] = [];
  let current: string[] = [];

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      if (current.length > 0) {
        paragraphs.push(current.join(" ").trim());
        current = [];
      }
      continue;
    }
    current.push(line.trim());
  }

  if (current.length > 0) {
    paragraphs.push(current.join(" ").trim());
  }

  return paragraphs.join("\n\n").trim();
}

function readTitle(input: string) {
  const match = input.match(/^#\s+(.+)\s*$/m);
  return match?.[1]?.trim() ?? "Urban Eco Learning Lab";
}

function splitBlocks(input: string) {
  const lines = input.split("\n");
  const blocks: string[] = [];
  let current: string[] = [];
  let inSection = false;

  function flush() {
    const block = current.join("\n").trim();
    if (block) blocks.push(block);
    current = [];
  }

  for (const line of lines) {
    if (line.trim() === "---") continue;
    if (line.startsWith("## ")) {
      if (inSection) flush();
      inSection = true;
      current.push(line);
      continue;
    }

    if (!inSection) continue;
    current.push(line);
  }

  if (current.length > 0) flush();
  return blocks;
}

function blockHeading(block: string) {
  const match = block.match(/^##\s+(.+)\s*$/m);
  return match?.[1]?.trim() ?? "";
}

function blockBodyLines(block: string) {
  const lines = block.split("\n");
  const headingIndex = lines.findIndex((line) => line.startsWith("## "));
  if (headingIndex === -1) {
    return [];
  }
  return lines.slice(headingIndex + 1);
}

function findKeyIndex(lines: string[], key: string) {
  return lines.findIndex((line) => line.trimStart().startsWith(`${key}:`));
}

function collectAfterKey(lines: string[], key: string) {
  const start = findKeyIndex(lines, key);
  if (start === -1) return [];

  const collected: string[] = [];
  const [, initial = ""] = lines[start].split(/:\s*/, 2);
  const isPipe = initial.trim() === "|";
  if (!isPipe && initial.length > 0) {
    collected.push(initial);
  }

  const allowedKeys = new Set([
    "title",
    "text",
    "text-2",
    "items",
    "media",
    "note",
    "goal",
    "status",
    "subtitle",
    "list",
  ]);

  function isNextKeyLine(trimmed: string) {
    const match = trimmed.match(/^([a-z0-9_-]+):\s*/i);
    if (!match) return false;
    return allowedKeys.has(match[1].toLowerCase());
  }

  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      collected.push("");
      continue;
    }

    if (!isPipe && isNextKeyLine(trimmed)) {
      break;
    }

    if (isPipe) {
      if (isNextKeyLine(trimmed)) {
        break;
      }
      collected.push(line.replace(/^\s+/, ""));
      continue;
    }

    collected.push(line);
  }

  while (collected[0]?.trim() === "") collected.shift();
  while (collected[collected.length - 1]?.trim() === "") collected.pop();
  return collected;
}

function parseObjectList<T extends Record<string, unknown>>(
  lines: string[],
  mapItem: (item: Record<string, string>) => T
) {
  const result: T[] = [];
  let current: Record<string, string> | null = null;
  let multilineKey: string | null = null;
  let lastKey: string | null = null;
  let itemIndent: number | null = null;

  function finish() {
    if (!current) return;
    result.push(mapItem(current));
    current = null;
    multilineKey = null;
    lastKey = null;
  }

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, "  ");
    const trimmedEnd = line.trimEnd();
    const isBlank = !trimmedEnd.trim();
    const indent = line.match(/^\s*/)?.[0]?.length ?? 0;

    if (isBlank) {
      if (multilineKey && current) {
        current[multilineKey] = `${current[multilineKey] ?? ""}\n`.trimEnd();
      }
      continue;
    }

    const plain = trimmedEnd.trim();
    if (plain === "---") continue;

    const itemStartMatch = trimmedEnd.match(/^\s*-\s+([a-z0-9_-]+):\s*(.*)$/i);
    if (itemStartMatch) {
      if (itemIndent === null) itemIndent = indent;

      if (indent === itemIndent) {
        finish();
        current = {};
        multilineKey = null;
        lastKey = null;
        const [, key, value] = itemStartMatch;
        current[key] = value.trim();
        lastKey = key;
        multilineKey = value.trim() ? null : key;
        continue;
      }
    }

    if (!current) continue;

    const propertyMatch = trimmedEnd.match(/^\s*([a-z0-9_-]+):\s*(.*)$/i);
    if (propertyMatch && itemIndent !== null && indent > itemIndent) {
      const [, key, rawValue] = propertyMatch;
      const value = rawValue.trim();
      const isPipe = value === "|";
      current[key] = isPipe ? "" : value;
      lastKey = key;
      multilineKey = isPipe || !value ? key : null;
      continue;
    }

    const appendKey = multilineKey ?? lastKey;
    if (!appendKey) continue;

    const existing = current[appendKey] ?? "";
    const glued = existing ? `${existing}\n${plain}` : plain;
    current[appendKey] = glued;
  }

  finish();
  return result;
}

function sectionText(block: string, key: string) {
  return collapseText(collectAfterKey(blockBodyLines(block), key));
}

function parseTagline(block: string) {
  return sectionText(block, "text");
}

function parseHero(block: string) {
  return sectionText(block, "text");
}

function parseHeroStatus(block: string) {
  return sectionText(block, "status");
}

function parseIntro(block: string) {
  return sectionText(block, "text");
}

function parsePrinciples(block: string) {
  const lines = blockBodyLines(block);
  const introText = sectionText(block, "text");

  const itemsIndex = findKeyIndex(lines, "items");
  if (itemsIndex !== -1) {
    const itemsLines = lines.slice(itemsIndex + 1);
    const items: UrbanEcoLabPrincipleItem[] = parseObjectList(itemsLines, (item) => ({
      title: item.title ?? "",
      text: item.text ?? "",
      media: item.media ?? "",
    }));
    return { introText, items };
  }

  const items: UrbanEcoLabPrincipleItem[] = [];
  const raw = normalize(block);
  const parts = raw.split(/\n###\s+/).slice(1);
  for (const part of parts) {
    const [titleLine, ...rest] = part.split("\n");
    const title = titleLine.trim();
    const itemLines = rest;
    const text = collapseText(collectAfterKey(itemLines, "text"));
    const media = collapseText(collectAfterKey(itemLines, "media"));
    if (title) {
      items.push({ title, text, media });
    }
  }

  return { introText, items };
}

function parseLearningLogic(block: string) {
  const lines = blockBodyLines(block);
  const title = collapseText(collectAfterKey(lines, "title"));

  const itemsIndex = findKeyIndex(lines, "items");
  const beforeItems = itemsIndex === -1 ? lines : lines.slice(0, itemsIndex);
  const afterItems = itemsIndex === -1 ? [] : lines.slice(itemsIndex + 1);

  const introText = collapseText(collectAfterKey(beforeItems, "text"));

  let itemLines: string[] = afterItems;
  let outroText = "";
  const topLevelAfterIndex = afterItems.findIndex((line) =>
    /^[a-z0-9_-]+:\s*/i.test(line.trimEnd()) && !/^\s/.test(line)
  );
  if (topLevelAfterIndex !== -1) {
    itemLines = afterItems.slice(0, topLevelAfterIndex);
    const outroLines = afterItems.slice(topLevelAfterIndex);
    outroText = collapseText(collectAfterKey(outroLines, "text"));
  }

  const items: UrbanEcoLabLearningLogicItem[] = parseObjectList(itemLines, (item) => ({
    title: item.title ?? "",
    text: item.text ?? "",
    media: item.media ?? "",
  }));

  return { title, introText, items, outroText };
}

function parseCompetencies(block: string) {
  const lines = blockBodyLines(block);
  const title = collapseText(collectAfterKey(lines, "title"));
  const itemsIndex = findKeyIndex(lines, "items");
  const itemsLines = itemsIndex === -1 ? [] : lines.slice(itemsIndex + 1);

  const items: UrbanEcoLabCompetencyItem[] = parseObjectList(itemsLines, (item) => ({
    title: item.title ?? "",
    text: (item.text ?? "").toString().replace(/^\s*text:/i, "").trim(),
    media: item.media ?? "",
  }));

  return { title, items };
}

function parseAgeGroups(block: string) {
  const lines = blockBodyLines(block);
  const title = collapseText(collectAfterKey(lines, "title"));
  const itemsIndex = findKeyIndex(lines, "items");
  const itemsLines = itemsIndex === -1 ? [] : lines.slice(itemsIndex + 1);

  const items: UrbanEcoLabAgeGroupItem[] = parseObjectList(itemsLines, (item) => ({
    title: item.title ?? "",
    text: item.text ?? "",
    details: item["text-2"] ?? "",
  }));

  return { title, items };
}

function parseModules(block: string) {
  const lines = blockBodyLines(block);
  const title = collapseText(collectAfterKey(lines, "title"));
  const itemsIndex = findKeyIndex(lines, "items");
  const itemsLines = itemsIndex === -1 ? [] : lines.slice(itemsIndex + 1);

  const items: UrbanEcoLabModuleItem[] = parseObjectList(itemsLines, (item) => ({
    title: item.title ?? "",
    text: item.text ?? "",
    media: item.media ?? "",
  }));

  return { title, items };
}

function parseSchoolIntegration(block: string) {
  const lines = blockBodyLines(block);
  const title = collapseText(collectAfterKey(lines, "title"));
  const introText = collapseText(collectAfterKey(lines, "text"));

  const itemsIndex = findKeyIndex(lines, "items");
  const noteIndex = findKeyIndex(lines, "note");
  const itemsLines =
    itemsIndex === -1
      ? []
      : noteIndex === -1
        ? lines.slice(itemsIndex + 1)
        : lines.slice(itemsIndex + 1, noteIndex);

  const note = noteIndex === -1 ? "" : collapseText(collectAfterKey(lines.slice(noteIndex), "note"));

  const items: UrbanEcoLabSchoolIntegrationItem[] = parseObjectList(itemsLines, (item) => ({
    title: item.title ?? "",
    text: item.text ?? "",
    list: (item.list ?? "")
      .toString()
      .split("\n")
      .map((line) => line.replace(/^-+\s*/, "").trim())
      .filter(Boolean),
  }));

  return { title, introText, items, note };
}

function parseMood(block: string) {
  return sectionText(block, "text");
}

function parseRoadmap(block: string) {
  const lines = blockBodyLines(block);
  const title = collapseText(collectAfterKey(lines, "title"));
  const introText = collapseText(collectAfterKey(lines, "text"));

  const itemsIndex = findKeyIndex(lines, "items");
  const goalIndex = findKeyIndex(lines, "goal");
  const goal = goalIndex === -1 ? "" : collapseText(collectAfterKey(lines.slice(goalIndex), "goal"));

  const itemsLines =
    itemsIndex === -1
      ? []
      : goalIndex === -1
        ? lines.slice(itemsIndex + 1)
        : lines.slice(itemsIndex + 1, goalIndex);

  const items: UrbanEcoLabRoadmapItem[] = parseObjectList(itemsLines, (item) => ({
    title: item.title ?? "",
    subtitle: item.subtitle ?? "",
    text: item.text ?? "",
  }));

  return { title, introText, items, goal };
}

function parseClosing(block: string) {
  return sectionText(block, "text");
}

export function parseUrbanEcoLabModal(raw: string): UrbanEcoLabModalContent {
  const input = normalize(raw);
  const title = readTitle(input);
  const blocks = splitBlocks(input);
  const byHeading = new Map<string, string>();

  for (const block of blocks) {
    const heading = blockHeading(block);
    if (heading) {
      byHeading.set(heading, block);
    }
  }

  const taglineBlock = byHeading.get("tagline") ?? "";
  const heroBlock = byHeading.get("hero") ?? "";
  const introBlock = byHeading.get("intro") ?? "";
  const principlesBlock = byHeading.get("principles") ?? "";
  const learningLogicBlock = byHeading.get("learning-logic") ?? "";
  const competenciesBlock = byHeading.get("competencies") ?? "";
  const ageGroupsBlock = byHeading.get("age-groups") ?? "";
  const modulesBlock = byHeading.get("modules") ?? "";
  const schoolIntegrationBlock = byHeading.get("school-integration") ?? "";
  const moodBlock = byHeading.get("mood") ?? "";
  const roadmapBlock = byHeading.get("roadmap") ?? "";
  const closingBlock = byHeading.get("closing") ?? "";

  return {
    title,
    tagline: parseTagline(taglineBlock),
    hero: parseHero(heroBlock),
    heroStatus: parseHeroStatus(heroBlock),
    intro: parseIntro(introBlock),
    principles: parsePrinciples(principlesBlock),
    learningLogic: parseLearningLogic(learningLogicBlock),
    competencies: parseCompetencies(competenciesBlock),
    ageGroups: parseAgeGroups(ageGroupsBlock),
    modules: parseModules(modulesBlock),
    schoolIntegration: parseSchoolIntegration(schoolIntegrationBlock),
    mood: parseMood(moodBlock),
    roadmap: parseRoadmap(roadmapBlock),
    closing: parseClosing(closingBlock),
  };
}
