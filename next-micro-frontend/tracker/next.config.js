const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

/**
 * TRACKER — Next.js Microfrontend Remote (port 3002)
 * ─────────────────────────────────────────────────────
 * Mirror of shipments/next.config.js — same pattern, different component exposed.
 *
 * The tracker team owns TrackerPage. They develop it standalone on :3002,
 * test it with pre-seeded mock data, and deploy when ready.
 * The container picks up the latest version automatically via remoteEntry.js.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack(config, { isServer }) {
    if (!isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: "tracker",
          filename: "static/chunks/remoteEntry.js",

          exposes: {
            "./TrackerPage": "./src/components/TrackerPage.jsx",
          },

          // The singleton shared config is the contract between ALL apps.
          // If one app breaks this contract (removes react from shared, for example),
          // you will get "multiple React instances" runtime errors.
          // In a real monorepo, this shared config would live in one place
          // and be imported into all next.config.js files to ensure consistency:
          //   const { sharedLibs } = require("../shared.federation.config.js")
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
