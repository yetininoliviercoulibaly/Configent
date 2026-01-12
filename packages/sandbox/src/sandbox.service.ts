import * as ivm from 'isolated-vm';
import { ISandboxOptions, ISandboxExecutionResult } from './sandbox.interface';

export class SandboxService {
  private static readonly DEFAULT_MEMORY_LIMIT = 128; // 128MB
  private static readonly DEFAULT_TIMEOUT = 1000; // 1s

  /**
   * Executes a script in a secure isolated environment.
   * @param code The JavaScript code to execute.
   * @param options Execution options (memory, timeout).
    */
  async run(
    code: string,
    options: ISandboxOptions = {}
  ): Promise<ISandboxExecutionResult> {
    const memoryLimit = options.memoryLimit ?? SandboxService.DEFAULT_MEMORY_LIMIT;
    const timeout = options.timeout ?? SandboxService.DEFAULT_TIMEOUT;

    // Create a new isolate with memory limits
    const isolate = new ivm.Isolate({ memoryLimit });
    const context = await isolate.createContext();
    const jail = context.global;

    // Secure the global object
    await jail.set('global', jail.derefInto());

    // Basic logs capturing
    const logs: string[] = [];
    await context.evalClosure(`
      global.console = {
        log: function(...args) {
          $0.apply(undefined, args, { arguments: { copy: true } });
        }
      }
    `, [(...args: any[]) => {
      logs.push(args.map(a => String(a)).join(' '));
    }]);

    // Inject RPC handlers if provided
    if (options.rpc) {
      const rpcMethodNames = Object.keys(options.rpc);
      
      // Create isolated references for each RPC method
      // Use JSON serialization to safely pass complex objects
      const rpcReferences: ivm.Reference<(...args: any[]) => string>[] = [];
      for (const methodName of rpcMethodNames) {
        const handler = options.rpc[methodName];
        rpcReferences.push(new ivm.Reference((...args: any[]) => {
          const result = handler(...args);
          // Serialize the result to JSON for safe transfer
          return JSON.stringify(result);
        }));
      }

      // Build the global.rpc object in the isolate
      await context.evalClosure(`
        global.rpc = {};
        const methodNames = $0;
        const refs = $1;
        for (let i = 0; i < methodNames.length; i++) {
          const name = methodNames[i];
          const ref = refs[i];
          global.rpc[name] = function(...args) {
            const jsonResult = ref.applySync(undefined, args, { arguments: { copy: true }, result: { copy: true } });
            return JSON.parse(jsonResult);
          };
        }
      `, [rpcMethodNames, rpcReferences], { arguments: { copy: true } });
    }

    const startTime = Date.now();
    let result: any;
    
    try {
      const script = await isolate.compileScript(code);
      // Use copy: true to automatically copy the result from the isolate
      result = await script.run(context, { timeout, copy: true });

    } catch (error) {
       // Re-throw to caller (e.g. timeout error)
       throw error;
    } finally {
       // Always dispose the isolate to free memory
       isolate.dispose();
    }
    
    const durationMs = Date.now() - startTime;

    return {
      result,
      logs,
      durationMs
    };
  }
}
