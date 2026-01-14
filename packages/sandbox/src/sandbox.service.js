"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SandboxService = void 0;
const ivm = __importStar(require("isolated-vm"));
class SandboxService {
    static DEFAULT_MEMORY_LIMIT = 128; // 128MB
    static DEFAULT_TIMEOUT = 1000; // 1s
    /**
     * Executes a script in a secure isolated environment.
     * @param code The JavaScript code to execute.
     * @param options Execution options (memory, timeout).
      */
    async run(code, options = {}) {
        const memoryLimit = options.memoryLimit ?? SandboxService.DEFAULT_MEMORY_LIMIT;
        const timeout = options.timeout ?? SandboxService.DEFAULT_TIMEOUT;
        // Create a new isolate with memory limits
        const isolate = new ivm.Isolate({ memoryLimit });
        const context = await isolate.createContext();
        const jail = context.global;
        // Secure the global object
        await jail.set('global', jail.derefInto());
        // Basic logs capturing
        const logs = [];
        await context.evalClosure(`
      global.console = {
        log: function(...args) {
          $0.apply(undefined, args, { arguments: { copy: true } });
        }
      }
    `, [(...args) => {
                logs.push(args.map(a => String(a)).join(' '));
            }]);
        // Inject RPC handlers if provided
        if (options.rpc) {
            const rpcMethodNames = Object.keys(options.rpc);
            // Create isolated references for each RPC method
            // Use JSON serialization to safely pass complex objects
            const rpcReferences = [];
            for (const methodName of rpcMethodNames) {
                const handler = options.rpc[methodName];
                if (!handler)
                    continue;
                rpcReferences.push(new ivm.Reference((...args) => {
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
        let result;
        try {
            const script = await isolate.compileScript(code);
            // Use copy: true to automatically copy the result from the isolate
            result = await script.run(context, { timeout, copy: true });
        }
        catch (error) {
            // Re-throw to caller (e.g. timeout error)
            throw error;
        }
        finally {
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
exports.SandboxService = SandboxService;
//# sourceMappingURL=sandbox.service.js.map