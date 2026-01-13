import { Test, TestingModule } from "@nestjs/testing";
import { GetPluginStatusUseCase } from "./get-plugin-status.use-case";
import { I_PLUGIN_SUPERVISOR, PluginStatus } from "../../domain/ports";

describe("GetPluginStatusUseCase", () => {
  let useCase: GetPluginStatusUseCase;
  let supervisor: any;

  beforeEach(async () => {
    supervisor = {
      getPluginStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetPluginStatusUseCase,
        { provide: I_PLUGIN_SUPERVISOR, useValue: supervisor },
      ],
    }).compile();

    useCase = module.get<GetPluginStatusUseCase>(GetPluginStatusUseCase);
  });

  it("should call supervisor.getPluginStatus", () => {
    supervisor.getPluginStatus.mockReturnValue(PluginStatus.RUNNING);
    
    const status = useCase.execute("p1");
    expect(status).toBe(PluginStatus.RUNNING);
    expect(supervisor.getPluginStatus).toHaveBeenCalledWith("p1");
  });
});
