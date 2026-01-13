import * as ivm from "isolated-vm";
import { ISandboxOptions } from "./sandbox.interface";

/**
 * Represents a persistent sandbox instance for a plugin.
 * Keeps the Isolate and Context alive to maintain state between executions.
 */
export class SandboxInstance {
  private isolate: ivm.Isolate | null = null;
  private context: ivm.Context | null = null;
  private memoryLimit: number;

  constructor(options: ISandboxOptions = {}) {
    this.memoryLimit = options.memoryLimit ?? 128;
  }

  /**
   * Initializes the isolate and context.
   */
  async initialize(): Promise<void> {
    if (this.isolate) return;

    this.isolate = new ivm.Isolate({ memoryLimit: this.memoryLimit });
    this.context = await this.isolate.createContext();
    const jail = this.context.global;

    // Secure the global object
    await jail.set("global", jail.derefInto());

    // Basic console.log support
    await this.context.evalClosure(
      `
      global.console = {
        log: function(...args) {
          $0.apply(undefined, args, { arguments: { copy: true } });
        }
      }
    `,
      [
        (...args: any[]) => {
          console.log("[Sandbox]", ...args);
        },
      ]
    );
  }

  /**
   * Executes code within the persistent context.
   * @param code JavaScript code to execute
   */
  async execute(code: string): Promise<any> {
    if (!this.isolate || !this.context) {
      throw new Error("Sandbox not initialized");
    }

    try {
      const script = await this.isolate.compileScript(code);
      return await script.run(this.context, { copy: true });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Disposes the isolate and releases resources.
   */
  dispose(): void {
    if (this.isolate) {
      this.isolate.dispose();
      this.isolate = null;
      this.context = null;
    }
  }

  /**
   * Checks if the sandbox is currently initialized and running.
   */
  get isRunning(): boolean {
    return this.isolate !== null;
  }
}
