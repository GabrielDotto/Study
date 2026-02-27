import { configureStore } from "@reduxjs/toolkit";

/**
 * STANDALONE STORE — Tracker App (port 3002)
 * ────────────────────────────────────────────
 * Used ONLY when the tracker app runs independently.
 *
 * The tracker MFE only READS from the "shipments" slice — it doesn't own it.
 * But to run standalone it needs the same reducer so the store shape matches.
 *
 * In a multi-repo setup, the tracker team would install:
 *   npm install @shiptrack/shipments-slice
 * and import the reducer from that package.
 *
 * In this monorepo, we use a relative path. Same result, different import strategy.
 */

// Import the reducer from the shipments team's slice (monorepo relative path).
// Multi-repo equivalent: import shipmentsReducer from "@shiptrack/shipments-slice/reducer"
// Path from tracker/src/store/ → up 3 levels to monorepo root → into shipments/
// Multi-repo equivalent: import shipmentsReducer from "@shiptrack/shipments-slice/reducer"
import shipmentsReducer from "../../../shipments/src/store/shipmentsSlice";

const MOCK_SHIPMENTS = [
  {
    id: "mock-1",
    description: "Laptop — São Paulo to Porto Alegre",
    status: "in_transit",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "mock-2",
    description: "Smartphone — Rio de Janeiro to Curitiba",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const store = configureStore({
  reducer: {
    // Must use the same key as the container's store: "shipments"
    shipments: shipmentsReducer,
  },
  preloadedState: {
    shipments: {
      items: MOCK_SHIPMENTS,
      selectedId: "mock-1", // Pre-select so the tracker shows something immediately
    },
  },
});

export default store;
