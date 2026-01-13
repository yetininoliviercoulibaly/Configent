import { Test, TestingModule } from "@nestjs/testing";
import { InMemoryPluginSupervisor } from "./in-memory-plugin-supervisor.adapter";
import { PluginStatus } from "../../domain/ports";
import { SandboxInstance } from "@configent/sandbox";

jest.mock("@configent/sandbox", () => {
  return {
    SandboxInstance: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue(undefined),
      execute: jest.fn().mockResolvedValue(undefined),
      dispose: jest.fn().mockResolvedValue(undefined),
    })),
  };
});

describe("InMemoryPluginSupervisor", () => {
  let supervisor: InMemoryPluginSupervisor;
  // Access mock instance if needed (but we can assume it works if no errors)
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InMemoryPluginSupervisor],
    }).compile();

    supervisor = module.get<InMemoryPluginSupervisor>(InMemoryPluginSupervisor);
  });

  it("should start a plugin successfully", async () => {
    await supervisor.startPlugin("p1", "code");
    
    expect(supervisor.getPluginStatus("p1")).toBe(PluginStatus.RUNNING);
    expect(SandboxInstance).toHaveBeenCalled();
  });

  it("should stop a plugin successfully", async () => {
    await supervisor.startPlugin("p1", "code");
    expect(supervisor.getPluginStatus("p1")).toBe(PluginStatus.RUNNING);

    await supervisor.stopPlugin("p1");
    expect(supervisor.getPluginStatus("p1")).toBe(PluginStatus.STOPPED);
  });

  it("should handle error during start", async () => {
    (SandboxInstance as unknown as jest.Mock).mockImplementationOnce(() => ({
      initialize: jest.fn().mockRejectedValue(new Error("Init failed")),
    }));

    await expect(supervisor.startPlugin("p2", "code")).rejects.toThrow("Init failed");
    expect(supervisor.getPluginStatus("p2")).toBe(PluginStatus.ERROR);
  });
});
