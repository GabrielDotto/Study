import { configureStore } from "@reduxjs/toolkit";

/**
 * GLOBAL STORE — Container (Shell) App
 * ──────────────────────────────────────
 * The container COMPOSES slices from each microfrontend into one global store.
 * It does NOT define domain logic — that belongs to each remote team.
 *
 * ─── Monorepo (this PoC) ──────────────────────────────────────────────────
 * We import directly via relative file path because all apps share a filesystem:
 *   import shipmentsReducer from "../../../shipments/src/store/shipmentsSlice";
 *
 * ─── Multi-repo (real production teams) ───────────────────────────────────
 * Each team publishes their slice as an npm package to an internal registry
 * (e.g. Verdaccio, GitHub Packages, AWS CodeArtifact).
 * The container installs and imports them like any other dependency:
 *
 *   // container/package.json
 *   "dependencies": {
 *     "@shiptrack/shipments-slice": "^1.2.0",
 *     "@shiptrack/tracker-slice":   "^0.8.0"
 *   }
 *
 *   // container/src/store/index.js
 *   import shipmentsReducer from "@shiptrack/shipments-slice";
 *   import trackerReducer   from "@shiptrack/tracker-slice";
 *
 * The slice logic stays IDENTICAL — only the import path changes.
 * Teams version and release their slices independently via semver.
 *
 * ─── Why import at build time instead of via Module Federation? ────────────
 * The store must be fully configured BEFORE the app renders.
 * Async MF loading would create a race condition: components would try to
 * read state before reducers are registered → runtime errors.
 * Build-time imports guarantee the store is ready synchronously at startup.
 */

// Importing only the REDUCER (default export) — not the action creators.
// Action creators stay in the remote app; the remote components import them locally.
import shipmentsReducer from "../../../shipments/src/store/shipmentsSlice";

export const store = configureStore({
  reducer: {
    // "shipments" key → this is what components read via:
    //   useSelector(state => state.shipments.items)
    //
    // The key MUST match what each remote team's selectors expect.
    // In a multi-repo setup, this convention would be documented in a
    // shared architecture decision record (ADR).
    shipments: shipmentsReducer,
  },
});

export default store;
