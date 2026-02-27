import Link from "next/link";
import { useSelector } from "react-redux";

/**
 * HEADER COMPONENT — Container App
 * ──────────────────────────────────
 * This component lives entirely in the container.
 * It's part of the "shell UI" — the layout that wraps every page.
 *
 * Notice it uses useSelector to read from Redux — this works because
 * it's rendered inside the <Provider> in _app.jsx.
 *
 * In a real MFE setup, you might expose the Header from the container
 * so other teams can render it in their standalone dev mode too.
 */
export default function Header() {
  // Reading state from Redux to show a live shipment count in the nav
  const count = useSelector((state) => state.shipments.items.length);

  return (
    <header
      style={{
        padding: "1rem 2rem",
        background: "#1a1a2e",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "2rem",
        marginBottom: "0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <strong style={{ fontSize: "1.2rem", color: "#e94560" }}>
        ShipTrack MFE
      </strong>

      <nav style={{ display: "flex", gap: "1.5rem" }}>
        <Link href="/" style={{ color: "#ccc", textDecoration: "none" }}>
          Home
        </Link>
        <Link
          href="/shipments"
          style={{ color: "#ccc", textDecoration: "none" }}
        >
          Shipments {count > 0 && `(${count})`}
        </Link>
        <Link href="/tracker" style={{ color: "#ccc", textDecoration: "none" }}>
          Tracker
        </Link>
      </nav>

      <span
        style={{
          marginLeft: "auto",
          fontSize: "0.75rem",
          color: "#555",
          fontFamily: "monospace",
        }}
      >
        container :3000
      </span>
    </header>
  );
}
