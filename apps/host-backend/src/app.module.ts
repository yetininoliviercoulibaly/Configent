import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { DatabaseModule } from "./shared/database/database.module";
import { ConfigModule } from "./shared/config/config.module";
import { VaultModule } from "./modules/vault/vault.module";
import { PluginsModule } from "./modules/plugins/plugins.module";

/**
 * Root application module for Configent Host Backend.
 *
 * Architecture: Hexagonal (Ports & Adapters)
 * - Domain logic is pure (POJOs, no framework annotations)
 * - Persistence via Drizzle ORM in infrastructure layer
 * - Dependency injection via Tokens (Symbols)
 *
 * Modules will be added as user stories are implemented:
 * - US-102: DatabaseModule (Drizzle + SQLite)
 * - US-103: VaultModule (AES-256-GCM encryption)
 * - US-104: SandboxModule (isolated-vm)
 * - US-105: RpcBridgeModule
 */
@Module({
  imports: [ConfigModule, DatabaseModule, VaultModule, PluginsModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
