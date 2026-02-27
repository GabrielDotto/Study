import { useState, useEffect } from "react";
import Header from "../src/components/Header";

/**
 * SHIPMENTS ROUTE — Container App
 * ────────────────────────────────
 * This page loads the ShipmentsPage component from the REMOTE app (port 3001).
 *
 * WHY `useEffect` instead of `next/dynamic`?
 * ────────────────────────────────────────────────────────────────────────────
 * Next.js 14 statically analyzes import() calls — even when wrapped inside
 * `next/dynamic` — and tries to resolve the module path at BUILD time.
 * Since `shipments/ShipmentsPage` is a Module Federation remote (not an npm
 * package), Next.js's static analysis fails with "Module not found".
 *
 * Putting the import() inside useEffect bypasses this:
 *   → Next.js does NOT trace dynamic imports inside useEffect/callback bodies
 *   → The import() call is evaluated at RUNTIME in the browser
 *   → Module Federation intercepts it and fetches from remoteEntry.js
 *   → Result: the remote component is loaded client-side without build errors
 *
 * This is an expected behavior when using Next.js Pages Router with Module
 * Federation — it is a known limitation of Next.js's static analysis.
 * The `next/dynamic` approach would work in some configurations, but the
 * useEffect pattern is more reliable and explicit about what's happening.
 */
export default function ShipmentsRoute() {
  const [ShipmentsPage, setShipmentsPage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This import() runs in the browser at component mount.
    // Module Federation intercepts "shipments/ShipmentsPage":
    //   1. Fetches http://localhost:3001/_next/static/chunks/remoteEntry.js
    //   2. Discovers the exposed "./ShipmentsPage" module
    //   3. Loads and returns the module (bundled in the shipments remote)
    import("shipments/ShipmentsPage")
      .then((module) => {
        setShipmentsPage(() => module.default);
      })
      .catch((err) => {
        setError(err.message);
        console.error("Failed to load Shipments MFE:", err);
      });
  }, []); // Empty deps: load once on mount

  return (
    <div
      style={{ fontFamily: "sans-serif", minHeight: "100vh", background: "#f0f4f8" }}
    >
      <Header />

      {/* Error state — usually means the shipments server (:3001) isn't running */}
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
          <strong>Failed to load Shipments MFE</strong>
          <br />
          Is the shipments app running on port 3001?
          <br />
          <code style={{ fontSize: "0.8rem" }}>{error}</code>
        </div>
      )}

      {/* Loading state */}
      {!ShipmentsPage && !error && (
        <p style={{ padding: "2rem", color: "#888" }}>
          Loading Shipments MFE from :3001...
        </p>
      )}

      {/* Loaded — render the remote component */}
      {ShipmentsPage && <ShipmentsPage />}
    </div>
  );
}
