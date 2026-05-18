import { NextResponse } from "next/server";
import { createDefaultJournalStore } from "@/lib/journal/store";

export async function GET() {
  const store = createDefaultJournalStore();
  return NextResponse.json({ entries: await store.listPublished() });
}
