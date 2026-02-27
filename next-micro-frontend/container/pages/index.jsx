import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Header from "../src/components/Header";

// Action creators imported from the SHIPMENTS team's slice (monorepo path).
// Multi-repo: import { addShipment, selectShipment } from "@shiptrack/shipments-slice"
import { addShipment, selectShipment } from "../../shipments/src/store/shipmentsSlice";

/**
 * HOME PAGE — Container App
 * ──────────────────────────
 * The container's home page is the SHELL's own feature:
 *   - It owns the "add shipment" form (container's domain)
 *   - It shows a summary list with quick navigation
 *
 * It dispatches actions from the shipments slice because the container
 * imported and registered that slice in its global store.
 *
 * All state reads/writes here go through the same Redux store that the
 * remote components access when they're loaded on /shipments and /tracker.
 * Changes made here are immediately visible there — shared, reactive state.
 */
export default function Home() {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const items = useSelector((state) => state.shipments.items);

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    dispatch(addShipment(trimmed));
    setInput("");
  };

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        minHeight: "100vh",
        background: "#f0f4f8",
      }}
    >
      <Header />

      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem" }}>
        {/* Info banner */}
        <div
          style={{
            background: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "6px",
            padding: "0.75rem 1rem",
            marginBottom: "2rem",
            fontSize: "0.875rem",
            lineHeight: "1.6",
          }}
        >
          <strong>Container App — port 3000</strong>
          <br />
          Add shipments here, then navigate to{" "}
          <Link href="/shipments" style={{ color: "#856404" }}>
            Shipments
          </Link>{" "}
          or{" "}
          <Link href="/tracker" style={{ color: "#856404" }}>
            Tracker
          </Link>{" "}
          to see the same Redux state reflected in independently deployed MFEs.
        </div>

        {/* Add shipment form */}
        <section
          style={{
            background: "white",
            borderRadius: "8px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>New Shipment</h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="e.g. Laptop — São Paulo to Porto Alegre"
              style={{
                flex: 1,
                padding: "0.6rem 0.8rem",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <button
              onClick={handleAdd}
              style={{
                padding: "0.6rem 1.2rem",
                background: "#e94560",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Add
            </button>
          </div>
        </section>

        {/* Shipments summary */}
        <section
          style={{
            background: "white",
            borderRadius: "8px",
            padding: "1.5rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>
            Shipments ({items.length})
          </h2>

          {items.length === 0 && (
            <p style={{ color: "#999", margin: 0 }}>
              No shipments yet. Add one above.
            </p>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div>
                <div style={{ fontWeight: "500" }}>{item.description}</div>
                <div style={{ fontSize: "0.78rem", color: "#aaa" }}>
                  {item.status}
                </div>
              </div>

              {/* Track button: sets selectedId then navigates to tracker MFE */}
              <Link
                href="/tracker"
                onClick={() => dispatch(selectShipment(item.id))}
                style={{
                  padding: "0.35rem 0.8rem",
                  background: "#1a1a2e",
                  color: "white",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                }}
              >
                Track →
              </Link>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
