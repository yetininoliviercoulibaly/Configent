CREATE TABLE `config` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`instance_id` text NOT NULL,
	`master_key_hash` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `config_instance_id_unique` ON `config` (`instance_id`);--> statement-breakpoint
CREATE TABLE `secret` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`encrypted_value` text NOT NULL,
	`iv` text NOT NULL,
	`scope` text DEFAULT 'GLOBAL' NOT NULL,
	`plugin_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `secret_key_unique` ON `secret` (`key`);