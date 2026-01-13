import { Test, TestingModule } from "@nestjs/testing";
import { ScanPluginsUseCase } from "./scan-plugins.use-case";
import { I_PLUGIN_SCANNER } from "../../domain/ports";
import type { IPluginScanner, DiscoveredPlugin } from "../../domain/ports";
import type { IPluginManifest } from "@configent/sdk";

describe("ScanPluginsUseCase", () => {
  let useCase: ScanPluginsUseCase;
  let pluginScanner: jest.Mocked<IPluginScanner>;

  beforeEach(async () => {
    const mockPluginScanner = {
      scanDirectory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScanPluginsUseCase,
        {
          provide: I_PLUGIN_SCANNER,
          useValue: mockPluginScanner,
        },
      ],
    }).compile();

    useCase = module.get<ScanPluginsUseCase>(ScanPluginsUseCase);
    pluginScanner = module.get(I_PLUGIN_SCANNER);
  });

  const mockDiscoveredPlugin = (id: string, name: string): DiscoveredPlugin => ({
    manifest: {
      id,
      name,
      version: "1.0.0",
      permissions: [],
      entrypoint: "index.js",
    },
    path: `/plugins/${id}`,
  });

  it("should return plugins from scanner", async () => {
    const plugins = [
      mockDiscoveredPlugin("com.test.a", "Plugin A"),
      mockDiscoveredPlugin("com.test.b", "Plugin B"),
    ];

    pluginScanner.scanDirectory.mockResolvedValue({
      plugins,
      errors: [],
    });

    const result = await useCase.execute("/plugins");

    expect(result.plugins).toHaveLength(2);
    expect(result.errors).toHaveLength(0);
    expect(result.plugins).toEqual(plugins);
  });

  it("should deduplicate plugins by id (keeping first)", async () => {
    const plugins = [
      mockDiscoveredPlugin("com.test.a", "Plugin A"),
      mockDiscoveredPlugin("com.test.a", "Plugin A Duplicate"), // Should be ignored
      mockDiscoveredPlugin("com.test.b", "Plugin B"),
    ];

    pluginScanner.scanDirectory.mockResolvedValue({
      plugins,
      errors: [],
    });

    const result = await useCase.execute("/plugins");

    expect(result.plugins).toHaveLength(2);
    expect(result.plugins.map((p) => p.manifest.id)).toEqual([
      "com.test.a",
      "com.test.b",
    ]);
    expect(result.plugins[0].manifest.name).toBe("Plugin A"); // First one kept
  });

  it("should pass through scan errors", async () => {
    const scanErrors = [
      { path: "/path/bad", message: "Invalid manifest" },
    ];

    pluginScanner.scanDirectory.mockResolvedValue({
      plugins: [],
      errors: scanErrors,
    });

    const result = await useCase.execute("/plugins");

    expect(result.errors).toEqual(scanErrors);
  });
});
