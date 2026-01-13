import { Test, TestingModule } from "@nestjs/testing";
import { FilesystemPluginScanner } from "./filesystem-plugin-scanner.adapter";
import * as fs from "fs/promises";
import * as path from "path";
// import { safeParseManifest } from "@configent/sdk"; // Ensure this is not used directly, but mocked

// Mock entire fs/promises module
jest.mock("fs/promises");

// Mock @configent/sdk to avoid ESM/Zod runtime issues during test
jest.mock("@configent/sdk", () => ({
  safeParseManifest: jest.fn(),
}));

// Import the mocked function to verify calls/set return values
import { safeParseManifest } from "@configent/sdk";

describe("FilesystemPluginScanner", () => {
  let scanner: FilesystemPluginScanner;
  const mockFs = fs as jest.Mocked<typeof fs>;
  const mockSafeParseManifest = safeParseManifest as jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesystemPluginScanner],
    }).compile();

    scanner = module.get<FilesystemPluginScanner>(FilesystemPluginScanner);
    jest.clearAllMocks();
  });

  const pluginsDir = "/fake/plugins";

  it("should return empty lists if plugins directory does not exist", async () => {
    mockFs.access.mockRejectedValue(new Error("ENOENT"));

    const result = await scanner.scanDirectory(pluginsDir);

    expect(result.plugins).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
    expect(mockFs.access).toHaveBeenCalledWith(pluginsDir);
  });

  it("should skip files and directories without manifest.json", async () => {
    mockFs.access.mockImplementation(async (p) => {
      if (p === pluginsDir) return undefined;
      // Fail on manifest check
      throw new Error("ENOENT");
    });

    mockFs.readdir.mockResolvedValue([
      { name: "not-a-dir.txt", isDirectory: () => false } as any,
      { name: "empty-dir", isDirectory: () => true } as any,
    ]);

    const result = await scanner.scanDirectory(pluginsDir);

    expect(result.plugins).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
  });

  it("should parse valid manifest.json", async () => {
    const validManifest = {
      id: "com.test.plugin",
      name: "Test Plugin",
      version: "1.0.0",
      permissions: [],
    };

    mockFs.access.mockResolvedValue(undefined); // all access checks pass
    mockFs.readdir.mockResolvedValue([
      { name: "plugin-a", isDirectory: () => true } as any,
    ]);
    mockFs.readFile.mockResolvedValue(JSON.stringify(validManifest));

    // Mock validation success
    mockSafeParseManifest.mockReturnValue({
      success: true,
      data: validManifest,
    });

    const result = await scanner.scanDirectory(pluginsDir);

    expect(result.plugins).toHaveLength(1);
    expect(result.plugins[0].id).toBe("com.test.plugin");
    expect(result.errors).toHaveLength(0);
    expect(mockFs.readFile).toHaveBeenCalledWith(
      path.join(pluginsDir, "plugin-a", "manifest.json"),
      "utf-8"
    );
    expect(mockSafeParseManifest).toHaveBeenCalled();
  });

  it("should report invalid manifest.json (Validation error)", async () => {
    const invalidManifest = {
      id: "BAD-ID",
    };

    mockFs.access.mockResolvedValue(undefined);
    mockFs.readdir.mockResolvedValue([
      { name: "plugin-bad", isDirectory: () => true } as any,
    ]);
    mockFs.readFile.mockResolvedValue(JSON.stringify(invalidManifest));

    // Mock validation failure
    mockSafeParseManifest.mockReturnValue({
      success: false,
      error: {
        errors: [
          {
            path: ["id"],
            message: "Invalid format",
          },
        ],
      },
    });

    const result = await scanner.scanDirectory(pluginsDir);

    expect(result.plugins).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain("Invalid manifest");
    expect(result.errors[0].path).toContain("manifest.json");
  });

  it("should report JSON parse error", async () => {
    mockFs.access.mockResolvedValue(undefined);
    mockFs.readdir.mockResolvedValue([
      { name: "plugin-corrupt", isDirectory: () => true } as any,
    ]);
    mockFs.readFile.mockResolvedValue("{ bad json");

    const result = await scanner.scanDirectory(pluginsDir);

    expect(result.plugins).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain("Failed to parse manifest");
  });
});
