# peet/ui

A small shadcn-compatible component registry for reusable animated UI
primitives.

## Components

| Name                  | What                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------- |
| `multi-state-button`  | Generic multi-state animated button with a slot-machine label transition. Generic state union; you own every state's content, styling, and click behaviour. |
| `transaction-button`  | Transaction-submission preset over `MultiStateButton`. Seven-state lifecycle (idle / ready / signing / broadcasting / bestBlock / finalized / failed) with sensible defaults. |

## Install

From any shadcn-compatible project:

```bash
pnpm dlx shadcn@latest add https://<host>/r/multi-state-button.json
pnpm dlx shadcn@latest add https://<host>/r/transaction-button.json
```

`transaction-button` declares `multi-state-button` as a `registryDependency`, so adding it pulls both. Both also depend on shadcn's upstream `button` and the npm packages `motion` and `lucide-react`.

## Local development

```bash
pnpm install
pnpm dev              # http://localhost:3000 — shows live previews
pnpm registry:build   # regenerate public/r/*.json from registry.json
```

The `registry.json` at the repo root defines what gets published. `shadcn build` reads it and emits one JSON file per item under `public/r/`, embedding the component source.

## Repo layout

```
registry.json                           # umbrella manifest
registry/new-york/
  ui/multi-state-button.tsx             # source of truth — published
  ui/transaction-button.tsx             # source of truth — published
  ui/{button,card,input,label,...}.tsx  # shadcn primitives used locally
  examples/                             # demos shown on the home page; not published
public/r/                               # generated registry items (committed)
app/                                    # the Next.js docs/preview site
```
