import { createSlice } from "@reduxjs/toolkit";

/**
 * SHIPMENTS SLICE — owned by the Shipments MFE team
 * ──────────────────────────────────────────────────
 * This slice is the single source of truth for the "shipments" domain.
 * It lives HERE, in the shipments app, because the shipments team owns it.
 *
 * It is imported in TWO places:
 *   1. shipments/src/store/index.js    → used when running standalone (:3001)
 *   2. container/src/store/index.js    → used when loaded by the shell (:3000)
 *
 * This is the monorepo advantage: one file, two consumers, zero duplication.
 *
 * In a multi-repo setup (truly separate teams), this would be published
 * as an npm package (e.g. @shiptrack/shipments-slice) and installed
 * as a dependency by the container.
 *
 * Key architectural rule:
 *   → The remote OWNS the slice (domain logic stays with the team)
 *   → The container COMPOSES slices into the global store
 *   → Remote components import actions from their OWN slice — no coupling to container
 */

const shipmentsSlice = createSlice({
  name: "shipments", // Action type prefix: "shipments/addShipment", etc.

  initialState: {
    items: [],        // List of shipment objects
    selectedId: null, // Which shipment is being tracked
  },

  reducers: {
    // Redux Toolkit uses Immer — "mutate" draft state safely
    addShipment: (state, action) => {
      // action.payload = description string
      state.items.push({
        id: String(Date.now()),
        description: action.payload,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    },

    updateStatus: (state, action) => {
      // action.payload = { id: string, status: string }
      const shipment = state.items.find((s) => s.id === action.payload.id);
      if (shipment) {
        shipment.status = action.payload.status;
      }
    },

    selectShipment: (state, action) => {
      // action.payload = shipment id string
      // Changing this here is immediately visible to the Tracker MFE
      // because they share the same store (via Module Federation singleton)
      state.selectedId = action.payload;
    },
  },
});

export const { addShipment, updateStatus, selectShipment } = shipmentsSlice.actions;
export default shipmentsSlice.reducer;
