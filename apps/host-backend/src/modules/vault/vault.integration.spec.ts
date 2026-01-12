import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { VaultModule } from "./vault.module";
import { DatabaseModule } from "../../shared/database/database.module";
import { ConfigModule } from "../../shared/config/config.module";
import { CreateSecretDto } from "./application/dtos/create-secret.dto";
import { SecretScope } from "./domain/vault.types";

describe("Vault Integration", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, DatabaseModule, VaultModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/POST secrets (Create) & /GET secrets/:key (Retrieve)", async () => {
    const key = `integration-test-key-${Date.now()}`;
    const value = "my-secret-value";

    // 1. Create Secret
    const createDto: CreateSecretDto = {
      key,
      value,
      scope: SecretScope.GLOBAL,
    };

    await request(app.getHttpServer())
      .post("/vault/secrets")
      .send(createDto)
      .expect(201);

    // 2. Retrieve Secret
    const response = await request(app.getHttpServer())
      .get(`/vault/secrets/${key}`)
      .expect(200);

    expect(response.body).toEqual({
      success: true,
      data: value,
    });
  });

  it("/GET secrets/:key should return 404 for non-existent key", async () => {
    await request(app.getHttpServer())
      .get("/vault/secrets/non-existent-key")
      .expect(404);
  });
});
