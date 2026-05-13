import fs from "node:fs";
import path from "node:path";
import type { Project } from "./types";

type NoviraGridItem = {
  title: string;
  text: string;
  icon: string;
};

export type NoviraModalModel = {
  project: Project;
  brand: { logo: string; name: string; tagline: string; appUrl: string };
  hero: { title: string; text: string; imageSrc: string; imageAlt: string };
  intro: { title: string; text: string };
  audience: { title: string; items: NoviraGridItem[] };
  library: { title: string; text: string; imageSrc: string; imageAlt: string };
  manifesto: { quote: string };
  editor: {
    title: string;
    text: string;
    imageSrcs: [string, string];
    imageAlt: string;
  };
  annotations: { title: string; text: string; imageSrc: string; imageAlt: string };
  principles: { title: string; items: NoviraGridItem[] };
  future: { title: string; text: string };
  closing: { title: string; text: string };
};

const NOVIRA_MODAL_PATH = path.join(process.cwd(), "content", "novira_modal_patch.md");

function normalize(input: string) {
  return input.replace(/\r\n/g, "\n");
}

function collapseText(input: string) {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n\n");
}

function getTopValue(raw: string, key: string) {
  const match = raw.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return (match?.[1] ?? "").trim();
}

function getPipeValue(block: string, key: string) {
  const match = block.match(new RegExp(`^\\s*${key}:\\s*(.*)$`, "m"));
  if (!match || match.index === undefined) return "";
  const firstValue = (match[1] ?? "").trim();
  const start = match.index + match[0].length;
  const rest = block.slice(start);
  const lines = rest.split("\n");
  const collected: string[] = [];

  if (firstValue.length > 0 && firstValue !== "|") {
    collected.push(firstValue);
  }

  for (const line of lines) {
    if (/^\s{2}[a-z_]+:\s*/.test(line) || /^\s{2}-\s+id:\s*/.test(line)) {
      break;
    }
    if (/^\s{4}[a-z_]+:\s*/.test(line) && !/^\s{6}/.test(line)) {
      break;
    }
    if (firstValue === "|") {
      collected.push(line.replace(/^\s{4}/, ""));
    } else if (/^\s{6}/.test(line) || line.trim().length === 0) {
      collected.push(line.replace(/^\s{6}/, ""));
    } else {
      break;
    }
  }
  return collapseText(collected.join("\n"));
}

function getSectionById(raw: string, id: string) {
  const blocks = raw.split(/\n\s*-\s+id:\s*/);
  for (const block of blocks.slice(1)) {
    if (block.startsWith(`${id}\n`)) {
      return `- id: ${block}`;
    }
  }
  return "";
}

function parseItems(section: string): NoviraGridItem[] {
  const itemsBlockMatch = section.match(/^\s*items:\s*$/m);
  if (!itemsBlockMatch || itemsBlockMatch.index === undefined) return [];
  const itemsBlock = section.slice(itemsBlockMatch.index + itemsBlockMatch[0].length);
  const chunks = itemsBlock.split(/\n\s{6}-\s+title:\s*/).slice(1);
  return chunks.map((chunk) => {
    const title = (chunk.match(/^(.+)$/m)?.[1] ?? "").trim();
    const textPipeMatch = chunk.match(/^\s{8}text:\s*\|\s*$([\s\S]*?)(?:^\s{8}media:|$)/m);
    const textInlineMatch = chunk.match(/^\s{8}text:\s*(.+)$/m);
    const text = textPipeMatch
      ? collapseText((textPipeMatch[1] ?? "").replace(/^\s{10}/gm, ""))
      : collapseText(textInlineMatch?.[1] ?? "");
    const icon = (chunk.match(/^\s{10}ref:\s*(.+)$/m)?.[1] ?? "").trim();
    return { title, text, icon };
  });
}

function mapImage(ref: string) {
  const known: Record<string, string> = {
    "novira-library-screen.png": "/novira/screens/novira-library-screen.JPG",
    "novira-editor-screen.png": "/novira/screens/novira-editor-screen.JPG",
    "novira-editor-screen-2.png": "/novira/screens/Slide2.JPG",
    "novira-footnote-screen.png": "/novira/screens/novira-footnote-screen.JPG",
    "novira-hero-editorial.png": "/novira/screens/Slide1.JPG",
  };
  return known[ref] ?? "/novira/screens/Slide1.JPG";
}

