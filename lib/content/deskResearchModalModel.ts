import fs from "node:fs";
import path from "node:path";
import type { Project } from "./types";

export type DeskResearchItem = {
  title: string;
  text: string;
  icon?: string;
  media: string[];
};

export type DeskResearchBlock = {
  id: string;
  type: string;
  title: string;
  text: string;
  media: string[];
  items: DeskResearchItem[];
  steps: DeskResearchItem[];
  intro: string;
};

export type DeskResearchModalModel = {
  project: Project;
  brand: { logo: string; name: string; tagline: string; appUrl: string };
  hero: { title: string; intro: string; media: string[] };
  blocks: DeskResearchBlock[];
  closing: { title: string; text: string };
  contact: { intro: string };
};

const MODAL_PATH = path.join(process.cwd(), "content", "desk-research-tool_modal_patch.md");
const ASSET_DIR = path.join(process.cwd(), "public", "deskresearch");

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
  if (end === -1) {
    const fallbackEnd = rest.indexOf("\n## ");
    if (fallbackEnd === -1) return rest.trim();
    return rest.slice(0, fallbackEnd).trim();
  }
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
      if (first.length > 0) collected.push(first);
      continue;
    }
    if (!reading) continue;
    const trimmed = line.trim();
    if (
      trimmed === "---" ||
      /^[a-z_]+:\s*/.test(trimmed) ||
      /^items:\s*$/.test(trimmed) ||
      /^steps:\s*$/.test(trimmed)
    ) {
      break;
    }
    collected.push(line);
  }

  return collapse(collected.join("\n"));
}

function listFilesSafe(dir: string) {
  try {
    return new Set(fs.readdirSync(dir));
  } catch {
    return new Set<string>();
  }
}

const AVAILABLE = listFilesSafe(ASSET_DIR);
const MODAL_BG = "modal background.png";
const CARD_BG = "feature card.png";
const HERO_FALLBACK = "ChatGPT Image 2026. máj. 19. 21_06_41.png";

function mediaUrl(filename: string) {
  return encodeURI(`/deskresearch/${filename}`);
}

function resolveMediaRef(ref: string) {
  const clean = ref.trim();
  if (!clean) return mediaUrl(MODAL_BG);
  if (AVAILABLE.has(clean)) return mediaUrl(clean);
  if (clean === "deskresearch-hero-editorial.png" && AVAILABLE.has(HERO_FALLBACK)) {
    return mediaUrl(HERO_FALLBACK);
  }
  if (AVAILABLE.has(MODAL_BG)) return mediaUrl(MODAL_BG);
  if (AVAILABLE.has(CARD_BG)) return mediaUrl(CARD_BG);
  return mediaUrl(clean);
}

function parseMedia(section: string) {
  const mediaBlock = getField(section, "media");
  if (!mediaBlock) return [];
  return mediaBlock
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^-+\s*/, "").trim())
    .map(resolveMediaRef);
}

function parseNestedItems(section: string, key: "items" | "steps"): DeskResearchItem[] {
  const lines = normalize(section).split("\n");
  const collected: string[] = [];
  let inList = false;
  for (const line of lines) {
    if (!inList) {
      if (line.trim() === `${key}:`) inList = true;
      continue;
    }
    if (/^[A-Z_0-9]+\s*:/.test(line.trim()) || line.trim() === "---") break;
    collected.push(line);
  }
  if (collected.length === 0) return [];

  const chunks = collected.join("\n").split(/\n\s{2}-\s+title:\s*/).slice(1);
  return chunks.map((chunk) => {
    const title = (chunk.match(/^(.+)$/m)?.[1] ?? "").trim();
    const textPipe = chunk.match(/^\s{4}text:\s*$([\s\S]*?)(?:^\s{4}(media|title|ref|type):|$)/m);
    const textInline = chunk.match(/^\s{4}text:\s*(.+)$/m);
    const text = collapse(textPipe?.[1] ?? textInline?.[1] ?? "");
    const mediaRaw = chunk.match(/^\s{4}media:\s*$([\s\S]*?)(?:^\s{2}-\s+title:|$)/m)?.[1] ?? "";
    const media = mediaRaw
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => resolveMediaRef(line.replace(/^-+\s*/, "").trim()));
    const icon = (chunk.match(/^\s{6}ref:\s*(.+)$/m)?.[1] ?? "").trim();
    return { title, text, icon, media };
  });
}

function parseBlock(raw: string, id: string, nextId?: string): DeskResearchBlock {
  const section = takeSection(raw, `## ${id}`, nextId ? `## ${nextId}` : "## CLOSING");
  return {
    id,
    type: getField(section, "type"),
    title: getField(section, "title"),
    text: getField(section, "text"),
    media: parseMedia(section),
    items: parseNestedItems(section, "items"),
    steps: parseNestedItems(section, "steps"),
    intro: getField(section, "intro"),
  };
}

export function buildDeskResearchModalModel(): DeskResearchModalModel {
  const raw = normalize(fs.readFileSync(MODAL_PATH, "utf8"));
  const heroSection = takeSection(raw, "## HERO", "## BLOCK_01");
  const closingSection = takeSection(raw, "## CLOSING", "## CONTACT");
  const contactSection = takeSection(raw, "## CONTACT");

  const blockIds = [
    "BLOCK_01",
    "BLOCK_02",
    "BLOCK_03",
    "BLOCK_04",
    "BLOCK_05",
    "BLOCK_06",
    "BLOCK_07",
    "BLOCK_08",
    "BLOCK_09",
  ];
  const blocks = blockIds.map((id, index) => parseBlock(raw, id, blockIds[index + 1]));

  const tagline = getField(heroSection, "tagline");
  const featuredCardIntro =
    "AI-támogatott desk research capability strukturált, review-olható és exportálható research workflow-khoz. A rendszer különböző market mapping, scouting és research database projektekhez is adaptálható.";
  const project: Project = {
    slug: "deskresearch",
    title: getField(heroSection, "title") || "Desk Research Workbench",
    hero: featuredCardIntro,
    card: featuredCardIntro,
    what: getField(heroSection, "intro"),
    use: blocks[1]?.text ?? "",
    features: (blocks[5]?.items ?? []).map((item) => item.title).filter(Boolean),
    unique: blocks[2]?.text ?? "",
    status: "Aktív fejlesztési workbench",
    direction: (blocks[8]?.items ?? []).map((item) => item.title).filter(Boolean),
  };

  return {
    project,
    brand: {
      logo: "/deskresearch/logo.svg",
      name: project.title,
      tagline,
      appUrl: "",
    },
    hero: {
      title: project.title,
      intro: getField(heroSection, "intro"),
      media: parseMedia(heroSection),
    },
    blocks,
    closing: {
      title: getField(closingSection, "title"),
      text: getField(closingSection, "text"),
    },
    contact: {
      intro: getField(contactSection, "intro"),
    },
  };
}
