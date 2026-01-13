import { describe, it, expect } from "vitest";
import {
  ManifestSchema,
  parseManifest,
  safeParseManifest,
} from "./manifest.schema.js";
import type { IPluginManifest } from "../types/manifest.types.js";

describe("ManifestSchema", () => {
  const validManifest: IPluginManifest = {
    id: "com.configent.moderator",
    name: "The Moderator",
    version: "1.0.0",
    permissions: ["vault:read", "mcp:call"],
  };

  describe("valid manifests", () => {
    it("should accept a valid minimal manifest", () => {
      const result = ManifestSchema.safeParse(validManifest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.entrypoint).toBe("index.js"); // default value
      }
    });

    it("should accept a valid manifest with all optional fields", () => {
      const fullManifest: IPluginManifest = {
        ...validManifest,
        description: "A content moderation plugin",
        entrypoint: "main.js",
        tiles: [
          {
            id: "status-widget",
            type: "webview",
            size: "1x1",
            src: "index.html#widget",
          },
        ],
      };

      const result = ManifestSchema.safeParse(fullManifest);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.entrypoint).toBe("main.js");
        expect(result.data.tiles).toHaveLength(1);
      }
    });
  });

  describe("id validation", () => {
    it("should reject manifest with invalid id format (not reverse-domain)", () => {
      const invalid = { ...validManifest, id: "my-plugin" };
      const result = ManifestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject manifest with uppercase in id", () => {
      const invalid = { ...validManifest, id: "Com.Configent.Plugin" };
      const result = ManifestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject manifest with only two parts in id", () => {
      const invalid = { ...validManifest, id: "com.plugin" };
      const result = ManifestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("version validation", () => {
    it("should reject manifest with invalid version format", () => {
      const invalid = { ...validManifest, version: "v1.0" };
      const result = ManifestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject manifest with two-part version", () => {
      const invalid = { ...validManifest, version: "1.0" };
      const result = ManifestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("name validation", () => {
    it("should reject manifest with empty name", () => {
      const invalid = { ...validManifest, name: "" };
      const result = ManifestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject manifest with name exceeding 50 characters", () => {
      const invalid = { ...validManifest, name: "A".repeat(51) };
      const result = ManifestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("permissions validation", () => {
    it("should reject manifest with unknown permission scope", () => {
      const invalid = {
        ...validManifest,
        permissions: ["vault:read", "vault:write"],
      };
      const result = ManifestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should accept manifest with empty permissions array", () => {
      const minimal = { ...validManifest, permissions: [] };
      const result = ManifestSchema.safeParse(minimal);
      expect(result.success).toBe(true);
    });
  });

  describe("tiles validation", () => {
    it("should reject manifest with invalid tile structure", () => {
      const invalid = {
        ...validManifest,
        tiles: [{ id: "widget" }], // missing required fields
      };
      const result = ManifestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject manifest with invalid tile size", () => {
      const invalid = {
        ...validManifest,
        tiles: [
          {
            id: "widget",
            type: "webview",
            size: "3x3", // invalid size
            src: "index.html",
          },
        ],
      };
      const result = ManifestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("missing required fields", () => {
    it("should reject manifest with missing required fields", () => {
      const invalid = { id: "com.example.plugin" };
      const result = ManifestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});

describe("parseManifest", () => {
  it("should return parsed manifest for valid input", () => {
    const valid = {
      id: "com.configent.test",
      name: "Test Plugin",
      version: "1.0.0",
      permissions: [],
    };
    const result = parseManifest(valid);
    expect(result.id).toBe("com.configent.test");
  });

  it("should throw ZodError for invalid input", () => {
    const invalid = { id: "invalid" };
    expect(() => parseManifest(invalid)).toThrow();
  });
});

describe("safeParseManifest", () => {
  it("should return success:true for valid manifest", () => {
    const valid = {
      id: "com.configent.test",
      name: "Test Plugin",
      version: "1.0.0",
      permissions: [],
    };
    const result = safeParseManifest(valid);
    expect(result.success).toBe(true);
  });

  it("should return success:false with error for invalid manifest", () => {
    const invalid = { id: "invalid" };
    const result = safeParseManifest(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeDefined();
    }
  });
});
