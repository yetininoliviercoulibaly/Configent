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
  private options: ISandboxOptions;

  constructor(options: ISandboxOptions = {}) {
    this.options = options;
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

    // Inject RPC handlers if provided
    if (this.options.rpc) {
      const rpcMethodNames = Object.keys(this.options.rpc);

      // Create isolated references for each RPC method
      // Use JSON serialization to safely pass complex objects
      const rpcReferences: ivm.Reference<(...args: any[]) => string>[] = [];
      for (const methodName of rpcMethodNames) {
        const handler = this.options.rpc[methodName];
        if (!handler) continue;
        rpcReferences.push(
          new ivm.Reference((...args: any[]) => {
            const result = handler(...args);
            // Serialize the result to JSON for safe transfer
            return JSON.stringify(result);
          })
        );
      }

      // Build the global.rpc object in the isolate
      await this.context.evalClosure(
        `
        global.rpc = {};
        const methodNames = $0;
        const refs = $1;

        // Helper to set nested property
        function setNested(obj, path, value) {
          const keys = path.split('.');
          let current = obj;
          for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key]) current[key] = {};
            current = current[key];
          }
          current[keys[keys.length - 1]] = value;
        }

        for (let i = 0; i < methodNames.length; i++) {
          const name = methodNames[i];
          const ref = refs[i];
          const handler = function(...args) {
            const jsonResult = ref.applySync(undefined, args, { arguments: { copy: true }, result: { copy: true } });
            return JSON.parse(jsonResult);
          };
          
          // Support both flat "rpc['ns.method']" and nested "rpc.ns.method"
          global.rpc[name] = handler;
          if (name.includes('.')) {
            setNested(global.rpc, name, handler);
          }
        }
      `,
        [rpcMethodNames, rpcReferences],
        { arguments: { copy: true } }
      );
    }
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
