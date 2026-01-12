import { SecretScope } from "../../domain/vault.types";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const secrets = sqliteTable("secret", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  encryptedValue: text("encrypted_value").notNull(),
  iv: text("iv").notNull(),
  scope: text("scope").$type<SecretScope>().notNull().default(SecretScope.GLOBAL),
  pluginId: text("plugin_id"), // null if GLOBAL
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});
