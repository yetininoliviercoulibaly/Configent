CREATE TABLE `scheduled_task` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`plugin_id` text NOT NULL,
	`cron_expression` text NOT NULL,
	`handler_id` text NOT NULL,
	`next_run_at` integer,
	`last_run_at` integer,
	`status` text DEFAULT 'ACTIVE' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `plugin_permission` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`plugin_id` text NOT NULL,
	`scope` text NOT NULL,
	`granted_at` integer NOT NULL
);
