import { Inject, Injectable } from "@nestjs/common";
import {
  I_PLUGIN_SUPERVISOR,
  IPluginSupervisor,
  PluginStatus,
} from "../../domain/ports";

/**
 * Use case to get the status of a plugin.
 */
@Injectable()
export class GetPluginStatusUseCase {
  constructor(
    @Inject(I_PLUGIN_SUPERVISOR)
    private readonly pluginSupervisor: IPluginSupervisor
  ) {}

  execute(pluginId: string): PluginStatus {
    return this.pluginSupervisor.getPluginStatus(pluginId);
  }
}
