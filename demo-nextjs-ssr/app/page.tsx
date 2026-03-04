/**
 * app/page.tsx — Home Page (route: "/")
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT IS THIS FILE?
 * ─────────────────────────────────────────────────────────────────────────────
 * In the App Router, `page.tsx` defines the UI for a route segment. This file
 * maps to the "/" route. If you created `app/about/page.tsx`, it would map to
 * "/about" — no manual routing configuration needed.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SERVER COMPONENT (the key concept here)
 * ─────────────────────────────────────────────────────────────────────────────
 * Because there's no "use client" at the top, this is a React Server Component.
 * Server Components:
 *   ✅ Run ONLY on the server (never shipped to the browser as JS)
 *   ✅ Can be async — you can await data fetching directly inside the component
 *   ✅ Have access to server-side resources (env vars, databases, file system)
 *   ❌ Cannot use browser APIs (window, document)
 *   ❌ Cannot use React hooks (useState, useEffect, useContext)
 *   ❌ Cannot have event handlers (onClick, onChange)
 *
 * COMPARISON TO OUR EXPRESS + EJS DEMO:
 *   Express demo: route handler fetches data → passes it to EJS template → HTML sent
 *   Next.js demo: async Server Component fetches data → React renders HTML → sent
 *   The end result is identical from the browser's perspective: full HTML on first load.
 *   Next.js just replaces the "route handler + template" model with a single async component.
 *
 * COMPARISON TO PAGES ROUTER (older Next.js style):
 *   In the Pages Router you'd use `getServerSideProps` — a separate exported function
 *   that runs server-side and returns props to the page component. This separation was
 *   necessary because page components were Client Components by default.
 *   The App Router eliminates that indirection: the component itself IS the server logic.
 */

/**
 * PokemonData — TypeScript type for the API response
 *
 * The PokeAPI returns a large object with dozens of fields. We only type the
 * fields we actually USE — this is intentional and a common TypeScript pattern
 * called "structural typing" or "typing to your needs".
 *
 * You do NOT need to type the entire API response. TypeScript only cares that
 * the shape you typed matches what's actually there. Extra fields are ignored.
 *
 * As you use more fields, add them here:
 *   id: number;
 *   height: number;
 *   weight: number;
 *   sprites: { front_default: string };
 */
type PokemonData = {
  name: string;
};

/**
 * fetchPikachu — Server-side data fetching
 *
 * This is a typed async function. The return type `Promise<PokemonData>` tells
 * TypeScript (and your editor) exactly what shape the resolved value will have.
 * This means `pokemon.name` below will be auto-completed and type-checked.
 *
 * It runs on the server at request time, just like a Node.js fetch call.
 *
 * THE CACHE OPTION:
 * Next.js extends the native `fetch` API with a `cache` option:
 *
 *   cache: "no-store"
 *     → Fetch fresh data on EVERY request (true SSR behavior).
 *     → Use this when data changes frequently (user-specific data, live prices, etc.)
 *     → Equivalent to Express SSR: the server always hits the API before responding.
 *
 *   cache: "force-cache" (default)
 *     → Cache the response indefinitely (like SSG — Static Site Generation).
 *     → The data is fetched once at build time and reused for all visitors.
 *     → Great for content that rarely changes (blog posts, documentation).
 *
 *   next: { revalidate: 60 }
 *     → ISR (Incremental Static Regeneration): cache for 60 seconds, then refresh.
 *     → Best of both worlds: fast static responses + periodic freshness.
 *
 * For this demo we use "no-store" to keep the SSR behavior clear and intentional.
 */
async function fetchPikachu(): Promise<PokemonData> {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/pikachu", {
    cache: "no-store",
  });

  // Always handle fetch errors. `fetch` only throws on network failure —
  // a 404 or 500 from the API still resolves without throwing.
  // Checking `response.ok` (status 200-299) is the correct pattern.
  if (!response.ok) {
    throw new Error(`PokeAPI responded with status ${response.status}`);
  }

  // We cast the JSON to PokemonData. TypeScript trusts us here — it can't
  // verify the API's response shape at compile time. If the API changes,
  // you'd get a runtime error, not a compile-time one.
  // For stricter validation, libraries like `zod` can parse and validate
  // the response shape at runtime.
  return response.json() as Promise<PokemonData>;
}

/**
 * HomePage — The page component
 *
 * Notice it's `async`. This is only possible in Server Components.
 * You cannot make a Client Component async in React — hooks and Suspense
 * handle async in that world instead.
 *
 * When Next.js renders this page for an incoming request:
 * 1. It calls HomePage() on the server
 * 2. The server awaits fetchPikachu() — the browser is waiting
 * 3. Once data arrives, React renders the JSX to an HTML string
 * 4. The full HTML is sent to the browser — the user sees content immediately
 *
 * No JavaScript needs to run in the browser to display this content.
 * (In a pure Server Component page like this, Next.js sends minimal or zero JS.)
 */
export default async function HomePage() {
  // This await happens on the SERVER, not in the browser.
  // The user's browser never sees this fetch — it only receives the final HTML.
  // TypeScript knows `pokemon` is of type `PokemonData`, so `pokemon.name` is safe.
  const pokemon = await fetchPikachu();

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Next.js SSR Demo</h1>

      {/*
       * `pokemon.name` is available here because we awaited the API call above.
       * If the fetch fails, Next.js will render the nearest error.tsx boundary instead
       * (you'd create app/error.tsx for that — not needed for this POC).
       */}
      <p>
        Hello from Next.js server-side rendering! You are seeing:{" "}
        <strong>{pokemon.name}</strong>
      </p>

      <hr />

      {/*
       * TEACHING NOTE — What makes this "SSR" and not "CSR"?
       *
       * If this were Client-Side Rendering (CSR), you'd see:
       *   - useEffect(() => { fetch(url).then(...) }, [])
       *   - A loading spinner while the browser fetches data
       *   - The page HTML would arrive empty, JS would hydrate it
       *
       * With SSR (what we have here):
       *   - The server fetches data before responding
       *   - The browser receives fully-rendered HTML
       *   - No loading state needed — content is there on first paint
       *   - Better for SEO (crawlers see the real content)
       *   - Better for slow networks (less round-trips)
       */}
      <small style={{ color: "gray" }}>
        This content was rendered on the server. No client-side fetch occurred.
      </small>
    </main>
  );
}
