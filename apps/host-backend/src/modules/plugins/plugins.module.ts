import { Module } from "@nestjs/common";
import { I_PLUGIN_SCANNER } from "./domain/ports";
import { FilesystemPluginScanner } from "./infrastructure/adapters/filesystem-plugin-scanner.adapter";
import { ScanPluginsUseCase } from "./application/use-cases/scan-plugins.use-case";

/**
 * Module for plugin discovery and management.
 *
 * User Stories:
 * - US-201: Plugin Manifest Parser (SDK)
 * - US-202: Plugin Loader (Disk Scan)
 * - US-203: Runtime Supervisor (future)
 * - US-204: Permission Grant System (future)
 */
@Module({
  providers: [
    ScanPluginsUseCase,
    {
      provide: I_PLUGIN_SCANNER,
      useClass: FilesystemPluginScanner,
    },
  ],
  exports: [ScanPluginsUseCase, I_PLUGIN_SCANNER],
})
export class PluginsModule {}
