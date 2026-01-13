# Epic 03: Reference Plugin: The Moderator

**Goal:** Validate "Pull" architecture, Scheduler, and MCP integration.
**Priority:** Medium
**Phase:** 1 (MVP)
**Status:** ✅ Complete

---

## US-301: Scheduler API Implementation

**As a** Plugin Developer,
**I want** to register a cron expression,
**So that** my agent checks for new data periodically without running 24/7.

### Acceptance Criteria

- [x] Shell exposes `scheduler.register(cron, actionId)`.
- [x] Shell uses a job queue (BullMQ or Node-Cron) to manage schedules.
- [x] When cron triggers, Shell calls the Plugin's `onSchedulerEvent(actionId)`.

---

## US-302: Moderator Plugin Scaffold

**As a** Developer,
**I want** a reference implementation of a basic plugin structure,
**So that** I can copy-paste it for new agents.

### Acceptance Criteria

- [x] `plugins/moderator/manifest.json` is valid.
- [x] `plugins/moderator/backend/index.js` handles the startup.
- [x] `plugins/moderator/frontend/index.html` displays a basic "Status: Running" widget.

---

## US-303: MCP Polling Logic

**As a** Moderator Agent,
**I want** to query an MCP Server for "Pending Comments",
**So that** I can detect toxicity.

### Acceptance Criteria

- [x] **Mock MCP:** Create a fake MCP server (or valid mock response) returning comments.
- [x] Agent calls `rpc.mcp.call('wordpress', 'get_comments')`.
- [x] Agent iterates over comments and logs "Toxic" or "Safe" (Dummy logic for MVP).
- [x] Agent sends a notification to Shell if Toxic found: `rpc.notify.send('warn', 'Toxic comment found!')`.
