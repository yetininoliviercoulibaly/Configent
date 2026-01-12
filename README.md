# Configent

<div align="center">

![Configent Logo](https://img.shields.io/badge/Configent-AI%20Agent%20Platform-blueviolet?style=for-the-badge)

**Local-First AI Agent Orchestration Platform**

*Your Keys, Your Data, Your Runtime*

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
│   └── Permission Modals  │      ├── RPC Bridge                  │
│                          │      └── SQLite (Drizzle ORM)        │
└──────────────────────────┴──────────────────────────────────────┘
                                    │
                         ┌──────────┴──────────┐
                         │   Plugin Runtime    │
                         │   (V8 Isolates)     │
                         │   ┌─────┐ ┌─────┐   │
                         │   │ P1  │ │ P2  │   │
                         │   └─────┘ └─────┘   │
                         └─────────────────────┘
```

## 📁 Project Structure

```
configent/
├── apps/
│   ├── host-backend/        # NestJS - Core Shell Backend
│   │   └── src/
│   │       ├── modules/     # Feature modules (Hexagonal Architecture)
│   │       └── shared/      # Database, Guards, Utils
│   │
│   └── host-frontend/       # React + Vite - Dashboard UI
│       └── src/
│           ├── app/         # Routes/Pages
│           ├── components/  # UI Components (Dumb)
│           └── features/    # Feature modules (Smart)
│
├── packages/
│   └── sdk/                 # Shared types and utilities
│       └── src/types/       # Manifest, Permissions, RPC, Tiles
│
├── plugins/                 # Reference plugins (future)
├── drizzle/                 # Database migrations (future)
└── docs/                    # Documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 22 LTS or later
- **pnpm** 9.x (`npm install -g pnpm`)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Configent.git
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

| Package | Description |
|---------|-------------|
| `host-backend` | NestJS backend with hexagonal architecture |
| `host-frontend` | React + Vite dashboard with Feature-Sliced Design |
| `@configent/sdk` | Shared TypeScript types for Host and Plugins |

## 🔐 Security Model

Configent follows **Zero Trust Plugins** principles:

- **Sandbox Isolation**: Plugins run in isolated V8 contexts (`isolated-vm`)
- **Permission System**: Android-style explicit permission grants
- **No Process Access**: `process.env` is empty inside sandboxes
- **Resource Limits**: Memory (128MB) and timeout (30s) constraints
- **RPC Only**: Plugins communicate via controlled RPC bridge

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | NestJS, TypeScript 5.7, better-sqlite3, Drizzle ORM |
| Frontend | React 19, Vite 6, TailwindCSS (planned), Shadcn/UI (planned) |
| Isolation | isolated-vm |
| Monorepo | pnpm workspaces, Turborepo |

## 📋 Roadmap

### Phase 1: Trust & Standard (Current)
- [x] Monorepo scaffolding
- [ ] SQLite + Drizzle migrations
- [ ] Vault service (AES-256-GCM)
- [ ] Sandbox engine
- [ ] RPC Bridge
- [ ] Plugin system

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

- **Project Link**: [https://github.com/YOUR_USERNAME/Configent](https://github.com/YOUR_USERNAME/Configent)

---

<div align="center">
Made with ❤️ for the AI Agent community
</div>
