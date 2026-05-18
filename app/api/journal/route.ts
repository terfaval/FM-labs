import { NextResponse } from "next/server";
import { createDefaultJournalStore } from "@/lib/journal/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = createDefaultJournalStore();
  return NextResponse.json({ entries: await store.listPublished() });
}
