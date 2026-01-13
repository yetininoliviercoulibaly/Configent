export class ScheduledTask {
  constructor(
    public readonly id: number,
    public readonly pluginId: string,
    public readonly cronExpression: string,
    public readonly handlerId: string,
    public readonly status: "ACTIVE" | "PAUSED",
    public readonly nextRunAt?: Date,
    public readonly lastRunAt?: Date,
  ) {}

  static create(
    pluginId: string,
    cronExpression: string,
    handlerId: string,
  ): ScheduledTask {
    return new ScheduledTask(0, pluginId, cronExpression, handlerId, "ACTIVE");
  }
}
