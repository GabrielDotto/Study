import TrackerPage from "../src/components/TrackerPage";

/**
 * STANDALONE INDEX — Tracker MFE (port 3002)
 * ────────────────────────────────────────────
 * Thin shell for standalone development.
 * Store is pre-seeded in src/store/index.js — no logic duplication here.
 */
export default function StandaloneIndex() {
  return (
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh", background: "#f0f4f8" }}>
      <header
        style={{
          padding: "1rem 2rem",
          background: "#155724",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <strong>Tracker MFE</strong>
        <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
          standalone · port 3002 · mock data active
        </span>
      </header>

      <TrackerPage />
    </div>
  );
}
