import { SandboxInstance } from "./sandbox-instance";

describe("SandboxInstance", () => {
  let sandbox: SandboxInstance;

  beforeEach(() => {
    sandbox = new SandboxInstance();
  });

  afterEach(() => {
    sandbox.dispose();
  });

  it("should initialize and dispose correctly", async () => {
    expect(sandbox.isRunning).toBe(false);
    await sandbox.initialize();
    expect(sandbox.isRunning).toBe(true);
    sandbox.dispose();
    expect(sandbox.isRunning).toBe(false);
  });

  it("should maintain state between executions", async () => {
    await sandbox.initialize();
    
    // Set a variable
    await sandbox.execute("global.testVar = 42;");
    
    // Read it back
    const result = await sandbox.execute("global.testVar");
    expect(result).toBe(42);
  });

  it("should throw error if executing before initialization", async () => {
    await expect(sandbox.execute("1 + 1")).rejects.toThrow("Sandbox not initialized");
  });

  it("should support RPC calls", async () => {
    const rpcHandler = jest.fn().mockReturnValue("rpc-success");
    sandbox = new SandboxInstance({
      rpc: {
        testMethod: rpcHandler,
      },
    });

    await sandbox.initialize();

    const result = await sandbox.execute("global.rpc.testMethod('hello')");
    
    expect(result).toBe("rpc-success");
    expect(rpcHandler).toHaveBeenCalledWith("hello");
  });
});
