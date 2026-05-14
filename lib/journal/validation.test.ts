import { describe, expect, it } from "vitest";
import { validateJournalEntryInput } from "./validation";

const base = {
  id: "entry-1",
  date: "2026-05-14",
  project: "portfolio",
  type: "planning",
  status: "draft",
  title: "Cim",
  summary: "Rovid osszegzes",
  body: "Hosszabb szoveg",
  steps: [{ label: "Start", text: "Elindult" }],
  nextStep: "Kovetkezo lepes",
  featured: false,
};

describe("validateJournalEntryInput", () => {
  it("accepts valid entry", () => {
    const result = validateJournalEntryInput(base);
    expect(result.valid).toBe(true);
  });

  it("rejects invalid project", () => {
    const result = validateJournalEntryInput({ ...base, project: "bad" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.project).toBeDefined();
    }
  });

  it("rejects invalid date format", () => {
    const result = validateJournalEntryInput({ ...base, date: "14-05-2026" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.date).toBeDefined();
    }
  });
});
