import fs from "node:fs";
import path from "node:path";
import { parseContent } from "./parseContent";
import { ContentPack } from "./types";

const CONTENT_PATH = path.join(process.cwd(), "content", "portfolio_content_pack.md");

export function loadContent(): ContentPack {
  const raw = fs.readFileSync(CONTENT_PATH, "utf8");
  return parseContent(raw);
}
