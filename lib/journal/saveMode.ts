type JournalIdLike = { id: string };

export function shouldUsePutForSave(
  editingId: string | null,
  entries: JournalIdLike[]
): boolean {
  if (!editingId) {
    return false;
  }
  return entries.some((entry) => entry.id === editingId);
}
