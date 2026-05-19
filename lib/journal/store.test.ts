import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockPut, mockList, mockFetch } = vi.hoisted(() => ({
  mockPut: vi.fn(),
  mockList: vi.fn(),
  mockFetch: vi.fn(),
}));

vi.mock("@vercel/blob", () => ({
  put: mockPut,
  list: mockList,
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
    mockPut.mockReset();
    mockList.mockReset();
    mockFetch.mockReset();
    vi.stubGlobal("fetch", mockFetch);
  });

  it("reads journal document without CDN cache", async () => {
    mockList.mockResolvedValue({ blobs: [], hasMore: false });
    const store = createBlobJournalStore("journal/journal.json", "private");

    await store.listAll();

    expect(mockList).toHaveBeenCalledWith({
      prefix: "journal/journal.json",
      limit: 25,
    });
  });

  it("returns an empty journal when blob read throws", async () => {
    mockList.mockRejectedValue(new Error("No token found."));
    const store = createBlobJournalStore("journal/journal.json", "private");

    await expect(store.listPublished()).resolves.toEqual([]);
  });

  it("uses public access by default when env is missing", async () => {
    const previous = process.env.JOURNAL_BLOB_ACCESS;
    try {
      delete process.env.JOURNAL_BLOB_ACCESS;
      mockList.mockResolvedValue({ blobs: [], hasMore: false });

      const store = createDefaultJournalStore();
      await store.listAll();

      expect(mockList).toHaveBeenCalledWith({
        prefix: "journal/journal.json",
        limit: 25,
      });
    } finally {
      if (previous === undefined) {
        delete process.env.JOURNAL_BLOB_ACCESS;
      } else {
        process.env.JOURNAL_BLOB_ACCESS = previous;
      }
    }
  });

  it("falls back to URL lookup when pathname get misses", async () => {
    mockFetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          schemaVersion: "v1",
          entries: [
            {
              id: "x",
              date: "2026-05-18",
              project: "portfolio",
              type: "feature",
              status: "draft",
              title: "X",
              summary: "X",
              body: "X",
              steps: [{ label: "l", text: "t" }],
              nextStep: "n",
            },
          ],
        }),
        { status: 200 }
      )
    );
    mockList.mockResolvedValue({
      blobs: [
        {
          url: "https://example.public.blob.vercel-storage.com/journal/journal.json",
          pathname: "journal/journal.json",
        },
      ],
      hasMore: false,
    });

    const store = createBlobJournalStore("journal/journal.json", "public");
    const entries = await store.listAll();

    expect(entries).toHaveLength(1);
    expect(entries[0]?.id).toBe("x");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://example.public.blob.vercel-storage.com/journal/journal.json",
      { cache: "no-store" }
    );
  });
});
