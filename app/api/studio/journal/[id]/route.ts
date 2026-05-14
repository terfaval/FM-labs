import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createDefaultJournalStore } from "@/lib/journal/store";
import { validateJournalEntryInput } from "@/lib/journal/validation";
import { STUDIO_COOKIE_NAME, verifyStudioSessionToken } from "@/lib/studio/session";

async function isAuthorized(): Promise<boolean> {
  const expected = process.env.JOURNAL_STUDIO_KEY ?? "";
  const cookieStore = await cookies();
  const token = cookieStore.get(STUDIO_COOKIE_NAME)?.value;
  return verifyStudioSessionToken(token, expected);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const payload = await request.json().catch(() => ({}));
  const validated = validateJournalEntryInput({ ...payload, id });
  if (!validated.valid) {
    return NextResponse.json({ errors: validated.errors }, { status: 400 });
  }

  const store = createDefaultJournalStore();
  if (!store.getById(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const saved = store.upsert(validated.value);
  return NextResponse.json({ entry: saved });
}
