import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseModule } from "../../shared/database/database.module";
import { SchedulerModule } from "./scheduler.module";
import { RegisterTaskUseCase } from "./application/use-cases/register-task.use-case";
import { I_SCHEDULER_REPOSITORY, ISchedulerRepository } from "./domain/ports/scheduler.repository.port";
import { ConfigModule } from "../../shared/config/config.module";
// Mock NodeCron to avoid actual scheduling during test
jest.mock("node-cron", () => ({
  schedule: jest.fn().mockImplementation((cron, fn) => {
    return { stop: jest.fn(), start: jest.fn() };
  }),
}));

import { EventEmitterModule } from "@nestjs/event-emitter";

describe("SchedulerModule Integration", () => {
  let module: TestingModule;
  let useCase: RegisterTaskUseCase;
  let repository: ISchedulerRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule, // Drizzle needs Config
        DatabaseModule,
        SchedulerModule,
        EventEmitterModule.forRoot(),
      ],
    }).compile();

    useCase = module.get<RegisterTaskUseCase>(RegisterTaskUseCase);
    repository = module.get(I_SCHEDULER_REPOSITORY);
  });

  afterAll(async () => {
    await module.close();
  });

  it("should persist a task in the database", async () => {
    const pluginId = "test.integration.plugin";
    const cron = "*/5 * * * *";
    const handlerId = "test_handler";

    await useCase.execute(pluginId, cron, handlerId);

    const tasks = await repository.findByPlugin(pluginId);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].cronExpression).toBe(cron);
    expect(tasks[0].handlerId).toBe(handlerId);
    expect(tasks[0].status).toBe("ACTIVE");
  });
});
