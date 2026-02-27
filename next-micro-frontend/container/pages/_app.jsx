import { Provider } from "react-redux";
import { store } from "../src/store";

/**
 * NEXT.JS CUSTOM APP — Container
 * ────────────────────────────────
 * _app.jsx wraps EVERY page in the container with the Redux Provider.
 *
 * This single <Provider store={store}> is what makes cross-MFE state sharing work:
 *   - All container pages (Home, /shipments, /tracker) have access to the store
 *   - Remote components loaded on those pages inherit this Provider via React Context
 *   - Because react-redux is a singleton across all MFEs, they all read from
 *     the same store context object — zero prop drilling, zero coupling
 *
 * The store itself (../src/store/index.js) imports reducers from each remote team,
 * composing the global state tree at build time.
 */
export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
