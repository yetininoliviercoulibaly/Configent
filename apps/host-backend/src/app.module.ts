import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { DatabaseModule } from "./shared/database/database.module";
import { ConfigModule } from "./shared/config/config.module";
import { VaultModule } from "./modules/vault/vault.module";
import { PluginsModule } from "./modules/plugins/plugins.module";
import { SchedulerModule } from "./modules/scheduler/scheduler.module";
import { EventEmitterModule } from "@nestjs/event-emitter";

/**
 * Root application module for Configent Host Backend.
 */
@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    VaultModule,
    PluginsModule,
    SchedulerModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
