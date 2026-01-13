/**
 * RPC interface exposed to plugins by the Shell.
 * Plugins can call these methods through the injected `rpc` global.
 */
export interface IPluginRPC {
    /**
     * Vault operations for accessing secrets.
     * Requires: vault:read permission
     */
    vault: {
        /**
         * Retrieves a decrypted secret value by key.
         * @param key - The secret key to retrieve
         * @returns The decrypted secret value
         */
        getSecret(key: string): Promise<string>;
    };
    /**
     * Network operations for HTTP requests.
     * Requires: network:public permission
     */
    network: {
        /**
         * Performs an HTTP fetch through the Shell proxy.
         * @param url - The URL to fetch
         * @param options - Optional fetch options
         * @returns The fetch response
         */
        fetch(url: string, options?: RequestInit): Promise<Response>;
    };
    /**
     * Key-Value storage for plugin data.
     * Requires: storage:read and/or storage:write permissions
     */
    store: {
        /**
         * Retrieves a value from the plugin's store.
         * @param key - The key to retrieve
         * @returns The stored value or null if not found
         */
        get<T>(key: string): Promise<T | null>;
        /**
         * Stores a value in the plugin's store.
         * @param key - The key to store under
         * @param value - The value to store
         */
        set<T>(key: string, value: T): Promise<void>;
    };
    /**
     * Notification operations for UI feedback.
     * Requires: ui:notify permission
     */
    notify: {
        /**
         * Sends a toast notification to the Shell UI.
         * @param level - The notification level
         * @param message - The message to display
         */
        send(level: "info" | "warn" | "error", message: string): Promise<void>;
    };
    /**
     * Scheduler operations for recurring tasks.
     * Requires: schedule:register permission
     */
    scheduler: {
        /**
         * Registers a cron job that will trigger the plugin.
         * @param cron - Cron expression for scheduling (e.g., "* /10 * * * *")
         * @param handlerId - Identifier for the handler to invoke
         */
        register(cron: string, handlerId: string): Promise<void>;
    };
    /**
     * MCP (Model Context Protocol) operations.
     * Requires: mcp:call permission
     */
    mcp: {
        /**
         * Calls an MCP server method.
         * @param server - The MCP server identifier
         * @param method - The method to call
         * @param params - Optional parameters for the method
         * @returns The method result
         */
        call<T>(server: string, method: string, params?: Record<string, unknown>): Promise<T>;
    };
}
/**
 * Plugin lifecycle hooks.
 * Plugins can implement these to respond to lifecycle events.
 */
export interface IPluginLifecycle {
    /**
     * Called when the plugin is started.
     */
    onStartup?(): Promise<void>;
    /**
     * Called when the plugin is being stopped.
     */
    onShutdown?(): Promise<void>;
    /**
     * Called when a scheduled task triggers.
     * @param handlerId - The handler ID that was registered
     */
    onSchedulerEvent?(handlerId: string): Promise<void>;
}
/**
 * RPC request message structure.
 */
export interface IRPCRequest {
    type: "RPC_REQUEST";
    id: string;
    method: string;
    params: unknown[];
}
/**
 * RPC response message structure.
 */
export interface IRPCResponse {
    type: "RPC_RESPONSE";
    id: string;
    result?: unknown;
    error?: {
        code: string;
        message: string;
    };
}
//# sourceMappingURL=rpc.types.d.ts.map