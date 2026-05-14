import fs from "node:fs";
import path from "node:path";

export type MirachaiBlock = {
  id: string;
  type: string;
  title: string;
  text: string;
  media: string[];
  layout: string;
  steps?: {
    title: string;
    text: string;
    media: string[];
  }[];
};

export type MirachaiModalModel = {
  brand: { logo: string; name: string; tagline: string; appUrl: string };
  hero: { title: string; intro: string };
  blocks: MirachaiBlock[];
  closing: { title: string; text: string; layout: string };
};

const MIRACHAI_MODAL_PATH = path.join(process.cwd(), "content", "mirachai_modal_patch.md");

function normalize(input: string) {
  return input.replace(/\r\n/g, "\n");
}

function collapse(text: string) {
  return text
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

function takeSection(raw: string, startHeading: string, nextHeading?: string) {
  const start = raw.indexOf(startHeading);
  if (start === -1) return "";
  const rest = raw.slice(start + startHeading.length);
  if (!nextHeading) return rest.trim();
  const end = rest.indexOf(nextHeading);
  if (end === -1) return rest.trim();
  return rest.slice(0, end).trim();
}

function getField(section: string, key: string) {
  const lines = normalize(section).split("\n");
  const keyPattern = new RegExp(`^${key}:\\s*(.*)$`);
  const collected: string[] = [];
  let reading = false;

  for (const line of lines) {
    const match = line.match(keyPattern);
    if (match) {
      reading = true;
      const first = (match[1] ?? "").trimEnd();
      if (first.length > 0) {
        collected.push(first);
      }
      continue;
    }

    if (!reading) {
      continue;
    }

    const trimmed = line.trim();
    if (trimmed === "---" || /^[a-z_]+:\s*/.test(trimmed)) {
      break;
    }

    collected.push(line);
  }

  return collapse(collected.join("\n"));
}

function parseMedia(section: string) {
  const mediaBlock = getField(section, "media");
  if (!mediaBlock) return [];
  return mediaBlock
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^-+\s*/, "").trim())
    .map(mapMediaRef);
}

function parseSteps(section: string) {
  const lines = normalize(section).split("\n");
  const stepLines: string[] = [];
  let inSteps = false;

  for (const line of lines) {
    if (!inSteps) {
      if (line.trim() === "steps:") {
        inSteps = true;
      }
      continue;
    }

    if (/^[a-z_]+:\s*/.test(line)) {
      break;
    }

    stepLines.push(line);
  }

  if (stepLines.length === 0) return [];

  const steps: Array<{ title: string; textLines: string[]; media: string[] }> = [];
  let current: { title: string; textLines: string[]; media: string[] } | null = null;
  let mode: "text" | "media" | null = null;

  for (const rawLine of stepLines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      if (mode === "text" && current) {
        current.textLines.push("");
      }
      continue;
    }

    const stepMatch = trimmed.match(/^-+\s+title:\s*(.+)$/);
    if (stepMatch) {
      current = { title: stepMatch[1]?.trim() ?? "", textLines: [], media: [] };
      steps.push(current);
      mode = null;
      continue;
    }

    if (!current) {
      continue;
    }

    if (/^text:\s*$/.test(trimmed)) {
      mode = "text";
      continue;
    }

    if (/^media:\s*$/.test(trimmed)) {
      mode = "media";
      continue;
    }

    if (mode === "text") {
      current.textLines.push(trimmed);
      continue;
    }

    if (mode === "media") {
      const mediaMatch = trimmed.match(/^-+\s*(.+)$/);
      if (mediaMatch && mediaMatch[1]) {
        current.media.push(mapMediaRef(mediaMatch[1].trim()));
      }
    }
  }

  return steps.map((step) => ({
    title: step.title,
    text: collapse(step.textLines.join("\n")),
    media: step.media,
  }));
}

function mapMediaRef(ref: string) {
  if (ref === "mirachai-logo.svg") {
    return "/mirachai/logo.svg";
  }
  if (/^Slide\d+\.(PNG|JPG|JPEG)$/i.test(ref)) {
    return `/mirachai/screens/${ref}`;
  }
  return `/mirachai/${ref}`;
}

function parseBlock(raw: string, id: string, nextId?: string): MirachaiBlock {
  const section = takeSection(
    raw,
    `## ${id}`,
    nextId ? `## ${nextId}` : "## CLOSING"
  );
  return {
    id,
    type: getField(section, "type"),
    title: getField(section, "title"),
    text: getField(section, "text"),
    media: parseMedia(section),
    layout: getField(section, "layout"),
    steps: parseSteps(section),
  };
}

export function buildMirachaiModalModel(): MirachaiModalModel {
  const raw = normalize(fs.readFileSync(MIRACHAI_MODAL_PATH, "utf8"));
  const heroSection = takeSection(raw, "## HERO", "## BLOCK_01");
  const closingSection = takeSection(raw, "## CLOSING");

  const blockIds = [
    "BLOCK_01",
    "BLOCK_02",
    "BLOCK_03",
    "BLOCK_04",
    "BLOCK_05",
    "BLOCK_06",
    "BLOCK_07",
  ];
  const blocks = blockIds.map((id, index) =>
    parseBlock(raw, id, blockIds[index + 1])
  );

  return {
    brand: {
      logo: mapMediaRef("mirachai-logo.svg"),
      name: getField(heroSection, "title") || "Mirachai",
      tagline: getField(heroSection, "tagline"),
      appUrl: "https://mirachai.vercel.app",
    },
    hero: {
      title: getField(heroSection, "title"),
      intro: getField(heroSection, "intro"),
    },
    blocks,
    closing: {
      title: getField(closingSection, "title"),
      text: getField(closingSection, "text"),
      layout: getField(closingSection, "layout"),
    },
  };
}
