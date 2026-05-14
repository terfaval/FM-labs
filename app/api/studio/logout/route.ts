import { NextResponse } from "next/server";
import { STUDIO_COOKIE_NAME } from "@/lib/studio/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(STUDIO_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
