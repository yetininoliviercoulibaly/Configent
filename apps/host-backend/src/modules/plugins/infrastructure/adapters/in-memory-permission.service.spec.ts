import { Test, TestingModule } from "@nestjs/testing";
import { InMemoryPermissionService } from "./in-memory-permission.service";

describe("InMemoryPermissionService", () => {
  let service: InMemoryPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InMemoryPermissionService],
    }).compile();

    service = module.get<InMemoryPermissionService>(InMemoryPermissionService);
  });

  const pluginId = "com.test.plugin";
  const scope = "vault:read";

  it("should deny by default", async () => {
    const granted = await service.isGranted(pluginId, scope);
    expect(granted).toBe(false);
  });

  it("should grant permission", async () => {
    await service.grant(pluginId, scope);
    const granted = await service.isGranted(pluginId, scope);
    expect(granted).toBe(true);
  });

  it("should revoke permission", async () => {
    await service.grant(pluginId, scope);
    await service.revoke(pluginId, scope);
    const granted = await service.isGranted(pluginId, scope);
    expect(granted).toBe(false);
  });
});
