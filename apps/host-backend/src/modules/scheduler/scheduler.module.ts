import { Module } from "@nestjs/common";
import { DrizzleSchedulerRepository } from "./infrastructure/persistence/drizzle-scheduler.repository";
import { I_SCHEDULER_REPOSITORY } from "./domain/ports/scheduler.repository.port";
import { RegisterTaskUseCase } from "./application/use-cases/register-task.use-case";
import { NodeCronService } from "./infrastructure/adapters/node-cron.adapter";
import { I_SCHEDULER_SERVICE } from "./domain/ports/scheduler.service.port";
import { DatabaseModule } from "../../shared/database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [
    RegisterTaskUseCase,
    NodeCronService,
    {
      provide: I_SCHEDULER_REPOSITORY,
      useClass: DrizzleSchedulerRepository,
    },
    {
      provide: I_SCHEDULER_SERVICE,
      useClass: NodeCronService,
    },
  ],
  exports: [RegisterTaskUseCase, I_SCHEDULER_REPOSITORY, I_SCHEDULER_SERVICE], // Export UseCase to be used by RPC Bridge
})
export class SchedulerModule {}
