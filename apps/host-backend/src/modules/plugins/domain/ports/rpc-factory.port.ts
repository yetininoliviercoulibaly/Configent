import type { IRpcHandler } from "@configent/sandbox";
import type { PermissionScope } from "@configent/sdk";

/**
 * Factory for creating RPC handlers based on permissions.
 */
export interface IPluginRpcFactory {
  /**
   * Creates an RPC handler object containing only the methods allowed by the given scopes.
   * @param allowedScopes - List of permissions granted to the plugin
   */
  createRpc(allowedScopes: PermissionScope[]): IRpcHandler;
}

/**
 * Token for IPluginRpcFactory dependency injection.
 */
export const I_PLUGIN_RPC_FACTORY = Symbol("IPluginRpcFactory");
