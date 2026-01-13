import { Module } from "@nestjs/common";
import { InMemoryPluginSupervisor } from "./infrastructure/adapters/in-memory-plugin-supervisor.adapter";
import { StartPluginUseCase } from "./application/use-cases/start-plugin.use-case";
import { StopPluginUseCase } from "./application/use-cases/stop-plugin.use-case";
import { I_PLUGIN_SUPERVISOR, I_PLUGIN_SCANNER, I_PLUGIN_RPC_FACTORY, I_PERMISSION_SERVICE } from "./domain/ports";
import { ScanPluginsUseCase } from "./application/use-cases/scan-plugins.use-case";
import { FilesystemPluginScanner } from "./infrastructure/adapters/filesystem-plugin-scanner.adapter";

import { GetPluginStatusUseCase } from "./application/use-cases/get-plugin-status.use-case";
import { PluginRpcFactory } from "./infrastructure/services/plugin-rpc.factory";
import { DrizzlePermissionService } from "./infrastructure/adapters/drizzle-permission.service";
import { SchedulerModule } from "../scheduler/scheduler.module";
import { SchedulerListener } from "./infrastructure/listeners/scheduler.listener";

/**
 * Module for plugin discovery and management.
 */
@Module({
  imports: [SchedulerModule],
  providers: [
    ScanPluginsUseCase,
    StartPluginUseCase,
    StopPluginUseCase,
    GetPluginStatusUseCase,
    SchedulerListener,
    {
      provide: I_PLUGIN_SCANNER,
      useClass: FilesystemPluginScanner,
    },
    {
      provide: I_PLUGIN_SUPERVISOR,
      useClass: InMemoryPluginSupervisor,
    },
    {
      provide: I_PLUGIN_RPC_FACTORY,
      useClass: PluginRpcFactory,
    },
    {
      provide: I_PERMISSION_SERVICE,
      useClass: DrizzlePermissionService,
    },
  ],
  exports: [
    ScanPluginsUseCase,
    StartPluginUseCase,
    StopPluginUseCase,
    GetPluginStatusUseCase,
    I_PLUGIN_SCANNER,
    I_PLUGIN_SUPERVISOR,
    I_PERMISSION_SERVICE,
  ],
})
export class PluginsModule {}
