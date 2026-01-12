import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseModule, DATABASE_CONNECTION } from "./database.module";
import { config } from "./schema";
import { count } from "drizzle-orm";

describe("DatabaseModule", () => {
  let module: TestingModule;
  let db: any;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    db = module.get(DATABASE_CONNECTION);
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });

  it("should provide a database connection", () => {
    expect(db).toBeDefined();
  });

  it("should be able to query the database", async () => {
    // Determine if we can run a simple query
    // This assumes the migration has run and the table exists
    const result = await db.select({ count: count() }).from(config);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBeTruthy();
    expect(result[0].count).toBeGreaterThanOrEqual(0);
  });
});
