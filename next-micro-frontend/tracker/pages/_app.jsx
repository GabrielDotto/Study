import { Provider } from "react-redux";
import { store } from "../src/store";

/**
 * STANDALONE APP WRAPPER — Tracker MFE
 * ──────────────────────────────────────
 * Same role as shipments/_app.jsx:
 * - Active when running standalone on port 3002
 * - NOT active when loaded by the container (container's _app.jsx takes over)
 */
export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