export function buildNoviraModalModel(): NoviraModalModel {
  const raw = normalize(fs.readFileSync(NOVIRA_MODAL_PATH, "utf8"));
  const heroBlock = raw.slice(raw.indexOf("hero:"), raw.indexOf("sections:"));

  const introSection = getSectionById(raw, "intro");
  const audienceSection = getSectionById(raw, "audience");
  const librarySection = getSectionById(raw, "library");
  const manifestoSection = getSectionById(raw, "manifesto");
  const editorSection = getSectionById(raw, "editor");
  const annotationsSection = getSectionById(raw, "annotations");
  const principlesSection = getSectionById(raw, "principles");
  const futureSection = getSectionById(raw, "future");
  const closingRaw = raw.slice(raw.indexOf("closing:"));

  const heroTitle = getPipeValue(heroBlock, "title");
  const heroText = getPipeValue(heroBlock, "text");
  const heroMediaRef = (heroBlock.match(/^\s*ref:\s*(.+)$/m)?.[1] ?? "").trim();

  const projectHero = heroText.split("\n")[0] ?? "";

  return {
    project: {
      slug: "novira",
      title: "Novira",
      hero: projectHero,
      card: projectHero,
      what: getPipeValue(introSection, "text"),
      use: getPipeValue(librarySection, "text"),
      features: parseItems(audienceSection).map((item) => item.title),
      unique: getPipeValue(editorSection, "text"),
      status: "Korai működő demó",
      direction: getPipeValue(futureSection, "text").split("\n\n").filter(Boolean),
    },
    brand: {
      logo: "/novira/logo.svg",
      name: getTopValue(raw, "title") || "Novira",
      tagline: getTopValue(raw, "tagline"),
      appUrl: "https://novira-theta.vercel.app",
    },
    hero: {
      title: heroTitle,
      text: heroText,
      imageSrc: mapImage(heroMediaRef),
      imageAlt: "Novira hangulati kompozíció",
    },
    intro: {
      title: (introSection.match(/^\s*title:\s*(.+)$/m)?.[1] ?? "").trim(),
      text: getPipeValue(introSection, "text"),
    },
    audience: {
      title: (audienceSection.match(/^\s*title:\s*(.+)$/m)?.[1] ?? "").trim(),
      items: parseItems(audienceSection),
    },
    library: {
      title: (librarySection.match(/^\s*title:\s*(.+)$/m)?.[1] ?? "").trim(),
      text: getPipeValue(librarySection, "text"),
      imageSrc: mapImage("novira-library-screen.png"),
      imageAlt: "Novira könyvtár nézet",
    },
    manifesto: {
      quote: getPipeValue(manifestoSection, "quote"),
    },
    editor: {
      title: (editorSection.match(/^\s*title:\s*(.+)$/m)?.[1] ?? "").trim(),
      text: getPipeValue(editorSection, "text"),
      imageSrcs: [
        mapImage("novira-editor-screen.png"),
        mapImage("novira-editor-screen-2.png"),
      ],
      imageAlt: "Novira szerkesztő nézet",
    },
    annotations: {
      title: (annotationsSection.match(/^\s*title:\s*(.+)$/m)?.[1] ?? "").trim(),
      text: getPipeValue(annotationsSection, "text"),
      imageSrc: mapImage("novira-footnote-screen.png"),
      imageAlt: "Novira lábjegyzet nézet",
    },
    principles: {
      title: (principlesSection.match(/^\s*title:\s*(.+)$/m)?.[1] ?? "").trim(),
      items: parseItems(principlesSection),
    },
    future: {
      title: (futureSection.match(/^\s*title:\s*(.+)$/m)?.[1] ?? "").trim(),
      text: getPipeValue(futureSection, "text"),
    },
    closing: {
      title: (closingRaw.match(/^\s*title:\s*(.+)$/m)?.[1] ?? "").trim(),
      text: getPipeValue(closingRaw, "text"),
    },
  };
}
