import { Test, TestingModule } from "@nestjs/testing";
import { PluginRpcFactory } from "./plugin-rpc.factory";

describe("PluginRpcFactory", () => {
  let factory: PluginRpcFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PluginRpcFactory],
    }).compile();

    factory = module.get<PluginRpcFactory>(PluginRpcFactory);
  });

  it("should return empty RPC object if no permissions allowed", () => {
    const rpc = factory.createRpc([]);
    expect(Object.keys(rpc)).toHaveLength(0);
  });

  it("should return vault RPCs if vault:read is granted", () => {
    const rpc = factory.createRpc(["vault:read" as any]);

    expect(rpc["vault.getSecret"]).toBeDefined();
    expect(rpc["network.fetch"]).toBeUndefined();
  });

  it("should mixed RPCs based on permissions", () => {
    const rpc = factory.createRpc(["vault:read" as any, "ui:notify" as any]);

    expect(rpc["vault.getSecret"]).toBeDefined();
    expect(rpc["ui.notify"]).toBeDefined();
    expect(rpc["network.fetch"]).toBeUndefined();
  });

  it("should confirm RPC handlers are executable", () => {
    const rpc = factory.createRpc(["ui:notify" as any]);
    const handler = rpc["ui.notify"];

    expect(typeof handler).toBe("function");
    // We know the mock impl returns true
    expect(handler("test message")).toBe(true);
  });
});
