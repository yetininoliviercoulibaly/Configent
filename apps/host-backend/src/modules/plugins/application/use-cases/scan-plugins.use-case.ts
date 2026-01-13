import { Inject, Injectable, Logger } from "@nestjs/common";
import type { IPluginManifest } from "@configent/sdk";
import {
  I_PLUGIN_SCANNER,
  IPluginScanner,
  IPluginScanResult,
} from "../../domain/ports";

/**
 * Use case for scanning and discovering installed plugins.
 *
 * Responsibilities:
 * - Delegates filesystem scanning to IPluginScanner
 * - Handles duplicate plugin IDs (logs warning, keeps first)
 * - Returns deduplicated list of valid plugins
 */
@Injectable()
export class ScanPluginsUseCase {
  private readonly logger = new Logger(ScanPluginsUseCase.name);

  constructor(
    @Inject(I_PLUGIN_SCANNER)
    private readonly pluginScanner: IPluginScanner
  ) {}

  /**
   * Scans the plugins directory and returns discovered plugins.
   *
   * @param pluginsDir - Absolute path to the plugins directory
   * @returns Deduplicated list of valid plugin manifests
   */
  async execute(pluginsDir: string): Promise<IPluginScanResult> {
    this.logger.log(`Scanning plugins directory: ${pluginsDir}`);

    const scanResult = await this.pluginScanner.scanDirectory(pluginsDir);

    // Handle duplicates: keep first occurrence, log warning for others
    const seenIds = new Set<string>();
    const deduplicatedPlugins: IPluginManifest[] = [];

    for (const plugin of scanResult.plugins) {
      if (seenIds.has(plugin.id)) {
        this.logger.warn(
          `Duplicate plugin ID detected: "${plugin.id}". Keeping first instance, skipping duplicate.`
        );
        continue;
      }
      seenIds.add(plugin.id);
      deduplicatedPlugins.push(plugin);
    }

    // Log scan errors
    for (const error of scanResult.errors) {
      this.logger.warn(`Plugin scan error at ${error.path}: ${error.message}`);
    }

    this.logger.log(
      `Found ${deduplicatedPlugins.length} valid plugin(s), ${scanResult.errors.length} error(s)`
    );

    return {
      plugins: deduplicatedPlugins,
      errors: scanResult.errors,
    };
  }
}
