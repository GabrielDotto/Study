import { useState, useEffect } from "react";
import Header from "../src/components/Header";

/**
 * TRACKER ROUTE — Container App
 * ──────────────────────────────
 * Same pattern as shipments.jsx — loads the TrackerPage remote component
 * via Module Federation using useEffect to bypass Next.js static analysis.
 *
 * The TrackerPage component reads `state.shipments.selectedId` from the
 * shared Redux store. When the user selects a shipment on the Shipments page
 * and then navigates here, selectedId is already set in the store → tracker
 * immediately shows the right shipment.
 *
 * This is the payoff of the shared store architecture:
 * two independently deployed MFEs communicating seamlessly through Redux.
 */
export default function TrackerRoute() {
  const [TrackerPage, setTrackerPage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    import("tracker/TrackerPage")
      .then((module) => {
        setTrackerPage(() => module.default);
      })
      .catch((err) => {
        setError(err.message);
        console.error("Failed to load Tracker MFE:", err);
      });
  }, []);

  return (
    <div
      style={{ fontFamily: "sans-serif", minHeight: "100vh", background: "#f0f4f8" }}
    >
      <Header />

      {error && (
        <div
          style={{
            maxWidth: "700px",
            margin: "2rem auto",
            padding: "1rem",
            background: "#f8d7da",
            border: "1px solid #f5c6cb",
            borderRadius: "6px",
            color: "#721c24",
          }}
        >
          <strong>Failed to load Tracker MFE</strong>
          <br />
          Is the tracker app running on port 3002?
          <br />
          <code style={{ fontSize: "0.8rem" }}>{error}</code>
        </div>
      )}

      {!TrackerPage && !error && (
        <p style={{ padding: "2rem", color: "#888" }}>
          Loading Tracker MFE from :3002...
        </p>
      )}

      {TrackerPage && <TrackerPage />}
    </div>
  );
}
