import { SDK_VERSION } from "@configent/sdk";
import "./App.css";

/**
 * Root application component for Configent Dashboard.
 *
 * Architecture: Feature-Sliced Design
 * - Smart components in features/ (business logic)
 * - Dumb components in components/ui/ (presentation only)
 * - Services handle API communication
 */
function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Configent</h1>
        <p className="tagline">Your Keys, Your Data, Your Runtime</p>
      </header>

      <main className="app-main">
        <section className="welcome-card">
          <h2>Welcome to Configent</h2>
          <p>
            Local-First AI Agent Orchestration Platform.
            <br />
            SDK Version: <code>{SDK_VERSION}</code>
          </p>
          <div className="status-badge">
            <span className="status-dot"></span>
            <span>System Ready</span>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Phase 1 MVP - Open Source</p>
      </footer>
    </div>
  );
}

export default App;
