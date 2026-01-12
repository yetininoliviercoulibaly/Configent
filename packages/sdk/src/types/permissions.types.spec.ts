import { describe, it, expect } from "vitest";
import { isValidPermission, PERMISSION_SCOPES } from "./permissions.types";

describe("permissions.types", () => {
  describe("PERMISSION_SCOPES", () => {
    it("should contain all expected permission scopes", () => {
      expect(PERMISSION_SCOPES).toContain("vault:read");
      expect(PERMISSION_SCOPES).toContain("network:public");
      expect(PERMISSION_SCOPES).toContain("storage:read");
      expect(PERMISSION_SCOPES).toContain("storage:write");
      expect(PERMISSION_SCOPES).toContain("ui:notify");
      expect(PERMISSION_SCOPES).toContain("schedule:register");
      expect(PERMISSION_SCOPES).toContain("mcp:call");
    });

    it("should have exactly 7 permission scopes", () => {
      expect(PERMISSION_SCOPES).toHaveLength(7);
    });
  });

  describe("isValidPermission", () => {
    it("should return true for valid permissions", () => {
      expect(isValidPermission("vault:read")).toBe(true);
      expect(isValidPermission("network:public")).toBe(true);
      expect(isValidPermission("mcp:call")).toBe(true);
    });

    it("should return false for invalid permissions", () => {
      expect(isValidPermission("invalid:permission")).toBe(false);
      expect(isValidPermission("")).toBe(false);
      expect(isValidPermission("vault:write")).toBe(false);
    });
  });
});
