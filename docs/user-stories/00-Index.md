# Configent User Stories: Master Backlog (Phase 1)

This index lists all User Stories for the Configent Phase 1 MVP, grouped by Epic.

## [EPIC-01] Core Shell & Security

> **Goal:** Initialize the secure Host environment capable of running isolated plugins.
> [Details](file:///c:/Source/Tools/Configent/docs/user-stories/01-Core-Shell.md)

| ID         | Title                                  | Status |
| :--------- | :------------------------------------- | :----- |
| **US-101** | **Monorepo Scaffolding**               | `DONE` |
| **US-102** | **SQLite Database & Migration System** | `DONE` |
| **US-103** | **Vault Service (Encryption)**         | `DONE` |
| **US-104** | **Sandbox Engine (isolated-vm)**       | `DONE` |
| **US-105** | **Secure RPC Bridge (Host Side)**      | `DONE` |

## [EPIC-02] Plugin System Management

> **Goal:** Enable installation, loading, and lifecycle management of plugins.
> [Details](file:///c:/Source/Tools/Configent/docs/user-stories/02-Plugin-System.md)

| ID         | Title                               | Status |
| :--------- | :---------------------------------- | :----- |
| **US-201** | **Plugin Manifest Parser**          | `DONE` |
| **US-202** | **Plugin Loader (Disk Scan)**       | `DONE` |
| **US-203** | **Runtime Supervisor (Start/Stop)** | `TODO` |
| **US-204** | **Permission Grant System**         | `TODO` |

## [EPIC-03] Reference Plugin: The Moderator

> **Goal:** Validate "Pull" architecture and MCP integration.
> [Details](file:///c:/Source/Tools/Configent/docs/user-stories/03-Ref-Moderator.md)

| ID         | Title                            | Status |
| :--------- | :------------------------------- | :----- |
| **US-301** | **Scheduler API Implementation** | `TODO` |
| **US-302** | **Moderator Plugin Scaffold**    | `TODO` |
| **US-303** | **MCP Polling Logic**            | `TODO` |

## [EPIC-04] Reference Plugin: The Editor

> **Goal:** Validate Complex UI, Privacy, and Multi-MCP flows.
> [Details](file:///c:/Source/Tools/Configent/docs/user-stories/04-Ref-Editor.md)

| ID         | Title                             | Status |
| :--------- | :-------------------------------- | :----- |
| **US-401** | **Journaling UI Widget**          | `TODO` |
| **US-402** | **GitHub MCP Client Integration** | `TODO` |
| **US-403** | **Web Search MCP Integration**    | `TODO` |
| **US-404** | **Content Synthesis Logic**       | `TODO` |
