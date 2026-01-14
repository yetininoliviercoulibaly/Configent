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
exports.SandboxInstance = void 0;
const ivm = __importStar(require("isolated-vm"));
/**
 * Represents a persistent sandbox instance for a plugin.
 * Keeps the Isolate and Context alive to maintain state between executions.
 */
class SandboxInstance {
    isolate = null;
    context = null;
    memoryLimit;
    options;
    constructor(options = {}) {
        this.options = options;
        this.memoryLimit = options.memoryLimit ?? 128;
    }
    /**
     * Initializes the isolate and context.
     */
    async initialize() {
        if (this.isolate)
            return;
        this.isolate = new ivm.Isolate({ memoryLimit: this.memoryLimit });
        this.context = await this.isolate.createContext();
        const jail = this.context.global;
        // Secure the global object
        await jail.set("global", jail.derefInto());
        // Basic console.log support
        await this.context.evalClosure(`
      global.console = {
        log: function(...args) {
          $0.apply(undefined, args, { arguments: { copy: true } });
        }
      }
    `, [
            (...args) => {
                console.log("[Sandbox]", ...args);
            },
        ]);
        // Inject RPC handlers if provided
        if (this.options.rpc) {
            const rpcMethodNames = Object.keys(this.options.rpc);
            // Create isolated references for each RPC method
            // Use JSON serialization to safely pass complex objects
            const rpcReferences = [];
            for (const methodName of rpcMethodNames) {
                const handler = this.options.rpc[methodName];
                if (!handler)
                    continue;
                rpcReferences.push(new ivm.Reference((...args) => {
                    const result = handler(...args);
                    // Serialize the result to JSON for safe transfer
                    return JSON.stringify(result);
                }));
            }
            // Build the global.rpc object in the isolate
            await this.context.evalClosure(`
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
      `, [rpcMethodNames, rpcReferences], { arguments: { copy: true } });
        }
    }
    /**
     * Executes code within the persistent context.
     * @param code JavaScript code to execute
     */
    async execute(code) {
        if (!this.isolate || !this.context) {
            throw new Error("Sandbox not initialized");
        }
        try {
            const script = await this.isolate.compileScript(code);
            return await script.run(this.context, { copy: true });
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Disposes the isolate and releases resources.
     */
    dispose() {
        if (this.isolate) {
            this.isolate.dispose();
            this.isolate = null;
            this.context = null;
        }
    }
    /**
     * Checks if the sandbox is currently initialized and running.
     */
    get isRunning() {
        return this.isolate !== null;
    }
}
exports.SandboxInstance = SandboxInstance;
//# sourceMappingURL=sandbox-instance.js.map