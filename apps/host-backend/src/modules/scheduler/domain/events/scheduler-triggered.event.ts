export class SchedulerTriggeredEvent {
  constructor(
    public readonly pluginId: string,
    public readonly handlerId: string,
  ) {}
}
