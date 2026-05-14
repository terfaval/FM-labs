import crypto from "node:crypto";

export const STUDIO_COOKIE_NAME = "studio_session";

function sign(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export function createStudioSessionToken(key: string): string {
  return sign(key);
}

export function verifyStudioSessionToken(
  token: string | undefined,
  key: string
): boolean {
  if (!token || !key) {
    return false;
  }
  return token === sign(key);
}
