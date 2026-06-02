import { defineConfig } from "vocs/config"

export default defineConfig({
  title: "peet/ui",
  description:
    "A shadcn-compatible registry of animated, motion-based UI primitives.",
  // Project site lives at peetzweg.github.io/ui; root locally.
  basePath: process.env.GITHUB_ACTIONS === "true" ? "/ui" : "/",
  // Emit a fully static site for GitHub Pages.
  renderStrategy: "full-static",
  topNav: [{ text: "GitHub", link: "https://github.com/peetzweg/ui" }],
  socials: [{ icon: "github", link: "https://github.com/peetzweg/ui" }],
  sidebar: [
    { text: "Overview", link: "/" },
    {
      text: "Components",
      items: [
        { text: "MultiStateButton", link: "/multi-state-button" },
        { text: "TransactionButton", link: "/transaction-button" },
        { text: "TimeMachine", link: "/time-machine" },
      ],
    },
  ],
})

// The registry's `@/…` imports resolve via a `@` -> repo-root Vite alias,
// injected into Vocs' (configFile:false) dev + build invocations through
// patches/vocs.patch. Vocs exposes no alias hook, and rolldown's native
// tsconfig-paths support only covers `build`, not the dev server.
