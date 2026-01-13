# Epic 02: Plugin System Management

**Goal:** Enable installation, loading, and lifecycle management of plugins.
**Priority:** High
**Phase:** 1 (MVP)

---

## US-201: Plugin Manifest Parser

**As a** System,
**I want** to strictly validate `manifest.json` files,
**So that** invalid or malicious plugins are rejected before loading.

### Acceptance Criteria

- [x] Schema Validation (Zod) for `manifest.json`.
- [x] Field `id` must be reverse-domain style (e.g., `com.example.plugin`).
- [x] Field `permissions` must contain only known scopes.
- [x] Field `tiles` must follow the Bento UI schema.
- [x] Error is thrown with specific message if schema is invalid.

---

## US-202: Plugin Loader (Disk Scan)

**As a** System,
**I want** to scan the `/plugins` directory at startup,
**So that** I can discover installed agents.

### Acceptance Criteria

- [x] Service scans recursive directories or zip files in `/plugins`.
- [x] Ignores directories without `manifest.json`.
- [x] Returns a list of available plugins with their metadata.
- [x] Handles duplicates (Logs warning, skips second instance).

---

## US-203: Runtime Supervisor (Start/Stop)

**As a** System Operator,
**I want** to start and stop plugins programmatically,
**So that** I can manage resources and restart crashed agents.

### Acceptance Criteria

- [x] Method `startPlugin(id)` initializes the `isolated-vm` Context.
- [x] Method `stopPlugin(id)` disposes the Context and releases memory.
- [x] Status of plugin is tracked (`STOPPED`, `RUNNING`, `ERROR`).
- [x] Failing to start (syntax error in JS) transitions state to `ERROR`.

---

## US-204: Permission Grant System

**As a** User,
**I want** to see what permissions a plugin requests,
**So that** I can approve or deny access to my Vault/Network.

### Acceptance Criteria

- [ ] On `startPlugin()`, system checks requested permissions against granted permissions in DB.
- [ ] If permission `vault:read` is requested but not granted, the `vault` object is NOT injected into the sandbox.
- [ ] Attempting to call a non-injected RPC function throws "Permission Denied" inside the sandbox.
