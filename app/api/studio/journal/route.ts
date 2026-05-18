import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createDefaultJournalStore } from "@/lib/journal/store";
import { ensureUniqueId, validateJournalEntryInput } from "@/lib/journal/validation";
import { STUDIO_COOKIE_NAME, verifyStudioSessionToken } from "@/lib/studio/session";

async function isAuthorized(): Promise<boolean> {
  const expected = process.env.JOURNAL_STUDIO_KEY ?? "";
  const cookieStore = await cookies();
  const token = cookieStore.get(STUDIO_COOKIE_NAME)?.value;
  return verifyStudioSessionToken(token, expected);
}

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = createDefaultJournalStore();
  return NextResponse.json({ entries: await store.listAll() });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => ({}));
  const validated = validateJournalEntryInput(payload);
  if (!validated.valid) {
    return NextResponse.json({ errors: validated.errors }, { status: 400 });
  }

  const store = createDefaultJournalStore();
  if (!ensureUniqueId(await store.listAll(), validated.value.id)) {
    return NextResponse.json({ errors: { id: "Az ID mar foglalt." } }, { status: 400 });
  }

  const saved = await store.upsert(validated.value);
  return NextResponse.json({ entry: saved });
}
