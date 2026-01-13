import { Injectable, Logger } from "@nestjs/common";
import * as fs from "fs/promises";
import * as path from "path";
import { safeParseManifest } from "@configent/sdk";
import type {
  IPluginScanner,
  IPluginScanResult,
  IPluginScanError,
} from "../../domain/ports";
import type { IPluginManifest } from "@configent/sdk";

/**
 * Filesystem-based implementation of IPluginScanner.
 *
 * Scans a directory for plugin subdirectories, parses their manifest.json files,
 * and returns validated plugin manifests.
 */
@Injectable()
export class FilesystemPluginScanner implements IPluginScanner {
  private readonly logger = new Logger(FilesystemPluginScanner.name);

  /**
   * Scans the plugins directory for valid plugins.
   *
   * Algorithm:
   * 1. List all entries in the plugins directory
   * 2. Filter to directories only
   * 3. For each directory, check for manifest.json
   * 4. Parse and validate manifest using SDK schema
   * 5. Collect valid manifests and errors
   *
   * @param pluginsDir - Absolute path to the plugins directory
   * @returns Scan result with plugins and errors
   */
  async scanDirectory(pluginsDir: string): Promise<IPluginScanResult> {
    const plugins: IPluginManifest[] = [];
    const errors: IPluginScanError[] = [];

    // Check if plugins directory exists
    try {
      await fs.access(pluginsDir);
    } catch {
      this.logger.warn(`Plugins directory does not exist: ${pluginsDir}`);
      return { plugins, errors };
    }

    // List directory entries
    let entries: Awaited<ReturnType<typeof fs.readdir>>;
    try {
      entries = await fs.readdir(pluginsDir, { withFileTypes: true });
    } catch (error) {
      errors.push({
        path: pluginsDir,
        message: `Failed to read plugins directory: ${(error as Error).message}`,
      });
      return { plugins, errors };
    }

    // Process each subdirectory
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const pluginDir = path.join(pluginsDir, entry.name);
      const manifestPath = path.join(pluginDir, "manifest.json");

      // Check if manifest.json exists
      try {
        await fs.access(manifestPath);
      } catch {
        // No manifest.json, skip silently (not an error, just not a plugin)
        continue;
      }

      // Read and parse manifest
      try {
        const manifestContent = await fs.readFile(manifestPath, "utf-8");
        const rawManifest = JSON.parse(manifestContent);
        const parseResult = safeParseManifest(rawManifest);

        if (parseResult.success) {
          plugins.push(parseResult.data);
          this.logger.debug(
            `Discovered plugin: ${parseResult.data.id} (${parseResult.data.name})`
          );
        } else {
          // Zod validation failed
          const errorMessages = parseResult.error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join("; ");
          errors.push({
            path: manifestPath,
            message: `Invalid manifest: ${errorMessages}`,
          });
        }
      } catch (error) {
        errors.push({
          path: manifestPath,
          message: `Failed to parse manifest: ${(error as Error).message}`,
        });
      }
    }

    return { plugins, errors };
  }
}
