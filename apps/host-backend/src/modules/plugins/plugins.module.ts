import { Module } from "@nestjs/common";
import { InMemoryPluginSupervisor } from "./infrastructure/adapters/in-memory-plugin-supervisor.adapter";
import { StartPluginUseCase } from "./application/use-cases/start-plugin.use-case";
import { StopPluginUseCase } from "./application/use-cases/stop-plugin.use-case";
import { I_PLUGIN_SUPERVISOR, I_PLUGIN_SCANNER } from "./domain/ports";
import { ScanPluginsUseCase } from "./application/use-cases/scan-plugins.use-case";
import { FilesystemPluginScanner } from "./infrastructure/adapters/filesystem-plugin-scanner.adapter";

import { GetPluginStatusUseCase } from "./application/use-cases/get-plugin-status.use-case";

/**
 * Module for plugin discovery and management.
 */
@Module({
  providers: [
    ScanPluginsUseCase,
    StartPluginUseCase,
    StopPluginUseCase,
    GetPluginStatusUseCase,
    {
      provide: I_PLUGIN_SCANNER,
      useClass: FilesystemPluginScanner,
    },
    {
      provide: I_PLUGIN_SUPERVISOR,
      useClass: InMemoryPluginSupervisor,
    },
  ],
  exports: [
    ScanPluginsUseCase, 
    StartPluginUseCase, 
    StopPluginUseCase, 
    GetPluginStatusUseCase,
    I_PLUGIN_SCANNER, 
    I_PLUGIN_SUPERVISOR
  ],
})
export class PluginsModule {}
