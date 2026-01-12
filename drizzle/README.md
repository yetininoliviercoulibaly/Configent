# Drizzle Migrations

This directory contains database migrations managed by Drizzle Kit.

Migrations will be added when implementing US-102 (SQLite Database & Migration System).

## Usage

```bash
# Generate migrations
pnpm --filter host-backend db:generate

# Apply migrations
pnpm --filter host-backend db:migrate
```
