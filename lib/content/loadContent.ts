import fs from "node:fs";
import path from "node:path";
import { parseContent } from "./parseContent";
import { ContentPack } from "./types";
import { buildUrbanEcoLabModalModel } from "./urbanEcoLabModalModel";
import { loadUrbanEcoLabModalContent } from "./urbanEcoLabModal";

const CONTENT_PATH = path.join(process.cwd(), "content", "portfolio_content_pack.md");

export function loadContent(): ContentPack {
  const raw = fs.readFileSync(CONTENT_PATH, "utf8");
  const content = parseContent(raw);

  try {
    const urbanRaw = loadUrbanEcoLabModalContent();
    const urbanModel = buildUrbanEcoLabModalModel(urbanRaw);
    const exists = content.otherProjects.some(
      (project) => project.slug === urbanModel.project.slug
    );
    if (!exists) {
      content.otherProjects = [...content.otherProjects, urbanModel.project];
    }
  } catch {
    // Optional content file.
  }

  return content;
}
