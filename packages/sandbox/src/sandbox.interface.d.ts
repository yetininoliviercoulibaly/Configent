/**
 * A map of RPC method names to their handler functions.
 * Each handler can be synchronous or asynchronous.
 */
export type IRpcHandler = Record<string, (...args: any[]) => any | Promise<any>>;
export interface ISandboxOptions {
    /**
     * Memory limit for the isolate in MB.
     * Default: 128
     */
    memoryLimit?: number;
    /**
     * Execution timeout in milliseconds.
     * Default: 1000 (1 second)
     */
    timeout?: number;
    /**
     * RPC handlers exposed to the sandbox via `global.rpc`.
     * Plugin code can call `rpc.methodName(args)` to invoke Host functions.
     */
    rpc?: IRpcHandler;
}
export interface ISandboxExecutionResult {
    /**
     * The return value of the script execution.
     * Primitive values are returned directly. Objects are copied.
     */
    result: any;
    /**
     * Logs captured from console.log inside the sandbox.
     */
    logs: string[];
    /**
     * Execution duration in milliseconds.
     */
    durationMs: number;
}
//# sourceMappingURL=sandbox.interface.d.ts.map