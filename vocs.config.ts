import { defineConfig } from "vocs/config"

// Project site is served at peetzweg.github.io/ui, so assets need the "/ui"
// prefix in CI. Locally everything is served from the root.
const base = process.env.GITHUB_ACTIONS === "true" ? "/ui" : ""

export default defineConfig({
  title: "peetzweg/ui",
  description:
    "A shadcn-compatible registry of animated, motion-based UI primitives.",
  basePath: base || "/",
  // Vocs injects <link rel="icon"> from this raw href, so prefix the base.
  iconUrl: `${base}/favicon.svg`,
  // Emit a fully static site for GitHub Pages.
  renderStrategy: "full-static",
  topNav: [{ text: "GitHub", link: "https://github.com/peetzweg/ui" }],
  socials: [{ icon: "github", link: "https://github.com/peetzweg/ui" }],
  sidebar: [
    { text: "Overview", link: "/" },
    {
      text: "Primitives",
      items: [
        { text: "MorphSurface", link: "/morph-surface" },
        { text: "MultiStateButton", link: "/multi-state-button" },
        { text: "ScrollStrip", link: "/scroll-strip" },
        { text: "TactileButton", link: "/tactile-button" },
        { text: "TimeMachine", link: "/time-machine" },
      ],
    },
    {
      // Opinionated, domain-specific presets over the primitives above.
      text: "Presets",
      items: [{ text: "TransactionButton", link: "/transaction-button" }],
    },
  ],
})

// The registry's `@/…` imports resolve via a `@` -> repo-root Vite alias,
// injected into Vocs' (configFile:false) dev + build invocations through
// patches/vocs.patch. Vocs exposes no alias hook, and rolldown's native
// tsconfig-paths support only covers `build`, not the dev server.
