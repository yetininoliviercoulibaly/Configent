import { Injectable, Logger } from "@nestjs/common";
import type { PermissionScope } from "@configent/sdk";
import type { IPermissionService } from "../../domain/ports/permission.service.port";

/**
 * In-memory implementation of Permission Service.
 * 
 * In a real implementation, this would persist to a database.
 * For MVP/US-204, it defaults to granting everything or tracking in memory.
 * 
 * Decision: Default to DENY, but allowing manual grant via method call.
 * Or for ease of development, maybe default ALLOW for known safe scopes?
 * For security first, strict DENY.
 */
@Injectable()
export class InMemoryPermissionService implements IPermissionService {
  private readonly logger = new Logger(InMemoryPermissionService.name);
  private grants = new Set<string>();

  private getGrantKey(pluginId: string, scope: string): string {
    return `${pluginId}:${scope}`;
  }

  async isGranted(pluginId: string, scope: PermissionScope): Promise<boolean> {
    // Check specific grant
    if (this.grants.has(this.getGrantKey(pluginId, scope))) {
      return true;
    }
    return false;
  }

  async grant(pluginId: string, scope: PermissionScope): Promise<void> {
    this.grants.add(this.getGrantKey(pluginId, scope));
    this.logger.log(`Granted permission '${scope}' to plugin '${pluginId}'`);
  }

  async revoke(pluginId: string, scope: PermissionScope): Promise<void> {
    this.grants.delete(this.getGrantKey(pluginId, scope));
    this.logger.log(`Revoked permission '${scope}' from plugin '${pluginId}'`);
  }
}
