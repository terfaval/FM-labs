import fs from "node:fs";
import path from "node:path";
import {
  JOURNAL_SCHEMA_VERSION,
  type JournalDocument,
  type JournalEntry,
} from "./types";

export type JournalStore = {
  listAll: () => JournalEntry[];
  listPublished: () => JournalEntry[];
  getById: (id: string) => JournalEntry | null;
  upsert: (entry: JournalEntry) => JournalEntry;
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

export function createFileJournalStore(filePath: string): JournalStore {
  return {
    listAll: () => sortEntries(readDocument(filePath).entries),
    listPublished: () =>
      sortEntries(readDocument(filePath).entries).filter(
        (entry) => entry.status === "published"
      ),
    getById: (id) =>
      readDocument(filePath).entries.find((entry) => entry.id === id) ?? null,
    upsert: (entry) => {
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

export function createDefaultJournalStore(): JournalStore {
  return createFileJournalStore(
    path.join(process.cwd(), "content", "journal", "journal.json")
  );
}
