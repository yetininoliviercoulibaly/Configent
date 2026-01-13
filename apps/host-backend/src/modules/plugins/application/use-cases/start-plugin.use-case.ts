import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import * as fs from "fs/promises";
import * as path from "path";
import {
  I_PLUGIN_SCANNER,
  IPluginScanner,
  I_PLUGIN_SUPERVISOR,
  IPluginSupervisor,
} from "../../domain/ports";
import { ConfigService } from "../../../../shared/config/config.service"; // Corrected depth

/**
 * Use case to start a plugin.
 *
 * Flow:
 * 1. Scan /plugins to find the plugin path
 * 2. Read the entrypoint file
 * 3. Start the plugin via Supervisor
 */
@Injectable()
export class StartPluginUseCase {
  private readonly logger = new Logger(StartPluginUseCase.name);

  constructor(
    @Inject(I_PLUGIN_SCANNER)
    private readonly pluginScanner: IPluginScanner,
    @Inject(I_PLUGIN_SUPERVISOR)
    private readonly pluginSupervisor: IPluginSupervisor,
    private readonly configService: ConfigService,
  ) {}

  async execute(pluginId: string): Promise<void> {
    this.logger.log(`Attempting to start plugin: ${pluginId}`);

    // TODO: optimize this by caching scan results or using a DB
    const pluginsDir = path.resolve(process.cwd(), "plugins"); // Default for now
    // Ideally get pluginsDir from ConfigService but for now hardcode/resolve
    
    // Scan to find the plugin
    const scanResult = await this.pluginScanner.scanDirectory(pluginsDir);
    const plugin = scanResult.plugins.find((p) => p.manifest.id === pluginId);

    if (!plugin) {
      throw new NotFoundException(`Plugin ${pluginId} not found in ${pluginsDir}`);
    }

    // Read entrypoint
    const entrypoint = plugin.manifest.entrypoint || "index.js";
    const entrypointPath = path.join(plugin.path, entrypoint);

    try {
      const code = await fs.readFile(entrypointPath, "utf-8");
      
      // Delegate to supervisor
      await this.pluginSupervisor.startPlugin(pluginId, code);
    } catch (error) {
      this.logger.error(`Failed to read entrypoint for ${pluginId}:`, error);
      throw error;
    }
  }
}
