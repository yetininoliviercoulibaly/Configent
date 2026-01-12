import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export * from "../../modules/vault/infrastructure/persistence/secret.schema";

// Singleton Configuration
export const config = sqliteTable("config", {
  id: integer("id").primaryKey().default(1),
  instanceId: text("instance_id").notNull().unique(),
  masterKeyHash: text("master_key_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
