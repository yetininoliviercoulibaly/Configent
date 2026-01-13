# Configent

<div align="center">

![Configent Logo](https://img.shields.io/badge/Configent-AI%20Agent%20Platform-blueviolet?style=for-the-badge)

**Local-First AI Agent Orchestration Platform**

_Your Keys, Your Data, Your Runtime_

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-22%20LTS-green.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9.x-orange.svg)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)

</div>

---

## 🎯 Vision

Configent is an **Open-Core** platform for orchestrating AI agents (Plugins) in a **Local-First** environment. It provides developers with a secure, isolated runtime where users maintain complete control over their API keys and data.

### Core Promise

- **For Developers**: An OS for agents. Authentication, secure storage, logging, and unified UI — all handled. No need to build a complete SaaS for a simple agent script.
- **For Users**: Data sovereignty. API keys and data never leave your infrastructure (localhost or personal VPS).

## 🚀 Quick Start

### Prerequisites

- **Node.js** 22 LTS or later
- **pnpm** 9.x (`npm install -g pnpm`)

### Installation

```bash
# Clone the repository
git clone https://github.com/yetininoliviercoulibaly/Configent.git
cd Configent

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Running the Application

```bash
# Terminal 1: Start the Backend (NestJS)
pnpm --filter host-backend dev

# Terminal 2: Start the Frontend (React + Vite)
pnpm --filter host-frontend dev
```

**Access the application:**

- 🌐 **Frontend Dashboard**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:3000
- 💓 **Health Check**: http://localhost:3000/health

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Run specific package tests
pnpm --filter host-backend test
pnpm --filter host-frontend test
pnpm --filter @configent/sandbox test
```

### Database Migrations

```bash
# Generate new migrations after schema changes
pnpm --filter host-backend db:generate

# Apply pending migrations
pnpm --filter host-backend db:migrate

# Open Drizzle Studio (database UI)
pnpm --filter host-backend db:studio
```

## 🧪 Testing the Plugins

### The Moderator Plugin

The Moderator plugin demonstrates the Scheduler API and MCP polling:

1. Start the backend: `pnpm --filter host-backend dev`
2. The plugin registers a cron job that fires every minute
3. On each trigger, it calls `rpc.mcp.call('wordpress', 'get_comments')`
4. Mock data returns 3 comments (1 toxic)
5. Toxic comments trigger `rpc.notify.send('warn', ...)`

**Expected logs:**

```
[Moderator] Received scheduler event: check-toxicity
[Moderator] Polling MCP for new comments...
[Moderator] Received 3 comments
[Moderator] TOXIC comment detected from Bot: "BUY CRYPTO NOW!!!"
RPC [notify.send] (warn): Toxic comment found from Bot!
```

### The Editor Plugin

The Editor plugin demonstrates multi-MCP synthesis:

1. Start the backend: `pnpm --filter host-backend dev`
2. The plugin registers a cron job at 8:00 AM daily
3. On trigger, it fetches:
   - Journal entry from `rpc.store.get('journal_YYYY-MM-DD')`
   - GitHub commits from `rpc.mcp.call('github', 'get_commits')`
   - Web search results from `rpc.mcp.call('brave-search', 'search')`
4. Synthesizes a Markdown "Daily Briefing"
5. Saves to store and notifies user

**Test manually by updating the cron to `* * * * *` (every minute) in the plugin code.**

## 🏗️ Architecture

Configent uses a **Micro-Kernel (Host/Plugin)** architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Host (Shell)                            │
├──────────────────────────┬──────────────────────────────────────┤
│   Frontend (React/Vite)  │      Backend (NestJS)                │
│   ├── Grid UI Dashboard  │      ├── Vault (AES-256-GCM)         │
│   ├── Plugin Tiles       │      ├── Sandbox (isolated-vm)       │
│   └── Permission Modals  │      ├── Scheduler (node-cron)       │
│                          │      ├── RPC Bridge                  │
│                          │      └── SQLite (Drizzle ORM)        │
└──────────────────────────┴──────────────────────────────────────┘
                                    │
                         ┌──────────┴──────────┐
                         │   Plugin Runtime    │
                         │   (V8 Isolates)     │
                         │   ┌─────┐ ┌─────┐   │
                         │   │Mod. │ │Edit.│   │
                         │   └─────┘ └─────┘   │
                         └─────────────────────┘
