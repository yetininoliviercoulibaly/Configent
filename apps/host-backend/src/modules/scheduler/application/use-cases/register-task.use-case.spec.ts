import { Test, TestingModule } from "@nestjs/testing";
import { RegisterTaskUseCase } from "./register-task.use-case";
import { I_SCHEDULER_REPOSITORY } from "../../domain/ports/scheduler.repository.port";
import { I_SCHEDULER_SERVICE } from "../../domain/ports/scheduler.service.port";
import { ScheduledTask } from "../../domain/entities/scheduled-task.entity";

describe("RegisterTaskUseCase", () => {
  let useCase: RegisterTaskUseCase;
  let repository: any;
  let schedulerService: any;

  beforeEach(async () => {
    repository = {
      save: jest.fn().mockImplementation((task) => Promise.resolve({ ...task, id: 1 })),
    };
    schedulerService = {
      scheduleTask: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterTaskUseCase,
        {
          provide: I_SCHEDULER_REPOSITORY,
          useValue: repository,
        },
        {
          provide: I_SCHEDULER_SERVICE,
          useValue: schedulerService,
        },
      ],
    }).compile();

    useCase = module.get<RegisterTaskUseCase>(RegisterTaskUseCase);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should register a valid task", async () => {
    const pluginId = "com.example.plugin";
    const cron = "* * * * *";
    const handlerId = "handler";

    await useCase.execute(pluginId, cron, handlerId);

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        pluginId,
        cronExpression: cron,
        handlerId,
        status: "ACTIVE",
      })
    );
  });

  it("should throw error for empty cron", async () => {
    await expect(useCase.execute("p1", "", "h1")).rejects.toThrow(
      "Invalid cron expression"
    );
  });
});
