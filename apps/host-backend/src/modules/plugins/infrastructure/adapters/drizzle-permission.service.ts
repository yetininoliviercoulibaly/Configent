import { Inject, Injectable, Logger } from "@nestjs/common";
import { IPermissionService } from "../../domain/ports";
import { DATABASE_CONNECTION } from "../../../../shared/database/database.module";
import * as schema from "../../../../shared/database/schema";
import { type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { and, eq } from "drizzle-orm";
import { type PermissionScope } from "@configent/sdk";

@Injectable()
export class DrizzlePermissionService implements IPermissionService {
  private readonly logger = new Logger(DrizzlePermissionService.name);

  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: BetterSQLite3Database<typeof schema>,
  ) {}

  async isGranted(pluginId: string, scope: PermissionScope): Promise<boolean> {
    const result = await this.db
      .select()
      .from(schema.permissions)
      .where(
        and(
          eq(schema.permissions.pluginId, pluginId),
          eq(schema.permissions.scope, scope)
        )
      )
      .limit(1);

    return result.length > 0;
  }

  async grant(pluginId: string, scope: PermissionScope): Promise<void> {
    this.logger.log(`Granting permission '${scope}' to plugin '${pluginId}'`);
    
    // Check if already exists to avoid errors (or use onConflictDoNothing if supported/configured)
    const exists = await this.isGranted(pluginId, scope);
    if (exists) return;

    await this.db.insert(schema.permissions).values({
      pluginId,
      scope,
    });
  }

  async revoke(pluginId: string, scope: PermissionScope): Promise<void> {
    this.logger.log(`Revoking permission '${scope}' from plugin '${pluginId}'`);
    
    await this.db
      .delete(schema.permissions)
      .where(
        and(
          eq(schema.permissions.pluginId, pluginId),
          eq(schema.permissions.scope, scope)
        )
      );
  }
}
