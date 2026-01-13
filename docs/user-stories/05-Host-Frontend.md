# Epic 05: Host Frontend & UX

**Goal:** Create a modern, responsive, and secure UI for managing agents.
**Priority:** High
**Phase:** 1 (MVP)

---

## US-501: Dashboard Grid Layout (Bento)

**As a** User,
**I want** a flexible grid interface,
**So that** I can see all my running agents' status at a glance.

### Visual Spec

![Bento Grid Wireframe](C:\Users\yetin.gemini\antigravity\brain\d14e04e7-2909-45c1-8290-25faed902ea6\bento_dashboard_wireframe_1768298840199.png)

### Acceptance Criteria

- [ ] **Grid System:** Implement a CSS Grid layout (React-Grid-Layout or pure CSS).
- [ ] **Cards:** Standard container component with rounded corners `rounded-xl`, dark background `bg-card`.
- [ ] **Responsiveness:** Stacks vertically on mobile.
- [ ] **Navbar:** Fixed top bar with "Context: Localhost" indicator.

---

## US-502: Plugin Store & Installation Flow

**As a** User,
**I want** to browse and install plugins from a local file or URL,
**So that** I can add capabilities to my shell.

### Acceptance Criteria

- [ ] **Upload:** Drag & Drop zone for `.zip` files.
- [ ] **Git URL:** Input field to clone from a Git repository.
- [ ] **Validation:** Frontend parses `manifest.json` before upload to display metadata (Name, Version).

---

## US-503: Permissions Confirmation Modal

**As a** User,
**I want** to explicitly grant permissions to a plugin,
**So that** I understand the security risks before running code.

### Visual Spec

![Plugin Install Modal Wireframe](C:\Users\yetin.gemini\antigravity\brain\d14e04e7-2909-45c1-8290-25faed902ea6\plugin_install_wireframe_1768298861327.png)

### Acceptance Criteria

- [ ] **Trigger:** Opens automatically after parsing a new plugin manifest.
- [ ] **Design:** Modal overlay with "Dimmed" background.
- [ ] **List:** Enumerates all requested permissions (`vault:read`, `network:public`).
- [ ] **Icons:** Uses distinct icons for risky permissions (e.g., Unlocked Padlock for Vault).
- [ ] **Action:** "Install & Grant" button sends confirmation to Backend.

---

## US-504: Plugin Webview Host (Iframe)

**As a** Developer,
**I want** my plugin's UI to run in an isolated Iframe,
**So that** CSS styles do not leak or conflict with the Shell.

### Acceptance Criteria

- [ ] Component `<PluginHost src="..." />`.
- [ ] **Security:** Iframe must have `sandbox="allow-scripts allow-forms"`.
- [ ] **Communication:** Setup `window.addEventListener('message', ...)` to bridge UI events to Backend RPC.
