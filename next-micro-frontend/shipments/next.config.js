const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

/**
 * SHIPMENTS — Next.js Microfrontend Remote (port 3001)
 * ──────────────────────────────────────────────────────
 * This app EXPOSES ShipmentsPage to be consumed by the container at runtime.
 *
 * As a REMOTE, this app:
 *   - Has `exposes` (what it publishes)
 *   - Has NO `remotes` (it doesn't load from other MFEs)
 *   - Can run completely independently on port 3001
 *
 * The container fetches remoteEntry.js from this server at RUNTIME,
 * discovers the exposed modules, and dynamically loads ShipmentsPage
 * when the user navigates to /shipments.
 *
 * Team independence:
 *   The shipments team can deploy a new version of ShipmentsPage anytime.
 *   The container will automatically pick it up on the next browser load —
 *   no container rebuild or redeploy needed.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack(config, { isServer }) {
    if (!isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: "shipments", // Must match the key in container's `remotes` config

          // The manifest file — served at: http://localhost:3001/_next/static/chunks/remoteEntry.js
          filename: "static/chunks/remoteEntry.js",

          // ─── Exposes ────────────────────────────────────────────────────
          // The public API of the shipments MFE.
          // Container imports it as: import('shipments/ShipmentsPage')
          //                                     ↑name  ↑key without "./"
          exposes: {
            "./ShipmentsPage": "./src/components/ShipmentsPage.jsx",
          },

          // Same shared config as container — required for React Context consistency.
          // All MFEs must agree on these shared libraries for singleton to work.
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
