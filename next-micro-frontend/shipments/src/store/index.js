import { configureStore } from "@reduxjs/toolkit";
import shipmentsReducer from "./shipmentsSlice";

/**
 * STANDALONE STORE — Shipments App (port 3001)
 * ─────────────────────────────────────────────
 * Used ONLY when the shipments app runs independently for development.
 * When loaded by the container, this store is never created.
 *
 * Pre-seeded initial state:
 * ──────────────────────────
 * Instead of duplicating a "form to add shipments" in the standalone page,
 * we pre-populate the store with mock data. This means:
 *   - The shipments team can see and interact with their UI immediately
 *   - Zero business logic duplication
 *   - The standalone index.jsx is just: <ShipmentsPage /> — one line
 *
 * In a real project, this mock data would come from a shared fixtures file
 * (e.g. packages/fixtures/shipments.js) imported by any app that needs it.
 */

const MOCK_SHIPMENTS = [
  {
    id: "mock-1",
    description: "Laptop — São Paulo to Porto Alegre",
    status: "in_transit",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "mock-2",
    description: "Smartphone — Rio de Janeiro to Curitiba",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: "mock-3",
    description: "Monitor — Belo Horizonte to Brasília",
    status: "delivered",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
];

export const store = configureStore({
  reducer: {
    shipments: shipmentsReducer,
  },
  // Inject mock data so the standalone mode is immediately usable.
  // The `preloadedState` key must match the reducer key ("shipments").
  preloadedState: {
    shipments: {
      items: MOCK_SHIPMENTS,
      selectedId: "mock-1",
    },
  },
});

export default store;
