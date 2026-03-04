/**
 * next.config.js — Next.js configuration file
 *
 * This file is loaded by Next.js at build time and runtime. You don't import it
 * manually anywhere — Next.js detects it automatically at the project root.
 *
 * For a small POC like this, the config is minimal. In a real project you might
 * configure things like:
 *   - images: { domains: [...] }   → allowlist external image sources
 *   - redirects / rewrites         → URL manipulation without changing the route file
 *   - env variables                → expose server-only or public env vars
 *   - experimental flags           → opt into Next.js beta features
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Nothing needed for this demo.
  // Next.js App Router is enabled by default in v13+, no flag required.
};

module.exports = nextConfig;
