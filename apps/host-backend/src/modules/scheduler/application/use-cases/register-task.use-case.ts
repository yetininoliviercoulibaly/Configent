import { Inject, Injectable } from "@nestjs/common";
import { ScheduledTask } from "../../domain/entities/scheduled-task.entity";
import {
  ISchedulerRepository,
  I_SCHEDULER_REPOSITORY,
} from "../../domain/ports/scheduler.repository.port";
import {
  ISchedulerService,
  I_SCHEDULER_SERVICE,
} from "../../domain/ports/scheduler.service.port";

@Injectable()
export class RegisterTaskUseCase {
  constructor(
    @Inject(I_SCHEDULER_REPOSITORY)
    private readonly repository: ISchedulerRepository,
    @Inject(I_SCHEDULER_SERVICE)
    private readonly schedulerService: ISchedulerService,
  ) {}

  async execute(
    pluginId: string,
    cronExpression: string,
    handlerId: string,
  ): Promise<void> {
    // Validate cron expression (basic check)
    if (!cronExpression) {
      throw new Error("Invalid cron expression");
    }

    const task = ScheduledTask.create(pluginId, cronExpression, handlerId);
    const savedTask = await this.repository.save(task);

    // Schedule the task in the runtime
    this.schedulerService.scheduleTask(savedTask);
  }
}
