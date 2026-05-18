import type { JournalEntry } from "./types";

export function mergeJournalEntries(
  primary: JournalEntry[],
  secondary: JournalEntry[]
): JournalEntry[] {
  const byId = new Map<string, JournalEntry>();
  for (const entry of primary) {
    byId.set(entry.id, entry);
  }
  for (const entry of secondary) {
    if (!byId.has(entry.id)) {
      byId.set(entry.id, entry);
    }
  }
  return [...byId.values()].sort((a, b) => b.date.localeCompare(a.date));
}
