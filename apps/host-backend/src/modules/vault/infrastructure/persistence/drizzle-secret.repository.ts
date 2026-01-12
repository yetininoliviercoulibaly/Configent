import { Injectable, Inject } from "@nestjs/common";
import { ISecretRepository } from "../../domain/ports/secret.repository.port";
import { SecretEntity } from "../../domain/entities/secret.entity";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { secrets } from "./secret.schema";
import { eq } from "drizzle-orm";
import { DATABASE_CONNECTION } from "../../../../shared/database/database.module";

@Injectable()
export class DrizzleSecretRepository implements ISecretRepository {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: BetterSQLite3Database
  ) {}

  async findByKey(key: string): Promise<SecretEntity | null> {
    const result = await this.db
      .select()
      .from(secrets)
      .where(eq(secrets.key, key))
      .get(); // better-sqlite3 get() returns first result or undefined

    if (!result) return null;

    return new SecretEntity(
      result.key,
      result.encryptedValue,
      result.iv,
      result.scope,
      result.pluginId,
      result.id,
      result.createdAt,
      result.updatedAt
    );
  }

  async save(secret: SecretEntity): Promise<void> {
    // Check if exists/upsert
    // For simplicity, we can use insert on conflict update if key is unique
    await this.db
      .insert(secrets)
      .values({
        key: secret.key,
        encryptedValue: secret.encryptedValue,
        iv: secret.iv,
        scope: secret.scope,
        pluginId: secret.pluginId,
      })
      .onConflictDoUpdate({
        target: secrets.key,
        set: {
          encryptedValue: secret.encryptedValue,
          iv: secret.iv,
          scope: secret.scope,
          pluginId: secret.pluginId,
          updatedAt: new Date(),
        },
      })
      .run();
  }

  async deleteByKey(key: string): Promise<void> {
    await this.db.delete(secrets).where(eq(secrets.key, key)).run();
  }
}
