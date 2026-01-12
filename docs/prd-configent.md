# Product Requirements Document (PRD) : Configent

**Version :** 2.0.1
**Statut :** Spécifications Actives (Phase 1 - MVP Open Source)
**Projet :** Configent (ex-Pouget)
**Date :** Janvier 2026

---

## 1. Vision & Stratégie Produit

### 1.1 Identité du Produit

**Configent** est une plateforme d'orchestration d'agents IA "Local-First" et "Open-Core". Elle permet aux développeurs de créer des agents IA modulaires (Plugins) qui s'exécutent dans un environnement sécurisé, isolé et sous le contrôle total de l'utilisateur final.

### 1.2 Proposition de Valeur

- **Pour les Développeurs :** Un OS pour agents. Fournit l'authentification, le stockage sécurisé, les logs et l'interface utilisateur unifiée. Plus besoin de créer un SaaS complet pour un simple script d'agent.
- **Pour les Utilisateurs :** Souveraineté des données. Les clés API et les données ne sortent jamais de leur infrastructure (Localhost ou VPS personnel).
- **Core Promise :** "Your Keys, Your Data, Your Runtime".

### 1.3 Roadmap Stratégique (Focus Phase 1)

| Phase | Nom de Code          | Focus Technique                                                                        | Focus Business                                   |
| :---- | :------------------- | :------------------------------------------------------------------------------------- | :----------------------------------------------- |
| **1** | **Trust & Standard** | **Architecture v1 (MVP)**. Isolation stricte. Support MCP de base. "Direct Mode" only. | **Adoption Developer**. 0€ Revenue. OSS License. |
| **2** | Cloud & Convenience  | _Hors Scope v2.0._ SaaS Hébergé. Proxy de facturation API.                             | Revenus récurrents (SaaS).                       |

---

## 2. Architecture Fonctionnelle (Strict Phase 1)

L'architecture est de type **Micro-Kernel Host**. Le Host (Shell) gère le cycle de vie, la sécurité et l'interface. Les Fonctionnalités sont exclusivement des Plugins.

### 2.1 Le Shell (Host)

Responsable unique de la sécurité et de la persistance.

- **Gestion des Plugins :**
  - Installation depuis URL Git ou archive `.zip` locale.
  - Parsing et validation du `manifest.json`.
  - Supervisor System : Relance automatique des plugins crashés.
- **Vault (Gestionnaire de Secrets) :**
  - Stockage chiffré (AES-256-GCM) des credentials.
  - **Mode Direct Uniquement :** L'utilisateur doit entrer ses propres clés API (OpenAI, Anthropic, etc.) dans le Vault.
  - Injection sécurisée : Les secrets sont passés aux plugins via variables d'environnement éphémères ou RPC sécurisé, jamais stockés sur disque par le plugin.
- **Dashboard Unifié (Grid UI) :**
  - Layout en grille standardisée.
  - Rendu des "Tiles" (Widgets) exposés par les plugins.
- **Message Bridge :**
  - Bus d'événements interne.
  - Contrôle strict des permissions avant routage de message.

### 2.2 Les Plugins (Agents)

Applications "Sandboxed" sans accès direct au système hôte.

- **Frontend Isolation :**
  - Chaque plugin expose une interface (HTML/React) chargée dans une **Iframe** avec attributs `sandbox="allow-scripts"`.
  - Communication Shell <-> Iframe via `window.postMessage` uniquement.
- **Backend Isolation :**
  - Exécution du code Node.js dans un contexte virtualisé **`isolated-vm`**.
  - **Accès Interdit :** FileSystem (sauf dossier `/data` dédié), Network (sauf whitelist), Child Process.
  - **Accès Autorisé :** API du Shell via exposant RPC.

---

## 3. Spécifications Techniques

### 3.1 Stack Technologique

**Décisions Fermes pour la v2.0.**

| Couche            | Technologie                         | Justification                                                          |
| :---------------- | :---------------------------------- | :--------------------------------------------------------------------- |
| **Backend Host**  | **NestJS** (Node 24 LTS)            | Structure modulaire, Injection de dépendances, TypeScript strict.      |
| **Frontend Host** | **React 19** + **Vite**             | Standard industriel, performance, écosystème.                          |
| **UI Library**    | **TailwindCSS** + **Shadcn/UI**     | Composants accessibles et customisables.                               |
| **Database**      | **SQLite** (via **Better-SQLite3**) | Fichiers locaux pour Phase 1. Pas de dépendance Docker lourde type PG. |
| **ORM**           | **Prisma** ou **Drizzle**           | Type-safety. (Préférence Drizzle pour performance SQLite).             |
| **Isolation**     | **`isolated-vm`**                   | **OBLIGATOIRE.** Sécurité mémoire V8. Plus sûr que `vm2`.              |
| **Queueing**      | **P-Queue** (In-Memory)             | Redis retiré pour Phase 1 (simplification déploiement local).          |

### 3.2 Modèle de Données (Entités Core)

Voici les entités minimales requises pour le MVP.

#### `Config` (Singleton)

- `instanceId`: UUID unique de l'installation.
- `masterKeyHash`: Hash du mot de passe maître (déverrouille le Vault).

#### `PluginInstall`

