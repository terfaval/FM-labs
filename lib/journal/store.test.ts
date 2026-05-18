import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGet, mockPut } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPut: vi.fn(),
}));

vi.mock("@vercel/blob", () => ({
  get: mockGet,
  put: mockPut,
}));

import {
  createBlobJournalStore,
  createDefaultJournalStore,
  createFileJournalStore,
} from "./store";

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

describe("BlobJournalStore", () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPut.mockReset();
  });

  it("reads journal document without CDN cache", async () => {
    mockGet.mockResolvedValue(null);
    const store = createBlobJournalStore("journal/journal.json", "private");

    await store.listAll();

    expect(mockGet).toHaveBeenCalledWith("journal/journal.json", {
      access: "private",
      useCache: false,
    });
  });

  it("returns an empty journal when blob read throws", async () => {
    mockGet.mockRejectedValue(new Error("No token found."));
    const store = createBlobJournalStore("journal/journal.json", "private");

    await expect(store.listPublished()).resolves.toEqual([]);
  });

  it("uses public access by default when env is missing", async () => {
    const previous = process.env.JOURNAL_BLOB_ACCESS;
    try {
      delete process.env.JOURNAL_BLOB_ACCESS;
      mockGet.mockResolvedValue(null);

      const store = createDefaultJournalStore();
      await store.listAll();

      expect(mockGet).toHaveBeenCalledWith("journal/journal.json", {
        access: "public",
        useCache: false,
      });
    } finally {
      if (previous === undefined) {
        delete process.env.JOURNAL_BLOB_ACCESS;
      } else {
        process.env.JOURNAL_BLOB_ACCESS = previous;
      }
    }
  });
});
