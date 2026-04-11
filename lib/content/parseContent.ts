import { ContentPack, Meta, Project } from "./types";

const META_KEYS = [
  "title",
  "role",
  "language",
  "tagline",
  "intro",
  "about",
  "approach",
  "collaboration"
] as const;

type MetaKey = (typeof META_KEYS)[number];

type FieldValue = {
  value: string;
  list: string[];
};

function splitLines(input: string): string[] {
  return input.replace(/\r\n/g, "\n").split("\n");
}

function isKeyLine(line: string): boolean {
  return /^[a-z_]+:\s*/.test(line.trim());
}

function parseKeyValues(lines: string[]): Record<string, FieldValue> {
  const result: Record<string, FieldValue> = {};
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!match) {
      i += 1;
      continue;
    }

    const key = match[1];
    const initial = match[2] ?? "";
    const collected: string[] = [];
    const listItems: string[] = [];

    if (initial.length > 0) {
      collected.push(initial);
    }

    i += 1;

    while (i < lines.length && !isKeyLine(lines[i])) {
      const current = lines[i];
      if (/^\s*\*\s*/.test(current)) {
        listItems.push(current.replace(/^\s*\*\s*/, "").trim());
      } else {
        collected.push(current);
      }
      i += 1;
    }

    const value = collected.join("\n").trim();
    result[key] = { value, list: listItems };
  }

  return result;
}

function parseMetaBlock(lines: string[]): Meta {
  const values = parseKeyValues(lines);
  const meta: Partial<Meta> = {};

  for (const key of META_KEYS) {
    meta[key] = values[key]?.value ?? "";
  }

  meta.approachItems = values.approach?.list ?? [];

  return meta as Meta;
}

function parseProjectBlock(slug: string, lines: string[]): Project {
  const values = parseKeyValues(lines);

  return {
    slug,
    title: values.title?.value ?? "",
    hero: values.hero?.value ?? "",
    card: values.card?.value ?? "",
    what: values.what?.value ?? "",
    use: values.use?.value ?? "",
    features: values.features?.list ?? [],
    unique: values.unique?.value ?? "",
    status: values.status?.value ?? "",
    direction: values.direction?.list ?? []
  };
}

function extractSection(lines: string[], startMarker: string, endMarker?: string): string[] {
  const startIndex = lines.findIndex((line) => line.trim() === startMarker);
  if (startIndex === -1) {
    return [];
  }

  const endIndex = endMarker
    ? lines.findIndex((line, idx) => idx > startIndex && line.trim() === endMarker)
    : -1;

  if (endIndex === -1) {
    return lines.slice(startIndex + 1);
  }

  return lines.slice(startIndex + 1, endIndex);
}

function parseProjectsSection(lines: string[]): Project[] {
  const projects: Project[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(/^###\s+(.+)$/);
    if (!match) {
      i += 1;
      continue;
    }

    const slug = match[1].trim();
    i += 1;

    const block: string[] = [];
    while (i < lines.length && !lines[i].startsWith("### ")) {
      if (lines[i].trim() !== "---") {
        block.push(lines[i]);
      }
      i += 1;
    }

    projects.push(parseProjectBlock(slug, block));
  }

  return projects;
}

export function parseContent(input: string): ContentPack {
  const lines = splitLines(input);

  const metaLines = extractSection(lines, "## META", "---");
  const featuredLines = extractSection(lines, "## FEATURED PROJECTS", "## OTHER PROJECTS");
  const otherLines = extractSection(lines, "## OTHER PROJECTS");

  const meta = parseMetaBlock(metaLines);
  const featuredProjects = parseProjectsSection(featuredLines);
  const otherProjects = parseProjectsSection(otherLines);

  return { meta, featuredProjects, otherProjects };
}
