# Epic 05: Host Frontend & UX

**Goal:** Create a modern, responsive, and secure UI for managing agents.
**Priority:** High
**Phase:** 1 (MVP)
**Status:** ✅ Complete

---

## US-501: Dashboard Grid Layout (Bento)

**As a** User,
**I want** a flexible grid interface,
**So that** I can see all my running agents' status at a glance.

### Acceptance Criteria

- [x] **Grid System:** Implement a CSS Grid layout (React-Grid-Layout or pure CSS).
- [x] **Cards:** Standard container component with rounded corners `rounded-xl`, dark background `bg-card`.
- [x] **Responsiveness:** Stacks vertically on mobile.
- [x] **Navbar:** Fixed top bar with "Context: Localhost" indicator.

---

## US-502: Plugin Store & Installation Flow

**As a** User,
**I want** to browse and install plugins from a local file or URL,
**So that** I can add capabilities to my shell.

### Acceptance Criteria

- [x] **Upload:** Drag & Drop zone for `.zip` files.
- [x] **Git URL:** Input field to clone from a Git repository.
- [x] **Validation:** Frontend parses `manifest.json` before upload to display metadata (Name, Version).

---

## US-503: Permissions Confirmation Modal

**As a** User,
**I want** to explicitly grant permissions to a plugin,
**So that** I understand the security risks before running code.

### Acceptance Criteria

- [x] **Trigger:** Opens automatically after parsing a new plugin manifest.
- [x] **Design:** Modal overlay with "Dimmed" background.
- [x] **List:** Enumerates all requested permissions (`vault:read`, `network:public`).
- [x] **Icons:** Uses distinct icons for risky permissions (e.g., Unlocked Padlock for Vault).
- [x] **Action:** "Install & Grant" button sends confirmation to Backend.

---

## US-504: Plugin Webview Host (Iframe)

**As a** Developer,
**I want** my plugin's UI to run in an isolated Iframe,
**So that** CSS styles do not leak or conflict with the Shell.

### Acceptance Criteria

- [x] Component `<PluginHost src="..." />`.
- [x] **Security:** Iframe must have `sandbox="allow-scripts allow-forms"`.
- [x] **Communication:** Setup `window.addEventListener('message', ...)` to bridge UI events to Backend RPC.
