import { describe, expect, it } from "vitest";
import { shouldUsePutForSave } from "./saveMode";

describe("shouldUsePutForSave", () => {
  it("returns false when editing id is not present in known entries", () => {
    const result = shouldUsePutForSave("new-id", [{ id: "existing-id" }]);
    expect(result).toBe(false);
  });

  it("returns true when editing id exists in known entries", () => {
    const result = shouldUsePutForSave("existing-id", [{ id: "existing-id" }]);
    expect(result).toBe(true);
  });
});
