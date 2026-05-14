import { describe, expect, it } from "vitest";
import { createStudioSessionToken, verifyStudioSessionToken } from "./session";

describe("studio session token", () => {
  it("verifies a token generated with same key", () => {
    const token = createStudioSessionToken("secret");
    expect(verifyStudioSessionToken(token, "secret")).toBe(true);
  });

  it("rejects token with different key", () => {
    const token = createStudioSessionToken("secret");
    expect(verifyStudioSessionToken(token, "other")).toBe(false);
  });
});
