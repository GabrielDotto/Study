import { Provider } from "react-redux";
import { store } from "../src/store";

/**
 * STANDALONE APP WRAPPER — Shipments MFE
 * ────────────────────────────────────────
 * This _app.jsx is ONLY used when the shipments app runs independently
 * on port 3001 (e.g., during development: `npm run dev` from /shipments).
 *
 * When the shipments MFE is loaded by the container via Module Federation:
 *   → This file does NOT run.
 *   → The container's _app.jsx and its <Provider> are used instead.
 *   → The exported component (ShipmentsPage.jsx) is rendered directly
 *     inside the container's component tree.
 *
 * This is what allows the same component to work in both contexts:
 *   Standalone → this Provider (local store)
 *   Inside container → container's Provider (global store)
 */
export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
