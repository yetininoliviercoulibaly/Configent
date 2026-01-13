import { PermissionScope } from "@configent/sdk";

/**
 * Service to managing permission grants.
 */
export interface IPermissionService {
  /**
   * Checks if a plugin is granted a specific permission.
   */
  isGranted(pluginId: string, scope: PermissionScope): Promise<boolean>;

  /**
   * Grants a permission to a plugin.
   */
  grant(pluginId: string, scope: PermissionScope): Promise<void>;

  /**
   * Revokes a permission from a plugin.
   */
  revoke(pluginId: string, scope: PermissionScope): Promise<void>;
}

/**
 * Token for IPermissionService dependency injection.
 */
export const I_PERMISSION_SERVICE = Symbol("IPermissionService");
