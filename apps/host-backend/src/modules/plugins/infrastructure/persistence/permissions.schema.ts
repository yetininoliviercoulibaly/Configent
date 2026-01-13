import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const permissions = sqliteTable("plugin_permission", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pluginId: text("plugin_id").notNull(),
  scope: text("scope").notNull(), // We store PermissionScope as string
  grantedAt: integer("granted_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
