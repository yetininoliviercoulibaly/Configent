# Product Requirements Document (PRD) : Projet Pouget (AgentsConfigurator)

**Version :** 1.1  
**Statut :** Conception Finale / Prêt pour Développement  
**Propriétaire :** Équipe Produit  
**Date :** Janvier 2026  

---

## 1. Résumé Exécutif (Executive Summary)
Le projet **Pouget** est une plateforme d'orchestration d'agents IA basée sur une architecture de type **Micro-Kernel**. L'objectif est de centraliser la gestion d'agents IA spécialisés (plugins) au sein d'une interface unique, tout en garantissant une isolation totale, une extensibilité simplifiée et une protection stricte de la vie privée.

## 2. Objectifs Stratégiques
* **Modularité :** Permettre l'ajout d'agents tiers via une interface standardisée (Contrat de Plugin).
* **Contrôle :** Offrir une configuration granulaire des prompts et des comportements IA pour chaque agent.
* **Interopérabilité :** Support natif du protocole **MCP (Model Context Protocol)** pour l'utilisation d'outils externes.
* **Confidentialité :** Mise en place de filtres ("Privacy Gates") pour sécuriser le traitement des données personnelles.

---

## 3. Architecture Fonctionnelle
La plateforme est divisée en deux entités distinctes :

### 3.1 Le Shell (Le Noyau / Host)
Le Shell est l'application hôte. Ses responsabilités incluent :
* **Gestion des Plugins :** Chargement dynamique des manifests JSON et injection des interfaces.
* **Persistance :** Stockage centralisé des configurations (chiffrées) et des logs d'exécution.
* **Communication :** Interface de pont (Bridge) sécurisée via JSON-RPC 2.0.
* **Tableau de Bord Global :** Vue consolidée de l'activité de tous les agents (Bento Box UI).

### 3.2 Les Orchestrateurs (Plugins / Agents)
Chaque agent est un module isolé s'exécutant dans une **Sandbox (Iframe)**.
* **Frontend :** Chaque plugin fournit son interface propre (HTML/TS) pour ses réglages spécifiques.
* **Backend :** Logique d'orchestration spécifique, capable d'appeler des LLM et des outils MCP via le Shell.



---

## 4. Spécifications des Agents Initiaux

### 4.1 Agent 1 : Modérateur Multi-Plateforme (MCP)
* **Objectif :** Automatiser la modération des avis et commentaires tiers.
* **Workflow :** Capture via MCP -> Analyse LLM -> Action (Approve/Reject/Reply).
* **Configuration :** Master Prompt modifiable incluant des variables dynamiques (`{{rules}}`, `{{tone}}`).

### 4.2 Agent 2 : Content Manager & Ghostwriter
* **Objectif :** Synthèse d'activité (LinkedIn, Mails, Journal) pour génération d'articles.
* **Connecteurs :** API LinkedIn, IMAP (Mails), Flux RSS, Input Manuel.
* **Sécurité :** Filtrage PII (données personnelles) et validation humaine obligatoire.

---

## 5. Spécifications Techniques

### 5.1 Stack Technologique
| Composant | Technologie |
| :--- | :--- |
| **Backend Core** | NestJS (Node.js 24), Prisma ORM |
| **Frontend Shell** | React, Tailwind CSS, Shadcn/UI |
| **Base de Données** | PostgreSQL & Redis (BullMQ pour le scheduler) |
| **Isolation** | Sandbox Iframes + API PostMessage |
| **Infrastructure** | Docker Compose (Multi-services) |

### 5.2 Le Contrat de Communication (JSON-RPC 2.0)
Toute interaction doit suivre le standard JSON-RPC. Exemple d'appel :
```json
{
  "jsonrpc": "2.0",
  "id": "req_123",
  "method": "config/set",
  "params": { "key": "system_prompt", "value": "Tu es un assistant..." }
}

### Sécurité et Confidentialité (Privacy Gates)
Trois niveaux de protection pour les données sensibles (Agent 2) :
Whitelist Source : Seuls les dossiers mails et types d'activités spécifiés sont ingérés.
Negative Constraints : Prompts système interdisant l'usage de données privées (finances, santé).
Audit Post-Génération : Analyse automatique du brouillon par une instance de contrôle pour détecter d'éventuelles fuites de données.

7. Annexe Technique : Schéma du Manifeste (plugin.json)
Tout plugin doit être déclaré via cette structure :

{
  "id": "string",
  "name": "string",
  "version": "1.0.0",
  "entrypoint": {
    "frontend": "dist/index.html",
    "backend": "dist/worker.js"
  },
  "permissions": ["ui:notify", "mcp:call", "storage:config"],
  "defaults": {
    "prompts": {
      "system": "Master prompt par défaut...",
      "rules": "Règles métier par défaut..."
    },
    "settings": {}
  }
}

8. Roadmap de Développement
Phase 1 : MVP Core (Kernel + DB + Auth).

Phase 2 : Bridge de communication asynchrone (Iframe <> Shell).

Phase 3 : Intégration de l'Agent 1 (Modérateur MCP).

Phase 4 : Connecteurs de l'Agent 2 et moteur de synthèse.

Phase 5 : Dashboard Global (Vue Bento).