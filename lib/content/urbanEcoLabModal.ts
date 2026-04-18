import fs from "node:fs";
import path from "node:path";

const URBAN_ECOLAB_MODAL_PATH = path.join(
  process.cwd(),
  "content",
  "urban-eco-learning-lab.content.md"
);

export function loadUrbanEcoLabModalContent() {
  return fs.readFileSync(URBAN_ECOLAB_MODAL_PATH, "utf8");
}

