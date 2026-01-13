/**
 * Status of a plugin runtime.
 */
export enum PluginStatus {
  /** Plugin is stopped and not consuming resources */
  STOPPED = "STOPPED",
  /** Plugin is running in a sandbox */
  RUNNING = "RUNNING",
  /** Plugin failed to start or crashed */
  ERROR = "ERROR",
}

/**
 * Interface for controlling plugin lifecycle.
 */
export interface IPluginSupervisor {
  /**
   * Starts a plugin in a persistent sandbox.
   * @param pluginId - The unique ID of the plugin (from manifest)
   * @param code - The JavaScript entrypoint code to execute
   */
  startPlugin(pluginId: string, code: string): Promise<void>;

  /**
   * Stops a plugin and releases its resources.
   * @param pluginId - The unique ID of the plugin
   */
  stopPlugin(pluginId: string): Promise<void>;

  /**
   * Gets the current status of a plugin.
   * @param pluginId - The unique ID of the plugin
   */
  getPluginStatus(pluginId: string): PluginStatus;
}

/**
 * Token for IPluginSupervisor dependency injection.
 */
export const I_PLUGIN_SUPERVISOR = Symbol("IPluginSupervisor");
