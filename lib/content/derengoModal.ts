import fs from "node:fs";
import path from "node:path";
import { parseDerengoModal } from "./parseDerengoModal";

const DERENGO_MODAL_PATH = path.join(
  process.cwd(),
  "content",
  "derengo_content_pack_patch.md"
);

export function loadDerengoModalContent() {
  const raw = fs.readFileSync(DERENGO_MODAL_PATH, "utf8");
  return parseDerengoModal(raw);
}