- `id`: UUID.
- `packageId`: string (ex: `com.configent.moderator`).
- `version`: string (SemVer).
- `status`: Enum (`ENABLED`, `DISABLED`, `CRASHED`).
- `permissions`: JSON Array (scopes acceptés par l'user).
- `config`: JSON (Configuration spécifique utilisateur).

#### `Secret`

- `key`: string (ex: `OPENAI_API_KEY`).
- `encryptedValue`: string (Base64 du chiffré).
- `iv`: string.
- `scope`: Enum (`GLOBAL`, `PLUGIN_SPECIFIC`).

#### `EventLog`

- `timestamp`: DateTime.
- `source`: string (Plugin ID ou 'SYSTEM').
- `level`: Enum (`INFO`, `WARN`, `ERROR`).
- `message`: string.

---

## 4. Interfaces & Protocoles

### 4.1 Plugin RPC Interface

Le Shell expose ces méthodes aux Plugins (via injection dans le contexte `isolated-vm`).

- **`vault.getSecret(key: string): Promise<string>`**
  - _Permission:_ `vault:read`
  - Retourne la valeur déchiffrée d'un secret.
- **`network.fetch(url: string, options: FetchOptions): Promise<Response>`**
  - _Permission:_ `network:public` (avec whitelist optionnelle).
  - Proxy http pour les requêtes sortantes.
- **`store.set(key: string, value: any): Promise<void>`**
  - _Permission:_ `storage:write`
  - Persistance simple Key-Value pour le plugin.
- **`store.get(key: string): Promise<any>`**
  - _Permission:_ `storage:read`
- **`notify.send(level: string, message: string): Promise<void>`**
  - _Permission:_ `ui:notify`
  - Affiche un toast dans le Shell.
- **`scheduler.register(cronExpression: string, handlerId: string): Promise<void>`**
  - _Permission:_ `schedule:register`
  - Enregistre une tâche récurrente qui réveillera le plugin.

### 4.2 UI Tile Schema (Bento)

Chaque plugin définit ses widgets dans `manifest.json`.

```json
{
  "tiles": [
    {
      "id": "status-widget",
      "type": "webview",
      "size": "1x1",
      "src": "index.html#widget"
    }
  ]
}
```

---

## 5. Sécurité & Compliance

### 5.1 Permissions Model (Android-style)

Au moment de l'installation, le Shell scanne le `manifest.json`.
Si le plugin demande des permissions critiques (ex: `vault:read`), une modale de confirmation explicite bloque l'installation.

### 5.2 Isolation Sandbox

- Le code du plugin ne peut **JAMAIS** lire les variables d'environnement du processus Shell (`process.env` est vide).
- Le code du plugin a un timeout d'exécution strict (ex: 30s max pour un handler).

---

## 6. Plugins de Référence (Dogfooding)

Pour valider l'architecture "Core vs Plugin" durant le développement, deux plugins officiels seront développés en parallèle du Shell.

### 6.1 Plugin A : "The Moderator" (Architecture Test: Scheduler & MCP Client)

_Objectif Technique : Valider le Scheduler, l'intégration MCP et le pattern "Pull"._

- **Use Case :** Tâche de fond qui surveille une source de contenu externe (WordPress, Discord, JSON feed) via MCP, analyse les nouveaux items et flag/supprime si toxique.
- **Workflow (Background Job) :**
  1.  **Schedule :** Le plugin s'enregistre via `scheduler.register('*/10 * * * *', 'check_new_content')`.
  2.  **Pull (MCP) :** Au réveil, il appelle un outil MCP tiers (ex: `wordpress_mcp.list_comments({ status: 'pending' })`).
  3.  **Process :** Analyse LLM locale ou distante (via Vault Key).
  4.  **Action :** Si toxique, appel MCP `wordpress_mcp.update_comment({ id, status: 'trash' })`.
- **Validation :** Prouve que Configent peut orchestrer des workflows autonomes sans intervention utilisateur.
- **Avantage :** 100% Local-First. Pas besoin d'exposer de Webhook public (tunneling) pour recevoir les événements.

### 6.2 Plugin B : "The Editor" (Architecture Test: Complex Workflow & State)

_Objectif Technique : Valider l'UI interactive et l'orchestration Multi-MCP (GitHub + Search)._

- **Use Case :** Agent de "Content Strategy" personnel.
- **Workflow A : Daily Standup (Factual Reporting)**
  1.  **Ingest (Source):** Le plugin interroge l'outil **MCP GitHub** (Commits, PRs des dernières 24h).
  2.  **Ingest (Context):** Récupère les notes manuelles du **Journal** (UI).
  3.  **Process:** Génère un résumé "Standup" : "Ce que j'ai fait (Commits)", "Ce qui a bloqué (Journal)", "Plan du jour".
- **Workflow B : Blog Discovery (Inspiration)**
  1.  **Ingest:** Tâche de fond (Cron) interrogeant l'outil **MCP Search** (News Web/IA/.NET).
  2.  **Synthesis:** Propose des sujets de blog en croisant l'actualité chaude et les notes du Journal.
- **Complexité :** Ce plugin est une "mini-application" complète. Il teste la capacité du système à gérer plusieurs connecteurs MCP hétérogènes.
