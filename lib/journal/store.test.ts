import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createFileJournalStore } from "./store";

describe("FileJournalStore", () => {
  it("returns only published entries in listPublished", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "journal-"));
    const filePath = path.join(dir, "journal.json");
    fs.writeFileSync(
      filePath,
      JSON.stringify({
        schemaVersion: "v1",
        entries: [
          {
            id: "a",
            date: "2026-05-14",
            project: "portfolio",
            type: "planning",
            status: "draft",
            title: "A",
            summary: "A",
            body: "A",
            steps: [{ label: "l", text: "t" }],
            nextStep: "n",
          },
          {
            id: "b",
            date: "2026-05-15",
            project: "portfolio",
            type: "feature",
            status: "published",
            title: "B",
            summary: "B",
            body: "B",
            steps: [{ label: "l", text: "t" }],
            nextStep: "n",
          },
        ],
      }),
      "utf8"
    );
    const store = createFileJournalStore(filePath);
    const entries = await store.listPublished();
    expect(entries).toHaveLength(1);
    expect(entries[0]?.id).toBe("b");
  });
});
