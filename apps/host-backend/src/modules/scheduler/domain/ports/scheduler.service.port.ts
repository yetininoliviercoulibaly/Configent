import { ScheduledTask } from "../entities/scheduled-task.entity";

export const I_SCHEDULER_SERVICE = Symbol("ISchedulerService");

export interface ISchedulerService {
  scheduleTask(task: ScheduledTask): void;
}
