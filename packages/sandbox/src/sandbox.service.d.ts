import { ISandboxOptions, ISandboxExecutionResult } from './sandbox.interface';
export declare class SandboxService {
    private static readonly DEFAULT_MEMORY_LIMIT;
    private static readonly DEFAULT_TIMEOUT;
    /**
     * Executes a script in a secure isolated environment.
     * @param code The JavaScript code to execute.
     * @param options Execution options (memory, timeout).
      */
    run(code: string, options?: ISandboxOptions): Promise<ISandboxExecutionResult>;
}
//# sourceMappingURL=sandbox.service.d.ts.map