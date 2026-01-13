import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import * as fs from "fs/promises";
import * as path from "path";
import {
  I_PLUGIN_SCANNER,
  IPluginScanner,
  I_PLUGIN_SUPERVISOR,
  IPluginSupervisor,
  I_PERMISSION_SERVICE,
  IPermissionService,
  I_PLUGIN_RPC_FACTORY,
  IPluginRpcFactory,
} from "../../domain/ports";
import { type PermissionScope } from "@configent/sdk";

/**
 * Use case to start a plugin.
 */
@Injectable()
export class StartPluginUseCase {
  private readonly logger = new Logger(StartPluginUseCase.name);

  constructor(
    @Inject(I_PLUGIN_SCANNER)
    private readonly pluginScanner: IPluginScanner,
    @Inject(I_PLUGIN_SUPERVISOR)
    private readonly pluginSupervisor: IPluginSupervisor,
    @Inject(I_PLUGIN_RPC_FACTORY)
    private readonly rpcFactory: IPluginRpcFactory,
    @Inject(I_PERMISSION_SERVICE)
    private readonly permissionService: IPermissionService,
  ) {}

  async execute(pluginId: string): Promise<void> {
    this.logger.log(`Attempting to start plugin: ${pluginId}`);

    // TODO: optimize this by caching scan results or using a DB
    const pluginsDir = path.resolve(process.cwd(), "plugins");
    
    // Scan to find the plugin
    const scanResult = await this.pluginScanner.scanDirectory(pluginsDir);
    const plugin = scanResult.plugins.find((p) => p.manifest.id === pluginId);

    if (!plugin) {
      throw new NotFoundException(`Plugin ${pluginId} not found in ${pluginsDir}`);
    }

    // Read entrypoint
    const entrypoint = plugin.manifest.entrypoint || "index.js";
    const entrypointPath = path.join(plugin.path, entrypoint);

    // Resolve Permissions
    const requestedPermissions = plugin.manifest.permissions || [];
    const allowedScopes: PermissionScope[] = [];

    for (const scope of requestedPermissions) {
      const isGranted = await this.permissionService.isGranted(pluginId, scope);
      if (isGranted) {
        allowedScopes.push(scope);
      } else {
        this.logger.warn(`Permission denied: Plugin ${pluginId} requested '${scope}' but it is not granted.`);
      }
    }

    // Create RPC handlers
    const rpc = this.rpcFactory.createRpc(pluginId, allowedScopes);

    try {
      const code = await fs.readFile(entrypointPath, "utf-8");
      
      // Delegate to supervisor with RPC options
      await this.pluginSupervisor.startPlugin(pluginId, code, { rpc });
    } catch (error) {
      this.logger.error(`Failed to read entrypoint for ${pluginId}:`, error);
      throw error;
    }
  }
}
