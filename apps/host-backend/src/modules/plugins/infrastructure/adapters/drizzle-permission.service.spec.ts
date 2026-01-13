import { Test, TestingModule } from "@nestjs/testing";
import { DrizzlePermissionService } from "./drizzle-permission.service";
import { DATABASE_CONNECTION } from "../../../../shared/database/database.module";
import { PermissionScope } from "@configent/sdk";
import * as schema from "../../../../shared/database/schema";
import { eq, and } from "drizzle-orm";

const mockDb = {
  select: jest.fn(),
  insert: jest.fn(),
  delete: jest.fn(),
};

describe("DrizzlePermissionService", () => {
  let service: DrizzlePermissionService;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    // Mock chainable query builder
    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([]), // Default empty
        }),
      }),
    });
    mockDb.insert.mockReturnValue({
      values: jest.fn().mockResolvedValue(undefined),
    });
    mockDb.delete.mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrizzlePermissionService,
        { provide: DATABASE_CONNECTION, useValue: mockDb },
      ],
    }).compile();

    service = module.get<DrizzlePermissionService>(DrizzlePermissionService);
  });

  it("should return false if permission not found", async () => {
    const granted = await service.isGranted("p1", "vault:read" as PermissionScope);
    expect(granted).toBe(false);
  });

  it("should return true if permission found", async () => {
    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([{ id: 1 }]),
        }),
      }),
    });

    const granted = await service.isGranted("p1", "vault:read" as PermissionScope);
    expect(granted).toBe(true);
  });

  it("should grant permission (insert)", async () => {
    // Mock not exists
    jest.spyOn(service, "isGranted").mockResolvedValue(false);

    await service.grant("p1", "vault:read" as PermissionScope);

    expect(mockDb.insert).toHaveBeenCalledWith(schema.permissions);
  });

  it("should not grant if already exists", async () => {
    jest.spyOn(service, "isGranted").mockResolvedValue(true);

    await service.grant("p1", "vault:read" as PermissionScope);

    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  it("should revoke permission (delete)", async () => {
    await service.revoke("p1", "vault:read" as PermissionScope);

    expect(mockDb.delete).toHaveBeenCalledWith(schema.permissions);
  });
});
