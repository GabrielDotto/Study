/**
 * app/layout.tsx — Root Layout
 *
 * FILE EXTENSION: .tsx vs .ts
 * Use .tsx when the file contains JSX (HTML-like syntax inside TypeScript).
 * Use .ts  for pure TypeScript files with no JSX (utilities, types, API calls).
 * TypeScript enforces this — a .ts file containing JSX will throw a compiler error.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY DOES THIS FILE EXIST?
 * ─────────────────────────────────────────────────────────────────────────────
 * In the App Router, every route segment can have its own layout.tsx. This one
 * lives at the root of `app/`, so it wraps EVERY page in the project.
 *
 * The root layout MUST define the <html> and <body> tags — Next.js will throw
 * an error if you omit them here, because no other file is allowed to render them.
 *
 * THIS IS A SERVER COMPONENT.
 * By default, all files inside `app/` are React Server Components (RSC).
 * That means this runs on the server — there's no "use client" directive, so no
 * client-side JavaScript is generated for this file.
 *
 * If you needed interactivity (useState, useEffect, event handlers), you'd add
 * "use client" at the top of the file. For a layout, you almost never need that.
 */

import { ReactNode } from "react";

/**
 * metadata — Static SEO configuration
 *
 * Exporting a `metadata` object from a layout or page is the App Router way of
 * setting <title> and <meta> tags. Next.js merges metadata from layouts and pages
 * automatically — a page's metadata wins over the layout's when both define the
 * same field.
 *
 * In a real project you'd import and use the `Metadata` type from "next" for
 * full autocomplete and type safety over all supported fields (openGraph, twitter,
 * robots, etc.):
 *
 *   import type { Metadata } from "next";
 *   export const metadata: Metadata = { ... };
 */
export const metadata = {
  title: "Next.js SSR Demo",
  description: "Server-side rendering example using Next.js App Router",
};

/**
 * Props type for RootLayout
 *
 * In TypeScript, we always type component props explicitly.
 * `ReactNode` is the correct type for `children` — it covers:
 *   - JSX elements
 *   - strings and numbers
 *   - arrays of elements
 *   - null / undefined / booleans (React ignores these)
 *   - React fragments
 *
 * Avoid `JSX.Element` for children — it's too narrow and won't accept null or
 * plain strings, which are valid React children.
 */
type RootLayoutProps = {
  children: ReactNode;
};

/**
 * RootLayout component
 *
 * `children` here is whatever page (or nested layout) Next.js decides to render
 * for the current URL. You don't pass it manually — Next.js injects it at runtime.
 *
 * Think of it like a shell: the layout stays mounted between navigations (no
 * re-render), while `children` swaps out as the user navigates between pages.
 * This is great for things like navbars, sidebars, or global context providers.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      {/*
       * The <body> is where your page content lives.
       * You can add global styles, fonts, or wrappers here.
       * In a real project, you'd likely import a CSS file or use next/font here.
       */}
      <body>{children}</body>
    </html>
  );
}
