import type { Project } from "./types";
import type { UrbanEcoLabModalContent } from "./urbanEcoLabModalTypes";
import { parseUrbanEcoLabModal } from "./parseUrbanEcoLabModal";
import fs from "node:fs";
import path from "node:path";

function singleLine(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

const ICON_FILENAME_MAP: Record<string, string> = {
  "termeszetirendszerekmegertese.png": "termeszeti rendszerek megertese.png",
  "tapasztalatitanulas.png": "tapasztalati tanulas.png",
  "fenntarthatovaros.png": "fenntarthato varos.png",
  "kornyezettudatossag.png": "kornyezetitudatossag.png",
  "reflexió.png": "reflexio.png",
};

const ICONS_DIR = path.join(process.cwd(), "public", "urbanecolab", "icons");
const AVAILABLE_ICONS = (() => {
  try {
    return new Set(fs.readdirSync(ICONS_DIR));
  } catch {
    return new Set<string>();
  }
})();

function normalizeForMatch(filename: string) {
  return filename
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "")
    .replace(/[_-]+/g, "")
    .toLowerCase();
}

function findBestIconMatch(input: string) {
  const target = normalizeForMatch(input);
  if (!target) return "";
  for (const candidate of AVAILABLE_ICONS) {
    if (normalizeForMatch(candidate) === target) {
      return candidate;
    }
  }
  return "";
}

function resolveIconFilename(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const normalized = trimmed.replace(/^["']|["']$/g, "");
  if (AVAILABLE_ICONS.has(normalized)) return normalized;
  const mapped = ICON_FILENAME_MAP[normalized] ?? normalized;
  if (AVAILABLE_ICONS.has(mapped)) return mapped;
  return findBestIconMatch(mapped) || mapped;
}

function resolveIconSrc(media: string) {
  const filename = resolveIconFilename(media);
  if (!filename) return "";
  return encodeURI(`/urbanecolab/icons/${filename}`);
}

function ageGroupIconByIndex(index: number) {
  return ["/urbanecolab/icons/alsotagozat.png", "/urbanecolab/icons/felsotagozat.png", "/urbanecolab/icons/kozepiskola.png"][
    index
  ] ?? "/urbanecolab/icons/alsotagozat.png";
}

function ageGroupSlideByIndex(index: number) {
  return encodeURI(`/urbanecolab/age-groups/Slide${index + 1}.JPG`);
}

export type UrbanEcoLabModalModel = {
  project: Project;
  brand: {
    name: string;
    logo: string;
    tagline: string;
  };
  hero: { text: string };
  intro: { body: string };
  principles: {
    introText: string;
    items: Array<{ title: string; text: string; iconSrc: string }>;
  };
  learningLogic: {
    title: string;
    introText: string;
    items: Array<{ title: string; text: string; iconSrc: string }>;
    outroText: string;
  };
  competencies: {
    title: string;
    items: Array<{ title: string; text: string; imageSrc: string }>;
  };
  ageGroups: {
    title: string;
    items: Array<{
      title: string;
      text: string;
      details: string;
      iconSrc: string;
      slideSrc: string;
    }>;
  };
  modules: {
    title: string;
    items: Array<{ title: string; text: string; imageSrc: string }>;
  };
  schoolIntegration: {
    title: string;
    introText: string;
    items: Array<{ title: string; text: string; list: string[] }>;
    note: string;
  };
  mood: { text: string };
  roadmap: {
    title: string;
    introText: string;
    items: Array<{ title: string; subtitle: string; text: string }>;
    goal: string;
  };
  closing: { body: string };
  openCall: { text: string };
};

function buildProjectFromContent(content: UrbanEcoLabModalContent): Project {
  const hero = singleLine(content.hero);
  return {
    slug: "urbanecolab",
    title: "Urban Eco Lab",
    hero,
    card: hero,
    what: [content.hero, content.intro].filter(Boolean).join("\n\n"),
    use: content.principles.introText,
    features: content.modules.items.map((item) => item.title).filter(Boolean),
    unique: content.learningLogic.introText,
    status: content.heroStatus,
    direction: content.roadmap.items.map((item) => item.title).filter(Boolean),
  };
}

export function buildUrbanEcoLabModalModel(raw: string): UrbanEcoLabModalModel {
  const content = parseUrbanEcoLabModal(raw);
  const project = buildProjectFromContent(content);

  return {
    project,
    brand: {
      name: content.title,
      logo: "/urbanecolab/logo.svg",
      tagline: content.tagline,
    },
    hero: { text: content.hero },
    intro: { body: content.intro },
    principles: {
      introText: content.principles.introText,
      items: content.principles.items.map((item) => ({
        title: item.title,
        text: item.text,
        iconSrc: resolveIconSrc(item.media),
      })),
    },
    learningLogic: {
      title: content.learningLogic.title,
      introText: content.learningLogic.introText,
      items: content.learningLogic.items.map((item) => ({
        title: item.title,
        text: item.text,
        iconSrc: resolveIconSrc(item.media),
      })),
      outroText: content.learningLogic.outroText,
    },
    competencies: {
      title: content.competencies.title,
      items: content.competencies.items.map((item) => ({
        title: item.title,
        text: item.text,
        imageSrc: resolveIconSrc(item.media),
      })),
    },
    ageGroups: {
      title: content.ageGroups.title,
      items: content.ageGroups.items.map((item, index) => ({
        title: item.title,
        text: item.text,
        details: item.details,
        iconSrc: encodeURI(ageGroupIconByIndex(index)),
        slideSrc: ageGroupSlideByIndex(index),
      })),
    },
    modules: {
      title: content.modules.title,
      items: content.modules.items.map((item) => ({
        title: item.title,
        text: item.text,
        imageSrc: resolveIconSrc(item.media),
      })),
    },
    schoolIntegration: {
      title: content.schoolIntegration.title,
      introText: content.schoolIntegration.introText,
      items: content.schoolIntegration.items,
      note: content.schoolIntegration.note,
    },
    mood: { text: content.mood },
    roadmap: {
      title: content.roadmap.title,
      introText: content.roadmap.introText,
      items: content.roadmap.items,
      goal: content.roadmap.goal,
    },
    closing: { body: content.closing },
    openCall: {
      text:
        "Ha érdekes számodra ez a program, és szívesen kapcsolódnál hozzá iskolai, közösségi vagy fejlesztési oldalról, írj nyugodtan — örülök a kérdéseknek és az együtt gondolkodásnak.",
    },
  };
}
