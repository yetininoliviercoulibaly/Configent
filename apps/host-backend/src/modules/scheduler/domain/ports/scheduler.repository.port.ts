import { ScheduledTask } from "../entities/scheduled-task.entity";

export const I_SCHEDULER_REPOSITORY = Symbol("ISchedulerRepository");

export interface ISchedulerRepository {
  save(task: ScheduledTask): Promise<ScheduledTask>;
  findAllActive(): Promise<ScheduledTask[]>;
  findByPlugin(pluginId: string): Promise<ScheduledTask[]>;
}
