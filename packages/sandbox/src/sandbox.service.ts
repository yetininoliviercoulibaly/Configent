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

    const startTime = Date.now();
    let result: any;
    
    try {
      const script = await isolate.compileScript(code);
      const res = await script.run(context, { timeout });
      
      // If result is Reference, try to copy it if it's JSON serialization specific, 
      // or just return if it's primitive. 
      // For now we attempt to copy generic handle.
      if (res && typeof res === 'object' && res.copy) {
         try {
            result = await res.copy(); 
         } catch (copyError) {
            // Fallback for non-copyable results (like undefined/null sometimes behaving oddly or specific types)
            result = String(res);
         }
      } else {
         result = res;
      }

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
