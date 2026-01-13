import { Injectable, Logger } from "@nestjs/common";
import { SandboxInstance } from "@configent/sandbox";
import type { IPluginSupervisor } from "../../domain/ports/supervisor.port";
import { PluginStatus } from "../../domain/ports/supervisor.port";

/**
 * In-memory implementation of Plugin Supervisor.
 * Manages the lifecycle of plugin sandboxes.
 */
@Injectable()
export class InMemoryPluginSupervisor implements IPluginSupervisor {
  private readonly logger = new Logger(InMemoryPluginSupervisor.name);
  
  // Map of pluginId -> SandboxInstance
  private readonly instances = new Map<string, SandboxInstance>();
  
  // Map of pluginId -> Status
  private readonly statuses = new Map<string, PluginStatus>();

  async startPlugin(pluginId: string, code: string): Promise<void> {
    this.logger.log(`Starting plugin: ${pluginId}`);

    if (this.instances.has(pluginId)) {
      this.logger.warn(`Plugin ${pluginId} is already running.`);
      return;
    }

    try {
      const sandbox = new SandboxInstance({
        memoryLimit: 128, // TODO: Make configurable per plugin
      });

      await sandbox.initialize();
      // Execute the plugin code!
      await sandbox.execute(code);
      
      this.instances.set(pluginId, sandbox);
      this.statuses.set(pluginId, PluginStatus.RUNNING);
      
      this.logger.log(`Plugin ${pluginId} started successfully.`);
    } catch (error) {
      this.logger.error(`Failed to start plugin ${pluginId}:`, error);
      this.statuses.set(pluginId, PluginStatus.ERROR);
      throw error;
    }
  }

  async stopPlugin(pluginId: string): Promise<void> {
    this.logger.log(`Stopping plugin: ${pluginId}`);
    
    const instance = this.instances.get(pluginId);
    if (instance) {
      instance.dispose();
      this.instances.delete(pluginId);
    }
    
    this.statuses.set(pluginId, PluginStatus.STOPPED);
    this.logger.log(`Plugin ${pluginId} stopped.`);
  }

  getPluginStatus(pluginId: string): PluginStatus {
    return this.statuses.get(pluginId) || PluginStatus.STOPPED;
  }
}
