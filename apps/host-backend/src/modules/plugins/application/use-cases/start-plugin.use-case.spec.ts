import { Test, TestingModule } from "@nestjs/testing";
import { StartPluginUseCase } from "./start-plugin.use-case";
import { I_PLUGIN_SCANNER, I_PLUGIN_SUPERVISOR } from "../../domain/ports";
import { ConfigService } from "../../../../shared/config/config.service"; // Corrected depth
import * as fs from "fs/promises";
import * as path from "path";

// Prioritize mocking before imports that use it
jest.mock("fs/promises");

describe("StartPluginUseCase", () => {
  let useCase: StartPluginUseCase;
  let pluginScanner: any;
  let pluginSupervisor: any;
  const mockFs = fs as jest.Mocked<typeof fs>;

  beforeEach(async () => {
    pluginScanner = {
      scanDirectory: jest.fn(),
    };
    pluginSupervisor = {
      startPlugin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StartPluginUseCase,
        { provide: I_PLUGIN_SCANNER, useValue: pluginScanner },
        { provide: I_PLUGIN_SUPERVISOR, useValue: pluginSupervisor },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    useCase = module.get<StartPluginUseCase>(StartPluginUseCase);
  });

  it("should find plugin code and start it", async () => {
    const pluginId = "com.test.a";
    const pluginPath = "/plugins/test-a";
    const code = "console.log('hello')";

    pluginScanner.scanDirectory.mockResolvedValue({
      plugins: [
        {
          manifest: { id: pluginId, entrypoint: "main.js" },
          path: pluginPath,
        },
      ],
    });

    mockFs.readFile.mockResolvedValue(code);

    await useCase.execute(pluginId);

    expect(mockFs.readFile).toHaveBeenCalledWith(
      path.join(pluginPath, "main.js"),
      "utf-8"
    );
    expect(pluginSupervisor.startPlugin).toHaveBeenCalledWith(pluginId, code);
  });

  it("should throw if plugin not found", async () => {
    pluginScanner.scanDirectory.mockResolvedValue({ plugins: [] });

    await expect(useCase.execute("missing")).rejects.toThrow("not found");
  });
});
