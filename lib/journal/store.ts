import fs from "node:fs";
import path from "node:path";
import { get, put } from "@vercel/blob";
import {
  JOURNAL_SCHEMA_VERSION,
  type JournalDocument,
  type JournalEntry,
} from "./types";

export type JournalStore = {
  listAll: () => Promise<JournalEntry[]>;
  listPublished: () => Promise<JournalEntry[]>;
  getById: (id: string) => Promise<JournalEntry | null>;
  upsert: (entry: JournalEntry) => Promise<JournalEntry>;
};

function sortEntries(entries: JournalEntry[]): JournalEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}

function readDocument(filePath: string): JournalDocument {
  if (!fs.existsSync(filePath)) {
    return { schemaVersion: JOURNAL_SCHEMA_VERSION, entries: [] };
  }
  const raw = fs.readFileSync(filePath, "utf8");
  if (!raw.trim()) {
    return { schemaVersion: JOURNAL_SCHEMA_VERSION, entries: [] };
  }
  return JSON.parse(raw) as JournalDocument;
}

function writeDocumentAtomic(filePath: string, doc: JournalDocument) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(doc, null, 2), "utf8");
  fs.renameSync(tempPath, filePath);
}

type BlobAccess = "private" | "public";

function createEmptyDocument(): JournalDocument {
  return { schemaVersion: JOURNAL_SCHEMA_VERSION, entries: [] };
}

async function readBlobDocument(
  pathname: string,
  access: BlobAccess
): Promise<JournalDocument> {
  const result = await get(pathname, { access, useCache: false });
  if (!result?.stream) {
    return createEmptyDocument();
  }
  const raw = await new Response(result.stream).text();
  if (!raw.trim()) {
    return createEmptyDocument();
  }
  return JSON.parse(raw) as JournalDocument;
}

async function writeBlobDocument(
  pathname: string,
  access: BlobAccess,
  doc: JournalDocument
) {
  await put(pathname, JSON.stringify(doc, null, 2), {
    access,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
    cacheControlMaxAge: 60,
  });
}

export function createFileJournalStore(filePath: string): JournalStore {
  return {
    listAll: async () => sortEntries(readDocument(filePath).entries),
    listPublished: async () =>
      sortEntries(readDocument(filePath).entries).filter(
        (entry) => entry.status === "published"
      ),
    getById: async (id) =>
      readDocument(filePath).entries.find((entry) => entry.id === id) ?? null,
    upsert: async (entry) => {
      const doc = readDocument(filePath);
      const existingIndex = doc.entries.findIndex(
        (current) => current.id === entry.id
      );
      if (existingIndex >= 0) {
        doc.entries[existingIndex] = entry;
      } else {
        doc.entries.push(entry);
      }
      doc.entries = sortEntries(doc.entries);
      writeDocumentAtomic(filePath, {
        schemaVersion: JOURNAL_SCHEMA_VERSION,
        entries: doc.entries,
      });
      return entry;
    },
  };
}

export function createBlobJournalStore(
  pathname: string,
  access: BlobAccess = "private"
): JournalStore {
  return {
    listAll: async () => sortEntries((await readBlobDocument(pathname, access)).entries),
    listPublished: async () =>
      sortEntries((await readBlobDocument(pathname, access)).entries).filter(
        (entry) => entry.status === "published"
      ),
    getById: async (id) =>
      (await readBlobDocument(pathname, access)).entries.find(
        (entry) => entry.id === id
      ) ?? null,
    upsert: async (entry) => {
      const doc = await readBlobDocument(pathname, access);
      const existingIndex = doc.entries.findIndex(
        (current) => current.id === entry.id
      );
      if (existingIndex >= 0) {
        doc.entries[existingIndex] = entry;
      } else {
        doc.entries.push(entry);
      }
      doc.entries = sortEntries(doc.entries);
      await writeBlobDocument(pathname, access, {
        schemaVersion: JOURNAL_SCHEMA_VERSION,
        entries: doc.entries,
      });
      return entry;
    },
  };
}

export function createDefaultJournalStore(): JournalStore {
  const blobPath = process.env.JOURNAL_BLOB_PATH ?? "journal/journal.json";
  const access = process.env.JOURNAL_BLOB_ACCESS === "public" ? "public" : "private";
  return createBlobJournalStore(blobPath, access);
}
