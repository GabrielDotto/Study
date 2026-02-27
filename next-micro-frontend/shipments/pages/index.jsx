import ShipmentsPage from "../src/components/ShipmentsPage";

/**
 * STANDALONE INDEX — Shipments MFE (port 3001)
 * ──────────────────────────────────────────────
 * This page exists purely so the shipments team can run and view their
 * MFE independently without the container.
 *
 * Notice: there is NO business logic here, NO duplicated forms.
 * The store (src/store/index.js) is pre-seeded with mock data, so
 * ShipmentsPage renders immediately with real-looking content.
 *
 * The add-shipment feature belongs to the CONTAINER's home page.
 * The shipments team's responsibility is: show and update shipments.
 * That's it. That's their domain boundary.
 *
 * Real teams often also use Storybook alongside this for fine-grained
 * component isolation without needing a full Next.js server.
 */
export default function StandaloneIndex() {
  return (
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh", background: "#f0f4f8" }}>
      <header
        style={{
          padding: "1rem 2rem",
          background: "#1a5276",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <strong>Shipments MFE</strong>
        <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
          standalone · port 3001 · mock data active
        </span>
      </header>

      {/* The exact same component the container loads via Module Federation */}
      <ShipmentsPage />
    </div>
  );
}
