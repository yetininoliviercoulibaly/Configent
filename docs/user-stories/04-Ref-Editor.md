# Epic 04: Reference Plugin: The Editor

**Goal:** Validate Complex UI, Privacy, and Multi-MCP flows.
**Priority:** Medium
**Phase:** 1 (MVP)

---

## US-401: Journaling UI Widget

**As a** User,
**I want** to write daily notes in a dedicated widget,
**So that** the agent has context about my work.

### Acceptance Criteria

- [ ] Plugin exposes a Large Tile (2x2) in `manifest.json`.
- [ ] Frontend uses a React Rich Text Editor (e.g., TipTap or simple textarea).
- [ ] Autosave: Typing sends `rpc.store.set('journal_YYYY-MM-DD', content)` to Shell.
- [ ] Persisted content reloads when reopening the app.

---

## US-402: GitHub MCP Client Integration

**As a** Editor Agent,
**I want** to fetch my recent commits from GitHub,
**So that** I can generate a factual Standup Report.

### Acceptance Criteria

- [ ] Agent calls `rpc.mcp.call('github', 'get_commits', { since: '24h' })`.
- [ ] Mock/Real GitHub MCP returns JSON list of commits.
- [ ] Agent formats a Markdown list of commits.

---

## US-403: Web Search MCP Integration

**As a** Editor Agent,
**I want** to search the web for ".NET 9 News",
**So that** I can suggest blog topics.

### Acceptance Criteria

- [ ] Agent calls `rpc.mcp.call('brave-search', 'search', { q: '.NET 9 features' })`.
- [ ] Mock/Real Search MCP returns search results.

---

## US-404: Content Synthesis Logic

**As a** Editor Agent,
**I want** to combine Journal + GitHub + Search data,
**So that** I can propose a "Daily Briefing".

### Acceptance Criteria

- [ ] **Workflow:** Triggered by Scheduler (e.g. 8:00 AM).
- [ ] Fetches Journal + GitHub + Search.
- [ ] (Simulator) Concatenates texts and simulates an LLM call (or calls real LLM if key provided).
- [ ] Generates a Markdown Report.
- [ ] report is saved to `store` and displayed in the UI Widget tab "Briefings".
