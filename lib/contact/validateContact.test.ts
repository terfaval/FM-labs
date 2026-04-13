import { describe, expect, it } from "vitest";
import { validateContact } from "./validateContact";

describe("validateContact", () => {
  it("requires message", () => {
    const result = validateContact({ message: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.message).toBeDefined();
  });

  it("accepts empty email", () => {
    const result = validateContact({ message: "Szia" });
    expect(result.valid).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = validateContact({ message: "Szia", email: "bad-email" });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });
});
