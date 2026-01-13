import type { IPluginManifest } from "@configent/sdk";

/**
 * Token for IPluginScanner dependency injection.
 */
export const I_PLUGIN_SCANNER = Symbol("IPluginScanner");

/**
 * Result of a plugin scan operation.
 */
export interface IPluginScanResult {
  /**
   * Successfully parsed plugin manifests.
   */
  plugins: IPluginManifest[];

  /**
   * Errors encountered during scanning (invalid manifests, missing files, etc.).
   */
  errors: IPluginScanError[];
}

/**
 * Error encountered while scanning a plugin.
 */
export interface IPluginScanError {
  /**
   * Directory path where the error occurred.
   */
  path: string;

  /**
   * Human-readable error message.
   */
  message: string;
}

/**
 * Port for scanning plugins from the filesystem.
 * Implementations should discover plugins in a directory and validate their manifests.
 */
export interface IPluginScanner {
  /**
   * Scans a directory for plugins and returns their validated manifests.
   *
   * @param pluginsDir - Absolute path to the plugins directory
   * @returns Scan result with valid plugins and any errors encountered
   */
  scanDirectory(pluginsDir: string): Promise<IPluginScanResult>;
}
