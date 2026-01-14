import { ISandboxOptions } from "./sandbox.interface";
/**
 * Represents a persistent sandbox instance for a plugin.
 * Keeps the Isolate and Context alive to maintain state between executions.
 */
export declare class SandboxInstance {
    private isolate;
    private context;
    private memoryLimit;
    private options;
    constructor(options?: ISandboxOptions);
    /**
     * Initializes the isolate and context.
     */
    initialize(): Promise<void>;
    /**
     * Executes code within the persistent context.
     * @param code JavaScript code to execute
     */
    execute(code: string): Promise<any>;
    /**
     * Disposes the isolate and releases resources.
     */
    dispose(): void;
    /**
     * Checks if the sandbox is currently initialized and running.
     */
    get isRunning(): boolean;
}
//# sourceMappingURL=sandbox-instance.d.ts.map