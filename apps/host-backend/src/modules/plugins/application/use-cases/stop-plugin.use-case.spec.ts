import { Test, TestingModule } from "@nestjs/testing";
import { StopPluginUseCase } from "./stop-plugin.use-case";
import { I_PLUGIN_SUPERVISOR } from "../../domain/ports";

describe("StopPluginUseCase", () => {
  let useCase: StopPluginUseCase;
  let supervisor: any;

  beforeEach(async () => {
    supervisor = {
      stopPlugin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StopPluginUseCase,
        { provide: I_PLUGIN_SUPERVISOR, useValue: supervisor },
      ],
    }).compile();

    useCase = module.get<StopPluginUseCase>(StopPluginUseCase);
  });

  it("should call supervisor.stopPlugin", async () => {
    await useCase.execute("p1");
    expect(supervisor.stopPlugin).toHaveBeenCalledWith("p1");
  });
});
