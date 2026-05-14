import { NextRequest, NextResponse } from "next/server";
import { createStudioSessionToken, STUDIO_COOKIE_NAME } from "@/lib/studio/session";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { key?: string };
  const expected = process.env.JOURNAL_STUDIO_KEY ?? "";

  if (!expected || !body.key || body.key !== expected) {
    return NextResponse.json({ ok: false, error: "Hibas kulcs." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(STUDIO_COOKIE_NAME, createStudioSessionToken(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
