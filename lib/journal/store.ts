import fs from "node:fs";
import path from "node:path";
import { list, put } from "@vercel/blob";
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
  const accessOrder: BlobAccess[] =
    access === "private" ? ["private", "public"] : ["public", "private"];
  const normalizedPath = pathname.replace(/^\/+/, "");
  const lastSlashIndex = normalizedPath.lastIndexOf("/");
  const directoryPrefix =
    lastSlashIndex >= 0 ? normalizedPath.slice(0, lastSlashIndex + 1) : "";
  const fileName = lastSlashIndex >= 0 ? normalizedPath.slice(lastSlashIndex + 1) : normalizedPath;
  const fileExtIndex = fileName.lastIndexOf(".");
  const fileBase = fileExtIndex >= 0 ? fileName.slice(0, fileExtIndex) : fileName;
  const fileExt = fileExtIndex >= 0 ? fileName.slice(fileExtIndex) : "";
  const pathVariants = Array.from(
    new Set([pathname, normalizedPath, `/${normalizedPath}`])
  );

  async function readBlobUrl(url: string): Promise<JournalDocument | null> {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    const raw = await response.text();
    if (!raw.trim()) {
      return createEmptyDocument();
    }
    return JSON.parse(raw) as JournalDocument;
  }

  try {
    for (const currentAccess of accessOrder) {
      for (const candidatePath of pathVariants) {
        const listed = await list({ prefix: candidatePath, limit: 25 });
        const scoped = listed.blobs.filter((blob) =>
          blob.url.includes(`.${currentAccess}.blob.vercel-storage.com`)
        );
        const candidates = scoped.length > 0 ? scoped : listed.blobs;
        const exact =
          candidates.find((blob) => blob.pathname === normalizedPath) ??
          candidates.find(
            (blob) =>
              blob.pathname === candidatePath ||
              blob.pathname.endsWith(`/${normalizedPath}`)
          );
        let blobToRead = exact;
        if (!blobToRead && directoryPrefix) {
          const directoryList = await list({ prefix: directoryPrefix, limit: 200 });
          const scopedDirectory = directoryList.blobs.filter((blob) =>
            blob.url.includes(`.${currentAccess}.blob.vercel-storage.com`)
          );
          const directoryCandidates =
            scopedDirectory.length > 0 ? scopedDirectory : directoryList.blobs;
          const related = directoryCandidates
            .filter((blob) => {
              const name = blob.pathname.slice(directoryPrefix.length);
              if (!name.endsWith(fileExt)) {
                return false;
              }
              if (name === fileName) {
                return true;
              }
              return name.startsWith(`${fileBase}-`);
            })
            .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
          blobToRead = related[0];
        }
        if (!blobToRead) {
          continue;
        }
        const byUrl = await readBlobUrl(blobToRead.url);
        if (byUrl) {
          return byUrl;
        }
      }
    }
    return createEmptyDocument();
  } catch (error) {
    console.error("[journal] Blob read failed, serving empty journal.", error);
    return createEmptyDocument();
  }
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
  const access = process.env.JOURNAL_BLOB_ACCESS === "private" ? "private" : "public";
  return createBlobJournalStore(blobPath, access);
}
