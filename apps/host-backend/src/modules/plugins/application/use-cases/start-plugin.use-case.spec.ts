import { Test, TestingModule } from "@nestjs/testing";
import { StartPluginUseCase } from "./start-plugin.use-case";
import { 
  I_PLUGIN_SCANNER, 
  I_PLUGIN_SUPERVISOR, 
  I_PERMISSION_SERVICE, 
  I_PLUGIN_RPC_FACTORY 
} from "../../domain/ports";
import { ConfigService } from "../../../../shared/config/config.service"; // Corrected depth
import * as fs from "fs/promises";
import * as path from "path";

// Prioritize mocking before imports that use it
jest.mock("fs/promises");

describe("StartPluginUseCase", () => {
  let useCase: StartPluginUseCase;
  let pluginScanner: any;
  let pluginSupervisor: any;
  let permissionService: any;
  let rpcFactory: any;
  const mockFs = fs as jest.Mocked<typeof fs>;

  beforeEach(async () => {
    pluginScanner = {
      scanDirectory: jest.fn(),
    };
    pluginSupervisor = {
      startPlugin: jest.fn(),
    };
    permissionService = {
      isGranted: jest.fn(),
    };
    rpcFactory = {
      createRpc: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StartPluginUseCase,
        { provide: I_PLUGIN_SCANNER, useValue: pluginScanner },
        { provide: I_PLUGIN_SUPERVISOR, useValue: pluginSupervisor },
        { provide: I_PERMISSION_SERVICE, useValue: permissionService },
        { provide: I_PLUGIN_RPC_FACTORY, useValue: rpcFactory },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    useCase = module.get<StartPluginUseCase>(StartPluginUseCase);
  });

  it("should find plugin code and start it with allowed RPCs", async () => {
    const pluginId = "com.test.a";
    const pluginPath = "/plugins/test-a";
    const code = "console.log('hello')";
    const permissions = ["vault:read", "bad:permission"];

    pluginScanner.scanDirectory.mockResolvedValue({
      plugins: [
        {
          manifest: { id: pluginId, entrypoint: "main.js", permissions },
          path: pluginPath,
        },
      ],
    });

    mockFs.readFile.mockResolvedValue(code);

    // Mock permissions: grant vault:read, deny bad:permission
    permissionService.isGranted.mockImplementation((id, scope) => {
      return Promise.resolve(scope === "vault:read");
    });
    
    rpcFactory.createRpc.mockReturnValue({ "vault.getSecret": jest.fn() });

    await useCase.execute(pluginId);

    expect(mockFs.readFile).toHaveBeenCalledWith(
      path.join(pluginPath, "main.js"),
      "utf-8"
    );

    // Expected allowed scopes passed to factory
    expect(rpcFactory.createRpc).toHaveBeenCalledWith(["vault:read"]);
    
    // Expected supervisor call with RPC options
    expect(pluginSupervisor.startPlugin).toHaveBeenCalledWith(pluginId, code, {
      rpc: expect.objectContaining({ "vault.getSecret": expect.any(Function) }),
    });
  });

  it("should throw if plugin not found", async () => {
    pluginScanner.scanDirectory.mockResolvedValue({ plugins: [] });

    await expect(useCase.execute("missing")).rejects.toThrow("not found");
  });
});
