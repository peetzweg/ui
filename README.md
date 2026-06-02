# peet/ui

A small shadcn-compatible component registry for reusable animated UI
primitives.

Live showcase: **https://peetzweg.github.io/ui**

## Components

| Name                 | Showcase                                                       | What                                                                                                                                                          |
| -------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `multi-state-button` | [demo](https://peetzweg.github.io/ui/#multi-state-button)      | Generic multi-state animated button with a slot-machine label transition. Generic state union; you own every state's content, styling, and click behaviour.  |
| `transaction-button` | [demo](https://peetzweg.github.io/ui/#transaction-button)      | Transaction-submission preset over `MultiStateButton`. Seven-state lifecycle (idle / ready / signing / broadcasting / bestBlock / finalized / failed).        |

## Install

This is a [GitHub registry](https://ui.shadcn.com/docs/registry/github) — the
shadcn CLI reads `registry.json` and the component source straight from this
repo. No registry server, no hosted JSON.

From any shadcn-compatible project:

```bash
pnpm dlx shadcn@latest add peetzweg/ui/multi-state-button
pnpm dlx shadcn@latest add peetzweg/ui/transaction-button
```

Pin to a tag, branch, or commit for reproducibility:

```bash
pnpm dlx shadcn@latest add peetzweg/ui/transaction-button#v1.0.0
```

`transaction-button` declares `multi-state-button` as a `registryDependency`,
so adding it pulls both. Both also depend on shadcn's upstream `button` and the
npm packages `motion` and `lucide-react`.

Inspect before installing:

```bash
pnpm dlx shadcn@latest view peetzweg/ui/transaction-button
pnpm dlx shadcn@latest add  peetzweg/ui/transaction-button --dry-run
```

## Local development

The showcase site is a plain Vite + React app deployed to GitHub Pages.

```bash
pnpm install
pnpm dev       # http://localhost:5173 — live component previews
pnpm build     # type-check + static build into dist/
pnpm preview   # serve the production build locally
```

## Repo layout

```
registry.json                           # registry manifest — the source of truth the CLI reads
registry/new-york/
  ui/multi-state-button.tsx             # distributed component
  ui/transaction-button.tsx             # distributed component
  ui/{button,card,input,label,...}.tsx  # shadcn primitives used locally by the demos
  examples/                             # demos shown in the showcase; not distributed
src/                                    # the Vite showcase app (App.tsx, showcase.tsx)
.github/workflows/pages.yml             # builds src/ and deploys dist/ to GitHub Pages
```

### Adding a component

1. Add the component under `registry/new-york/ui/` and an example under
   `registry/new-york/examples/`.
2. Register it in `registry.json`.
3. Add an entry to `components` in `src/showcase.tsx` (this drives the showcase
   and gives it a `#anchor` to link from this README).
