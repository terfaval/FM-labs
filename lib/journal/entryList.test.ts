import { describe, expect, it } from "vitest";
import { mergeJournalEntries } from "./entryList";
import type { JournalEntry } from "./types";

const older: JournalEntry = {
  id: "older",
  date: "2026-05-10",
  project: "portfolio",
  type: "planning",
  status: "draft",
  title: "Older",
  summary: "Older",
  body: "Older",
  steps: [{ label: "s", text: "t" }],
  nextStep: "n",
};

const newer: JournalEntry = {
  id: "newer",
  date: "2026-05-18",
  project: "portfolio",
  type: "feature",
  status: "draft",
  title: "Newer",
  summary: "Newer",
  body: "Newer",
  steps: [{ label: "s", text: "t" }],
  nextStep: "n",
};

describe("mergeJournalEntries", () => {
  it("keeps entries from secondary that are missing from primary", () => {
    const merged = mergeJournalEntries([older], [older, newer]);
    expect(merged.map((entry) => entry.id)).toEqual(["newer", "older"]);
  });

  it("prefers primary when both contain the same id", () => {
    const draftVersion = { ...newer, title: "Draft title" };
    const oldVersion = { ...newer, title: "Old title" };

    const merged = mergeJournalEntries([draftVersion], [oldVersion]);
    expect(merged[0]?.title).toBe("Draft title");
  });
});
