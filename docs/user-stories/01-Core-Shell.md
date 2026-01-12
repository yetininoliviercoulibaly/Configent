# Epic 01: Core Shell & Security

**Goal:** Initialize the secure Host environment capable of running isolated plugins.
**Priority:** Critical
**Phase:** 1 (MVP)

---

## US-101: Monorepo Scaffolding

**As a** Developer,
**I want** a structured Monorepo (pnpm workspace),
**So that** I can manage the Host Backend, Host Frontend, and Shared SDKs efficiently in one place.

### Acceptance Criteria

- [x] Root `package.json` uses `pnpm` workspaces.
- [x] `apps/host-backend` is initialized (NestJS).
- [x] `apps/host-frontend` is initialized (Vite + React).
- [x] `packages/sdk` exists and is linked to apps.
- [x] `pnpm build` builds all packages successfully.

---

## US-102: SQLite Database & Migration System

**As a** Developer,
**I want** a local SQLite database with a migration system (Drizzle Kit),
**So that** I can persist application state locally without Docker dependencies.

### Acceptance Criteria

- [x] `better-sqlite3` is installed in Backend.
- [x] Drizzle ORM is configured.
- [x] Table `config` is defined (`instanceId`, `masterKeyHash`).
- [x] Migration script (`pnpm db:migrate`) creates the `config.db` file successfully.

---

## US-103: Vault Service (Encryption)

**As a** User,
**I want** my API keys stored with AES-256 encryption,
**So that** if someone steals my DB file, they cannot read my secrets.

### Acceptance Criteria

- [x] `VaultService` exists in NestJS.
- [x] Method `encrypt(text: string): string` returns `iv:ciphertext` (Base64).
- [x] Method `decrypt(ciphertext: string): string` restores original text.
- [x] Encryption Key is derived from a Master Password (or fixed Env var for MVP Step 1).
- [x] Unit Test verifies `decrypt(encrypt(x)) === x`.

---

## US-104: Sandbox Engine (isolated-vm)

**As a** Platform Engineer,
**I want** to execute arbitrary JS code in a secure `isolated-vm` Context,
**So that** plugins cannot crash the host or access system files.

### Acceptance Criteria

- [x] `packages/sandbox` module is created.
- [x] `SandboxService.createContext()` creates a new Isolate.
- [x] **Security Test:** The code `process.env` returns `undefined` inside the sandbox.
- [x] **Security Test:** The code `while(true){}` times out after 100ms (Resource Limit).
- [x] **Security Test:** Memory limit is enforced (e.g. 128MB).

---

## US-105: Secure RPC Bridge (Host Side)

**As a** Platform Engineer,
**I want** to expose specific functions (e.g., `vault.get`) to the Sandbox,
**So that** plugins can request permitted actions securely.

### Acceptance Criteria

- [ ] Mechanism to inject `global.rpc` into the Sandbox.
- [ ] `SandboxService` can receive a call from inside the JS code.
- [ ] Arguments are correctly marshalled (Strings/JSON passed safely).
- [ ] Integration Test: Host defines `add(a,b)` -> Sandbox calls `rpc.add(1,2)` -> Host returns `3`.
