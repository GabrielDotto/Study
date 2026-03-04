# Frontend Architecture Study

A collection of small projects exploring different frontend architecture patterns.

---

## Projects

### `component-based-pattern`
Vanilla JS demo showing how to structure a UI using reusable, isolated components. No frameworks — just plain JS modules.

### `state-management-pattern`
Vite + Vanilla JS SPA demonstrating centralized state management patterns without a library.

### `microfrontend-vanillajs`
Webpack Module Federation with plain JS. Three independent apps (Container, Shipments, Tracker) that compose at runtime on separate ports.

### `next-micro-frontend`
Next.js 14 (Pages Router) micro-frontend using `@module-federation/nextjs-mf` and Redux Toolkit. Same three-app structure, production-closer setup.

### `serverless-architecture-demo`
Vite + Vanilla JS frontend backed by Firebase Firestore. Demonstrates the serverless pattern: no custom backend — the frontend reads data directly from a managed cloud database (Firestore Lite), with Firebase handling auth, infra, and scaling.

### `demo-vanillajs-pwa`
Vanilla JS Progressive Web App demo. Covers service workers, caching strategies, and the web app manifest to make a site installable and work offline.

### `demo-server-side-rendering`
Express + EJS demo showing server-side rendering. The server fetches data (PokéAPI) and renders the full HTML page before sending it to the client — no client-side JS required to display content.
