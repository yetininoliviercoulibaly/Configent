import { Inject, Injectable, Logger } from "@nestjs/common";
import {
  I_PLUGIN_SUPERVISOR,
  IPluginSupervisor,
} from "../../domain/ports";

/**
 * Use case to stop a plugin.
 */
@Injectable()
export class StopPluginUseCase {
  private readonly logger = new Logger(StopPluginUseCase.name);

  constructor(
    @Inject(I_PLUGIN_SUPERVISOR)
    private readonly pluginSupervisor: IPluginSupervisor
  ) {}

  async execute(pluginId: string): Promise<void> {
    this.logger.log(`Attempting to stop plugin: ${pluginId}`);
    return this.pluginSupervisor.stopPlugin(pluginId);
  }
}
