import { Injectable } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import {
  ISchedulerRepository,
} from "../../domain/ports/scheduler.repository.port";
import { ScheduledTask } from "../../domain/entities/scheduled-task.entity";
import { scheduledTask } from "../../../../shared/database/schema";
import { DATABASE_CONNECTION } from "../../../../shared/database/database.module";

@Injectable()
export class DrizzleSchedulerRepository implements ISchedulerRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async save(task: ScheduledTask): Promise<ScheduledTask> {
    const [inserted] = await this.db
      .insert(scheduledTask)
      .values({
        pluginId: task.pluginId,
        cronExpression: task.cronExpression,
        handlerId: task.handlerId,
        status: task.status,
        nextRunAt: task.nextRunAt,
        lastRunAt: task.lastRunAt,
      })
      .returning();

    return this.mapToEntity(inserted);
  }

  async findAllActive(): Promise<ScheduledTask[]> {
    const result = await this.db
      .select()
      .from(scheduledTask)
      .where(eq(scheduledTask.status, "ACTIVE"));

    return result.map(this.mapToEntity);
  }

  async findByPlugin(pluginId: string): Promise<ScheduledTask[]> {
    const result = await this.db
      .select()
      .from(scheduledTask)
      .where(eq(scheduledTask.pluginId, pluginId));

    return result.map(this.mapToEntity);
  }

  private mapToEntity(row: any): ScheduledTask {
      return new ScheduledTask(
        row.id,
        row.pluginId,
        row.cronExpression,
        row.handlerId,
        row.status as "ACTIVE" | "PAUSED",
        row.nextRunAt ? new Date(row.nextRunAt) : undefined,
        row.lastRunAt ? new Date(row.lastRunAt) : undefined
      );
  }
}
