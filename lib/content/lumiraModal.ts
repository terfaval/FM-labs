import fs from "node:fs";
import path from "node:path";
import { parseLumiraModal } from "./parseLumiraModal";

const LUMIRA_MODAL_PATH = path.join(process.cwd(), "content", "lumira_modal_patch.md");

export function loadLumiraModalContent() {
  const raw = fs.readFileSync(LUMIRA_MODAL_PATH, "utf8");
  return parseLumiraModal(raw);
}
