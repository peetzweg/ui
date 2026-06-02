import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// Deployed to GitHub Pages as a project site (peetzweg.github.io/ui), so assets
// need the "/ui/" base in CI. Local dev serves from the root.
// If you point a custom domain at this repo, drop the CI branch.
const base = process.env.GITHUB_ACTIONS === "true" ? "/ui/" : "/"

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
})
