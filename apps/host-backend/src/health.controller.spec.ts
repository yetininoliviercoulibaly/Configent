import { Test, TestingModule } from "@nestjs/testing";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("check", () => {
    it("should return health status", () => {
      const result = controller.check();

      expect(result.status).toBe("ok");
      expect(result.timestamp).toBeDefined();
      expect(result.version).toBe("0.1.0");
      expect(result.sdkVersion).toBeDefined();
    });

    it("should return a valid ISO timestamp", () => {
      const result = controller.check();
      const date = new Date(result.timestamp);

      expect(date.toISOString()).toBe(result.timestamp);
    });
  });
});
