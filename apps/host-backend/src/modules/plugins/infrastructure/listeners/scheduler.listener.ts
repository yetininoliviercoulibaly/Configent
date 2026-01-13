import { Inject, Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { I_PLUGIN_SUPERVISOR, IPluginSupervisor } from "../../domain/ports";
import { SchedulerTriggeredEvent } from "../../../scheduler/domain/events/scheduler-triggered.event";

@Injectable()
export class SchedulerListener {
  private readonly logger = new Logger(SchedulerListener.name);

  constructor(
    @Inject(I_PLUGIN_SUPERVISOR)
    private readonly pluginSupervisor: IPluginSupervisor,
  ) {}

  @OnEvent("scheduler.triggered")
  async handleSchedulerTriggered(event: SchedulerTriggeredEvent) {
    this.logger.log(`Handling scheduler trigger for plugin: ${event.pluginId}, handler: ${event.handlerId}`);
    try {
      await this.pluginSupervisor.triggerSchedulerEvent(event.pluginId, event.handlerId);
    } catch (error: any) {
      this.logger.error(`Failed to trigger scheduler event for ${event.pluginId}: ${error.message}`);
    }
  }
}
