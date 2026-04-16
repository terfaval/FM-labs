import type {
  DerengoCarouselItem,
  DerengoCommunityItem,
  DerengoFlowItem,
  DerengoFutureItem,
  DerengoInspirationItem,
  DerengoModalContent,
  DerengoSensoryItem,
} from "./derengoModalTypes";

function normalize(input: string) {
  return input.replace(/\r\n/g, "\n");
}

function splitScenes(input: string) {
  const matches = [...input.matchAll(/^## SCENE (\d+)\s+—\s+.+$/gm)];
  const scenes = new Map<number, string>();

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const sceneNumber = Number(match[1]);
    const start = match.index ?? 0;
    const end =
      index + 1 < matches.length
        ? (matches[index + 1].index ?? input.length)
        : input.length;
    scenes.set(sceneNumber, input.slice(start, end).trim());
  }

  return scenes;
}

function isTopLevelKey(line: string) {
  return /^[a-z_]+:\s*/.test(line);
}

function collapseText(lines: string[]) {
  const paragraphs: string[] = [];
  let current: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === "---") {
      continue;
    }
    if (!line) {
      if (current.length > 0) {
        paragraphs.push(current.join(" "));
        current = [];
      }
      continue;
    }
    current.push(line);
  }

  if (current.length > 0) {
    paragraphs.push(current.join(" "));
  }

  return paragraphs.join("\n\n").trim();
}

function fieldLines(scene: string, key: string) {
  const lines = scene.split("\n");
  const start = lines.findIndex((line) => line.startsWith(`${key}:`));
  if (start === -1) {
    return [];
  }

  const [, initial = ""] = lines[start].split(/:\s*/, 2);
  const collected = initial ? [initial] : [];

  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith("## SCENE ")) {
      break;
    }
    if (isTopLevelKey(line)) {
      break;
    }
    collected.push(line);
  }

  while (collected[0]?.trim() === "") {
    collected.shift();
  }
  while (collected[collected.length - 1]?.trim() === "") {
    collected.pop();
  }

  return collected;
}

function fieldText(scene: string, key: string) {
  return collapseText(fieldLines(scene, key));
}

function fieldList(scene: string, key: string) {
  return fieldLines(scene, key)
    .map((line) => line.trim())
    .filter((line) => Boolean(line) && line !== "---")
    .map((line) => line.replace(/^- /, "").trim());
}

function parseObjectList<T extends Record<string, string>>(
  lines: string[],
  mapItem: (item: Record<string, string>) => T
) {
  const result: T[] = [];
  let current: Record<string, string> | null = null;
  let multilineKey: string | null = null;

  function finishCurrent() {
    if (!current) {
      return;
    }
    result.push(mapItem(current));
    current = null;
    multilineKey = null;
  }

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, "  ");
    const trimmed = line.trim();

    if (!trimmed || trimmed === "---") {
      continue;
    }

    if (trimmed.startsWith("- ")) {
      finishCurrent();
      current = {};
      multilineKey = null;

      const match = trimmed.match(/^- ([a-z_]+):\s*(.*)$/);
      if (match) {
        const [, key, value] = match;
        current[key] = value.trim();
        multilineKey = value.trim() ? null : key;
      }
      continue;
    }

    if (!current) {
      continue;
    }

    const propertyMatch = trimmed.match(/^([a-z_]+):\s*(.*)$/);
    if (propertyMatch) {
      const [, key, value] = propertyMatch;
      if (key === "url") {
        current.linkUrl = value.trim();
        multilineKey = null;
        continue;
      }
      current[key] = value.trim();
      multilineKey = value.trim() ? null : key;
      continue;
    }

    if (multilineKey) {
      current[multilineKey] = current[multilineKey]
        ? `${current[multilineKey]} ${trimmed}`.trim()
        : trimmed;
    }
  }

  finishCurrent();
  return result;
}

function parseCarousel(scene: string): DerengoCarouselItem[] {
  return parseObjectList(fieldLines(scene, "right_carousel"), (item) => ({
    icon: item.icon ?? "",
    title: item.title ?? "",
    text: item.text ?? "",
  }));
}

function parseFlowItems(scene: string): DerengoFlowItem[] {
  return parseObjectList(fieldLines(scene, "items"), (item) => ({
    title: item.title ?? "",
    text: item.text ?? "",
    media: item.media ?? "",
  }));
}

function parseSensoryItems(scene: string): DerengoSensoryItem[] {
  return parseObjectList(fieldLines(scene, "items"), (item) => ({
    icon: item.icon ?? "",
    text: item.text ?? "",
  }));
}

function parseCommunityItems(scene: string): DerengoCommunityItem[] {
  return parseObjectList(fieldLines(scene, "items"), (item) => ({
    title: item.title ?? "",
    text: item.text ?? "",
    media: item.media ?? "",
  }));
}

function parseFutureItems(scene: string): DerengoFutureItem[] {
  return parseObjectList(fieldLines(scene, "items"), (item) => ({
    title: item.title ?? "",
    text: item.text ?? "",
  }));
}

function parseInspirations(scene: string): DerengoInspirationItem[] {
  return parseObjectList(fieldLines(scene, "items"), (item) => ({
    id: item.id ?? "",
    title: item.title ?? "",
    location: item.location ?? "",
    image: item.image ?? "",
    shortLabel: item.short_label ?? "",
    description: item.description ?? "",
    linkUrl: item.linkUrl ?? "",
  }));
}

export function parseDerengoModal(raw: string): DerengoModalContent {
  const input = normalize(raw);
  const scenes = splitScenes(input);
  const scene0 = scenes.get(0) ?? "";
  const scene1 = scenes.get(1) ?? "";
  const scene2 = scenes.get(2) ?? "";
  const scene3 = scenes.get(3) ?? "";
  const scene4 = scenes.get(4) ?? "";
  const scene5 = scenes.get(5) ?? "";
  const scene6 = scenes.get(6) ?? "";
  const scene7 = scenes.get(7) ?? "";
  const scene8 = scenes.get(8) ?? "";
  const scene9 = scenes.get(9) ?? "";
  const scene10 = scenes.get(10) ?? "";

  return {
    hero: {
      title: fieldText(scene0, "title"),
      subtitle: fieldText(scene0, "subtitle"),
      text: fieldText(scene0, "text"),
      media: fieldList(scene0, "media"),
    },
    scene1: {
      content: fieldText(scene1, "content"),
    },
    scene2: {
      leftContent: fieldText(scene2, "left_content"),
      rightCarousel: parseCarousel(scene2),
    },
    scene3: {
      content: fieldText(scene3, "content"),
    },
    scene4: {
      items: parseFlowItems(scene4),
    },
    scene5: {
      introText: fieldText(scene5, "intro_text"),
      items: parseSensoryItems(scene5),
    },
    scene6: {
      introText: fieldText(scene6, "intro_text"),
      items: parseCommunityItems(scene6),
    },
    scene7: {
      content: fieldText(scene7, "content"),
    },
    scene8: {
      items: parseFutureItems(scene8),
    },
    scene9: {
      items: parseInspirations(scene9),
    },
    scene10: {
      content: fieldText(scene10, "content"),
    },
  };
}
