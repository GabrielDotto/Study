const { NextFederationPlugin } = require("@module-federation/nextjs-mf");
const { IgnorePlugin } = require("webpack");

/**
 * CONTAINER — next.config.js
 * ────────────────────────────
 * Next.js builds TWO webpack bundles per page:
 *   - Server bundle (Node.js): runs during SSR / static generation
 *   - Client bundle (browser): runs in the user's browser
 *
 * Module Federation lives in the BROWSER only — remotes are fetched at runtime
 * from live servers. The server bundle has no concept of remote loading.
 *
 * Problem: webpack processes ALL code in every file, including dynamic
 * import() calls that are inside useEffect (which never runs on the server).
 * So import("shipments/ShipmentsPage") appears in BOTH bundles, and the
 * SERVER bundle fails because it can't resolve "shipments" — that's a
 * Module Federation name, not an npm package.
 *
 * Solution (two-part):
 * ─────────────────────
 * SERVER bundle  → IgnorePlugin: silently ignores remote imports.
 *                  The import() returns undefined at runtime, which is fine
 *                  because useEffect never runs on the server anyway.
 *
 * CLIENT bundle  → NextFederationPlugin: intercepts remote imports and
 *                  resolves them at runtime by fetching remoteEntry.js.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack(config, { isServer }) {
    if (isServer) {
      // SERVER BUILD: tell webpack to silently skip imports from federated remotes.
      // resourceRegExp matches the module specifier string used in import().
      // This covers: import("shipments/X"), import("tracker/Y"), etc.
      config.plugins.push(
        new IgnorePlugin({
          resourceRegExp: /^(shipments|tracker)\//,
        })
      );
    } else {
      // CLIENT BUILD: register Module Federation remotes.
      // These imports are resolved at runtime by fetching remoteEntry.js from
      // each remote server. The browser downloads and executes the remote bundle.
      config.plugins.push(
        new NextFederationPlugin({
          name: "container",
          filename: "static/chunks/remoteEntry.js",

          // Remotes: resolved at RUNTIME in the browser.
          // Format: "<MF name>@<remoteEntry URL>"
          // The name must match `name` in the remote's NextFederationPlugin.
          remotes: {
            shipments: `shipments@http://localhost:3001/_next/static/chunks/remoteEntry.js`,
            tracker: `tracker@http://localhost:3002/_next/static/chunks/remoteEntry.js`,
          },

          // Shared singletons: ensures ONE copy of each library across ALL MFEs.
          // Critical for React hooks and react-redux's React Context to work correctly.
          shared: {
            react: { singleton: true, eager: true, requiredVersion: false },
            "react-dom": { singleton: true, eager: true, requiredVersion: false },
            "react-redux": { singleton: true, eager: true, requiredVersion: false },
            "@reduxjs/toolkit": { singleton: true, eager: true, requiredVersion: false },
          },
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
