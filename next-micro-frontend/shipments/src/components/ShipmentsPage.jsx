import { useSelector, useDispatch } from "react-redux";
import { updateStatus, selectShipment } from "../store/shipmentsSlice";

/**
 * SHIPMENTS PAGE — Exposed Remote Component
 * ──────────────────────────────────────────
 * This is the component the shipments MFE exposes via Module Federation.
 * Other apps consume it with: import('shipments/ShipmentsPage')
 *
 * KEY DESIGN PRINCIPLE — No Provider, No Props from Container:
 * ─────────────────────────────────────────────────────────────
 * This component has NO <Provider> wrapper and accepts NO store/action props.
 * It uses useSelector and useDispatch directly — exactly like any normal component.
 *
 * This works because of the React Context + Module Federation singleton contract:
 *
 *   When INSIDE the container (port 3000):
 *     Container's <Provider store={containerStore}> is above this in the tree.
 *     react-redux is a singleton → same Context object → useSelector finds containerStore.
 *
 *   When running STANDALONE (port 3001):
 *     Shipments' own <Provider store={localStore}> from _app.jsx is above this.
 *     useSelector finds localStore.
 *
 * Same component, zero changes, works in both contexts.
 * This is full team autonomy — the shipments team never needs to talk to
 * the container team to develop or test their MFE.
 *
 * Action creators (updateStatus, selectShipment) are imported from OUR OWN slice.
 * No dependency on container code for behavior logic.
 */

const STATUS_OPTIONS = ["pending", "in_transit", "delivered", "cancelled"];

const STATUS_COLORS = {
  pending: "#ffc107",
  in_transit: "#17a2b8",
  delivered: "#28a745",
  cancelled: "#dc3545",
};

export default function ShipmentsPage() {
  const dispatch = useDispatch();

  // Reads from state.shipments.items
  // Works whether the store is the container's global store or the local standalone store.
  const items = useSelector((state) => state.shipments.items);
  const selectedId = useSelector((state) => state.shipments.selectedId);

  const handleStatusChange = (id, status) => {
    // Dispatches to whichever store is in context — no explicit reference needed.
    // Action type produced: "shipments/updateStatus"
    dispatch(updateStatus({ id, status }));
  };

  const handleSelect = (id) => {
    // Updating selectedId in the shared store means the Tracker MFE also reacts,
    // because when loaded by the container, both read from the same store.
    dispatch(selectShipment(id));
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "sans-serif",
      }}
    >
      {/* Context badge — helps during development to know which mode you're in */}
      <div
        style={{
          background: "#e8f4fd",
          border: "1px solid #4a90e2",
          borderRadius: "6px",
          padding: "0.5rem 1rem",
          marginBottom: "1.5rem",
          fontSize: "0.82rem",
          color: "#1a5276",
        }}
      >
        <strong>Shipments MFE</strong> — this component is loaded from port 3001.
        State is shared with the container via the Redux singleton context.
        <br />
        Click any row to select a shipment, then go to <strong>Tracker</strong> to see cross-MFE state sync.
      </div>

      <h2 style={{ marginTop: 0 }}>Shipments List</h2>

      {items.length === 0 && (
        <p style={{ color: "#888" }}>
          No shipments yet. Add one from the{" "}
          <a href="/" style={{ color: "#e94560" }}>
            Home page
          </a>
          .
        </p>
      )}

      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => handleSelect(item.id)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem",
            marginBottom: "0.75rem",
            background: selectedId === item.id ? "#eef4ff" : "white",
            border:
              selectedId === item.id
                ? "2px solid #4a90e2"
                : "1px solid #e0e0e0",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            transition: "border 0.15s",
          }}
        >
          <div>
            <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
              {item.description}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#aaa" }}>
              {new Date(item.createdAt).toLocaleString()}
            </div>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            {/* Status badge (read-only visual) */}
            <span
              style={{
                padding: "0.2rem 0.65rem",
                borderRadius: "999px",
                fontSize: "0.78rem",
                fontWeight: "600",
                background: STATUS_COLORS[item.status] + "22",
                color: STATUS_COLORS[item.status],
                border: `1px solid ${STATUS_COLORS[item.status]}`,
                whiteSpace: "nowrap",
              }}
            >
              {item.status}
            </span>

            {/* Change status — dispatches directly to the store in context */}
            <select
              value={item.status}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => handleStatusChange(item.id, e.target.value)}
              style={{
                padding: "0.3rem 0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
