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
                         │   ┌─────────────┐   │
                         │   │ Moderator   │   │
                         │   └─────────────┘   │
                         └─────────────────────┘
```

## 📁 Project Structure

```
configent/
├── apps/
│   ├── host-backend/        # NestJS - Core Shell Backend
│   │   └── src/
│   │       ├── modules/     # Feature modules (Hexagonal Architecture)
│   │       │   ├── vault/       # Secret encryption service
│   │       │   ├── plugins/     # Plugin lifecycle management
│   │       │   └── scheduler/   # Cron job management
│   │       └── shared/      # Database, Guards, Utils
│   │
│   └── host-frontend/       # React + Vite - Dashboard UI
│       └── src/
│           ├── app/         # Routes/Pages
│           ├── components/  # UI Components (Dumb)
│           └── features/    # Feature modules (Smart)
│
├── packages/
│   ├── sdk/                 # Shared types and utilities
│   │   └── src/types/       # Manifest, Permissions, RPC, Tiles
│   │
│   └── sandbox/             # isolated-vm wrapper for secure execution
│       └── src/             # SandboxService, SandboxInstance
│
├── plugins/                 # Reference plugins
│   └── moderator/           # Example: Toxic comment detector
│       ├── manifest.json
│       ├── backend/index.js
│       └── frontend/index.html
│
├── drizzle/                 # Database migrations
└── docs/                    # Documentation & User Stories
```

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

# Run tests
pnpm test
```

### Development

```bash
# Start all apps in development mode
pnpm dev

# Or start individually
pnpm --filter host-backend dev    # Backend at http://localhost:3000
pnpm --filter host-frontend dev   # Frontend at http://localhost:5173
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

## 🛠️ Tech Stack

| Layer     | Technology                                          |
| --------- | --------------------------------------------------- |
| Backend   | NestJS, TypeScript 5.7, better-sqlite3, Drizzle ORM |
| Frontend  | React 19, Vite 6, TailwindCSS                       |
| Isolation | isolated-vm                                         |
| Scheduler | node-cron, @nestjs/event-emitter                    |
| Monorepo  | pnpm workspaces, Turborepo                          |

## 📋 Roadmap

### Phase 1: Trust & Standard (Current)

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
- [ ] Host Frontend Dashboard (Epic 05)

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
