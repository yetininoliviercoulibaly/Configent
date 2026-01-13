import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Scheduled Task
export const scheduledTask = sqliteTable("scheduled_task", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pluginId: text("plugin_id").notNull(),
  cronExpression: text("cron_expression").notNull(),
  handlerId: text("handler_id").notNull(),
  nextRunAt: integer("next_run_at", { mode: "timestamp" }),
  lastRunAt: integer("last_run_at", { mode: "timestamp" }),
  status: text("status", { enum: ["ACTIVE", "PAUSED"] })
    .notNull()
    .default("ACTIVE"),
});

export * from "../../modules/vault/infrastructure/persistence/secret.schema";
export * from "../../modules/plugins/infrastructure/persistence/permissions.schema";

// Singleton Configuration
export const config = sqliteTable("config", {
  id: integer("id").primaryKey().default(1),
  instanceId: text("instance_id").notNull().unique(),
  masterKeyHash: text("master_key_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
