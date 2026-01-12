import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { DatabaseModule } from "./shared/database/database.module";

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
  imports: [DatabaseModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
