import { useSelector, useDispatch } from "react-redux";
// Importing action creators from the SHIPMENTS team's slice.
// In a multi-repo world, this would be: import { selectShipment } from "@shiptrack/shipments-slice"
// For this monorepo PoC, we use a relative path.
import { selectShipment } from "../../../shipments/src/store/shipmentsSlice";

/**
 * TRACKER PAGE — Exposed Remote Component
 * ─────────────────────────────────────────
 * The tracker MFE shows detailed tracking information for the selected shipment.
 * It is a READ-HEAVY component: it reads from the shared store but mostly dispatches
 * only "selectShipment" to change which shipment is being viewed.
 *
 * Same pattern as ShipmentsPage:
 *   - No <Provider> wrapper
 *   - No props from container
 *   - Works standalone AND inside container without code changes
 *
 * Cross-MFE interaction demo:
 *   1. User adds shipment on Home page (container)     → dispatch(addShipment)
 *   2. User clicks row on Shipments page (remote :3001) → dispatch(selectShipment)
 *   3. User navigates to Tracker page (this component, remote :3002)
 *   4. TrackerPage reads selectedId from the SAME shared store → shows details
 *
 * This demonstrates true shared state across independently deployed MFEs.
 *
 * Why does this import from the shipments slice?
 * ────────────────────────────────────────────────
 * The tracker team needs to dispatch `selectShipment` — but that action type
 * ("shipments/selectShipment") is OWNED by the shipments team.
 * Options:
 *   A) Import from @shiptrack/shipments-slice (npm package, multi-repo)
 *   B) Use the raw action type string: dispatch({ type: "shipments/selectShipment", payload: id })
 *   C) Relative import (monorepo, this PoC)
 *
 * We use option C here. Option B is perfectly valid for loose coupling.
 * Option A is the production-grade solution for true team independence.
 */

const STATUS_COLORS = {
  pending: "#ffc107",
  in_transit: "#17a2b8",
  delivered: "#28a745",
  cancelled: "#dc3545",
};

// Simulated tracking steps for the PoC
const TRACKING_STEPS = {
  pending: ["Order Placed"],
  in_transit: ["Order Placed", "Dispatched", "In Transit"],
  delivered: ["Order Placed", "Dispatched", "In Transit", "Out for Delivery", "Delivered"],
  cancelled: ["Order Placed", "Cancelled"],
};

export default function TrackerPage() {
  const dispatch = useDispatch();

  const items = useSelector((state) => state.shipments.items);
  const selectedId = useSelector((state) => state.shipments.selectedId);

  // Find the selected shipment from the shared store
  const selected = items.find((s) => s.id === selectedId);

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      {/* Context badge */}
      <div
        style={{
          background: "#f0fff4",
          border: "1px solid #28a745",
          borderRadius: "6px",
          padding: "0.5rem 1rem",
          marginBottom: "1.5rem",
          fontSize: "0.82rem",
          color: "#155724",
        }}
      >
        <strong>Tracker MFE</strong> — loaded from port 3002.
        Reading <code>selectedId</code> from the shared Redux store.
        Select a shipment on the <strong>Shipments</strong> page to see it here.
      </div>

      <h2 style={{ marginTop: 0 }}>Shipment Tracker</h2>

      {/* No shipment selected state */}
      {!selected && (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "#888",
            border: "2px dashed #ddd",
            borderRadius: "8px",
          }}
        >
          <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📦</p>
          <p>No shipment selected.</p>
          <p style={{ fontSize: "0.85rem" }}>
            Go to{" "}
            <a href="/shipments" style={{ color: "#4a90e2" }}>
              Shipments
            </a>{" "}
            and click on a row.
          </p>
        </div>
      )}

      {/* Selected shipment tracking view */}
      {selected && (
        <div>
          {/* Shipment summary card */}
          <div
            style={{
              background: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "1.25rem",
              marginBottom: "1.5rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#aaa",
                    marginBottom: "0.25rem",
                    fontFamily: "monospace",
                  }}
                >
                  ID: {selected.id}
                </div>
                <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>
                  {selected.description}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#888", marginTop: "0.25rem" }}>
                  Created: {new Date(selected.createdAt).toLocaleString()}
                </div>
              </div>
              <span
                style={{
                  padding: "0.3rem 0.9rem",
                  borderRadius: "999px",
                  fontSize: "0.82rem",
                  fontWeight: "700",
                  background: STATUS_COLORS[selected.status] + "22",
                  color: STATUS_COLORS[selected.status],
                  border: `1px solid ${STATUS_COLORS[selected.status]}`,
                }}
              >
                {selected.status}
              </span>
            </div>
          </div>

          {/* Tracking timeline */}
          <div
            style={{
              background: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "1.25rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
              Tracking Timeline
            </h3>
            {(TRACKING_STEPS[selected.status] || ["Order Placed"]).map(
              (step, index) => (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: STATUS_COLORS[selected.status],
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "0.95rem" }}>
                    Step {index + 1}: {step}
                  </span>
                </div>
              )
            )}
          </div>

          {/* Quick switch to another shipment */}
          {items.length > 1 && (
            <div style={{ marginTop: "1.5rem" }}>
              <h3>Other Shipments</h3>
              {items
                .filter((s) => s.id !== selected.id)
                .map((s) => (
                  <button
                    key={s.id}
                    onClick={() => dispatch(selectShipment(s.id))}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "0.75rem 1rem",
                      marginBottom: "0.5rem",
                      background: "white",
                      border: "1px solid #e0e0e0",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    {s.description}{" "}
                    <span style={{ color: "#aaa", fontSize: "0.8rem" }}>
                      ({s.status})
                    </span>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
