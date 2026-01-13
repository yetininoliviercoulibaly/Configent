import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import * as cron from "node-cron";
import { ISchedulerRepository, I_SCHEDULER_REPOSITORY } from "../../domain/ports/scheduler.repository.port";
import { ISchedulerService } from "../../domain/ports/scheduler.service.port";
import { Inject } from "@nestjs/common";
import { ScheduledTask } from "../../domain/entities/scheduled-task.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { SchedulerTriggeredEvent } from "../../domain/events/scheduler-triggered.event";

@Injectable()
export class NodeCronService implements ISchedulerService, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NodeCronService.name);
  private readonly tasks = new Map<number, cron.ScheduledTask>();

  constructor(
    @Inject(I_SCHEDULER_REPOSITORY)
    private readonly repository: ISchedulerRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async onModuleInit() {
    await this.loadAndScheduleTasks();
  }

  onModuleDestroy() {
    this.tasks.forEach((task) => task.stop());
    this.tasks.clear();
  }

  async loadAndScheduleTasks() {
    const activeTasks = await this.repository.findAllActive();
    for (const task of activeTasks) {
      this.scheduleTask(task);
    }
  }

  scheduleTask(task: ScheduledTask) {
    if (this.tasks.has(task.id)) {
      this.tasks.get(task.id)?.stop();
    }

    try {
      const job = cron.schedule(task.cronExpression, async () => {
        this.logger.log(`[Scheduler] Triggering task ${task.id} for plugin ${task.pluginId} (handler: ${task.handlerId})`);
        this.eventEmitter.emit(
          "scheduler.triggered",
          new SchedulerTriggeredEvent(task.pluginId, task.handlerId)
        );
      });

      this.tasks.set(task.id, job);
    } catch (error: any) {
       this.logger.error(`Failed to schedule task ${task.id}: ${error.message}`);
    }
  }
}
