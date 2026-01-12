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
