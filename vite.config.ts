import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    // ShipIt runs this dev server in its own container, watching the workspace
    // through a shared named volume. The agent edits files from a *different*
    // container, so inotify events don't cross the mount-namespace boundary to
    // Vite's watcher and HMR silently no-ops. Polling is namespace-independent,
    // so it's the reliable fix for hot reload in this setup.
    watch: { usePolling: true, interval: 200 },
  },
});