```

## 📁 Project Structure

```
configent/
├── apps/
│   ├── host-backend/        # NestJS - Core Shell Backend
│   │   ├── src/modules/     # Feature modules (Hexagonal Architecture)
│   │   │   ├── vault/       # Secret encryption service
│   │   │   ├── plugins/     # Plugin lifecycle management
│   │   │   └── scheduler/   # Cron job management
│   │   └── drizzle/         # Database migrations
│   │
│   └── host-frontend/       # React + Vite - Dashboard UI
│       └── src/
│           ├── components/  # UI Components (Dashboard, PluginHost)
│           └── features/    # Feature modules (PluginStore, PermissionModal)
│
├── packages/
│   ├── sdk/                 # Shared types (Manifest, Permissions, RPC)
│   └── sandbox/             # isolated-vm wrapper for secure execution
│
├── plugins/                 # Reference plugins
│   ├── moderator/           # Toxic comment detector
│   │   ├── manifest.json
│   │   ├── backend/index.js
│   │   └── frontend/index.html
│   │
│   └── editor/              # Journaling & Daily Briefing
│       ├── manifest.json
│       ├── backend/index.js
│       └── frontend/index.html
│
└── docs/                    # Documentation & User Stories
```

## 📦 Packages

| Package              | Description                                    |
| -------------------- | ---------------------------------------------- |
| `host-backend`       | NestJS backend with hexagonal architecture     |
| `host-frontend`      | React + Vite dashboard                         |
| `@configent/sdk`     | Shared TypeScript types for Host and Plugins   |
| `@configent/sandbox` | Secure V8 isolate wrapper for plugin execution |

## 🔐 Security Model

Configent follows **Zero Trust Plugins** principles:

- **Sandbox Isolation**: Plugins run in isolated V8 contexts (`isolated-vm`)
- **Permission System**: Android-style explicit permission grants
- **No Process Access**: `process.env` is empty inside sandboxes
- **Resource Limits**: Memory (128MB) and timeout (30s) constraints
- **RPC Only**: Plugins communicate via controlled RPC bridge

### Available RPC Namespaces

| Namespace            | Permission          | Description                |
| -------------------- | ------------------- | -------------------------- |
| `vault.getSecret`    | `vault:read`        | Retrieve encrypted secrets |
| `network.fetch`      | `network:public`    | Perform HTTP requests      |
| `scheduler.register` | `schedule:register` | Register cron jobs         |
| `notify.send`        | `ui:notify`         | Send UI notifications      |
| `mcp.call`           | `mcp:call`          | Call MCP server methods    |
| `store.get`          | `storage:read`      | Read from plugin storage   |
| `store.set`          | `storage:write`     | Write to plugin storage    |

## 🛠️ Tech Stack

| Layer     | Technology                                          |
| --------- | --------------------------------------------------- |
| Backend   | NestJS, TypeScript 5.7, better-sqlite3, Drizzle ORM |
| Frontend  | React 19, Vite 6, TailwindCSS                       |
| Isolation | isolated-vm                                         |
| Scheduler | node-cron, @nestjs/event-emitter                    |
| Monorepo  | pnpm workspaces, Turborepo                          |

## 📋 Roadmap

### Phase 1: Trust & Standard ✅ Complete

- [x] Monorepo scaffolding (US-101)
- [x] SQLite + Drizzle migrations (US-102)
- [x] Vault service (AES-256-GCM) (US-103)
- [x] Sandbox engine (US-104)
- [x] Secure RPC Bridge (US-105)
- [x] Plugin Manifest & Loader (US-201, US-202)
- [x] Runtime Supervisor (US-203)
- [x] Permission Grant System (US-204)
- [x] Scheduler API (US-301)
- [x] Moderator Plugin Reference (US-302, US-303)
- [x] Editor Plugin Reference (US-401 - US-404)
- [x] Host Frontend Dashboard (US-501 - US-504)

### Phase 2: Cloud & Convenience (Future)

- [ ] Hosted SaaS option
- [ ] API billing proxy

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Project Link**: [https://github.com/yetininoliviercoulibaly/Configent](https://github.com/yetininoliviercoulibaly/Configent)

---

<div align="center">
Made with ❤️ for the AI Agent community
</div>
