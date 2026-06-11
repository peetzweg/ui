# Working in this repo (agent guide)

A shadcn-compatible **GitHub registry** of animated UI primitives. The shadcn
CLI reads `registry.json` + component source straight from the repo (no server).
A [Vocs](https://vocs.dev) docs site under `src/pages/` showcases each component
and deploys to GitHub Pages.

This file distills the conventions and the hard-won lessons for porting
prototypes into installable components, animating them well, and structuring
their docs pages. Read it before adding or changing a component.

## Layout

```
prototypes/                       source interaction demos + _extracted/<name>/ + README inventory
registry/new-york/ui/<name>.tsx   the component (the installable unit)
registry/new-york/hooks|lib/      shared helpers, published as registry:hook / registry:lib
registry/new-york/examples/       importable demos (used by docs + installable)
src/pages/<name>.mdx              the component's docs page
src/pages/_components/            site-only composite demos (not installable)
registry.json                     registry manifest — every shipped item has an entry
vocs.config.ts                    docs sidebar (Primitives vs Presets)
```

## Adding / porting a component — the pipeline

Do all of these, then
`pnpm typecheck && pnpm lint && pnpm registry:validate && pnpm build` before
committing (CI runs the same checks on every push/PR):

1. `registry/new-york/ui/<name>.tsx` — the component.
2. Extract reusable helpers to `registry/new-york/hooks/` or `lib/` as their own
   registry items; reference them via `registryDependencies` (don't inline-copy).
3. One or more demos in `registry/new-york/examples/<name>-*-demo.tsx`.
4. A `registry.json` entry (`type`, `title`, `description`, `dependencies`,
   `registryDependencies`, `files`).
5. `src/pages/<name>.mdx` docs page (structure below).
6. Add to the `vocs.config.ts` sidebar and the `src/pages/index.mdx` overview.

### Decoupling prototypes (`prototypes/README.md` has the full inventory)

- **Next-isms out:** drop `next/image` (→ plain `<img>` or a render slot),
  `next/font`, `next-themes` (→ the `.dark` CSS variant), static asset imports.
- **Assets become props.** Bundled images/icons become `items` / `images` /
  `ReactNode[]`. Demo assets live in the showcase, never in the component.
- **`system.css` tokens → shadcn tokens.** Map `bg-orange`/`gray*`/`shadow-menu`
  to `bg-primary` / `bg-popover` / `bg-muted` / `text-muted-foreground` /
  `shadow-lg` / `ring-border`, etc.

## Component conventions

- `"use client"`; default `cn` from `@/lib/utils`; `motion` from `motion/react`.
- **Headless.** The component owns *mechanics only* — geometry, motion, state,
  keyboard/scroll wiring. The consumer owns appearance and content. Accept
  content as `ReactNode | ((state) => ReactNode)` render functions so content can
  react to live state.
- **Controlled + uncontrolled.** Support both: `value` + `onValueChange`, with
  `defaultValue` for uncontrolled. `const isControlled = valueProp !== undefined`.
- **Refs:** `forwardRef` + a `setRefs` callback that writes an internal ref and
  forwards. Keep a live `valueRef` mirror so handlers bound once (window/wheel
  listeners) read the latest state.
- **Self-contained / portable.** Installed components can't see this site's CSS,
  so don't depend on site-only tokens (e.g. the docs `--ease-*`). Bake easing
  curves inline. Depend only on `motion` (+ `lucide-react` where icons are used)
  and declared `registryDependencies`.
- **Prop spreading + motion gotcha:** spreading `...props` (HTMLAttributes) onto
  a `motion.*` element type-clashes on drag handlers (`onDrag`, …). Spread the
  rest on a plain wrapper element; keep `className`/`style` on the part the user
  expects to style, and document which element that is.

## Animation conventions (what "nicely animated" means here)

- **Springs** (motion) for morphs, drags, interruptible/reversible motion.
  **CSS transitions** for simple state/color changes (interruptible, off main
  thread). Avoid keyframes for rapidly-retriggered UI.
- **Performance:** animate `transform`/`opacity` only. In motion under load
  (scroll, image decode), animate the **full `transform` string**
  (`transform: "translateY(..) scale(..)"`), *not* the `x`/`y`/`scale`
  shorthands — those run on the main thread and drop frames.
- **Easing:** custom, strong curves — never `ease-in` for UI, never
  `transition-all` (name the properties). UI animations stay **< 300ms**.
  Add `active:scale-[0.97]` press feedback to anything pressable.
- **Shared-element transitions:** give an element the same motion `layoutId` on
  both sides and it travels between states. Only **one copy** may be mounted at a
  time (render `null` / a placeholder on the other side) or motion jumps.
- **Multiple instances must coexist.** Window-level key handlers and wheel
  scrubbers have to be scoped — gate keys on `:hover`/focus-within of the
  component's container; scope wheel to the element. Otherwise every mounted
  instance responds to one keypress. Prefer correct-by-default over a prop.
- **Concentric radii:** an inset child's radius = parent radius − the gap
  (e.g. card `r=14`, padding `4` → inner `rounded-lg`/`10`).
- **No layout shift:** when a surface morphs size, reserve its largest footprint
  so siblings don't jump.
- Respect `prefers-reduced-motion` (`useReducedMotion`) — drop movement, keep
  opacity. Use `blur` to mask imperfect crossfades; `clip-path: inset()` for
  reveals without layout thrash.

## Docs page structure (keep this order on every page)

```
# Title
intro — what it is, the core mechanic, and what "you own" vs the component
<Preview> hero </Preview>      ← most representative example, right after intro
                                 (heading-less, with a short lead-in line)
## Installation                shadcn add command + registryDependencies note
## Usage                       minimal code snippet
## <variant / feature>         short prose → <Preview> → optional code snippet
…more variants…
## Props                       table, last
```

- Wrap live demos in the `Preview` component (`src/pages/_components/Preview`).
- Group examples by theme; lead with the most representative, not the simplest.
- Use **different content per example** (e.g. distinct image sets / colors) so
  neighbouring demos can't be mistaken for one another.
- **Primitives vs Presets:** generic mechanics are Primitives; opinionated
  domain layers over a primitive are Presets (e.g. `TransactionButton` over
  `MultiStateButton`). Reflect this split in the sidebar and overview.

## Lessons learned the hard way

- **Change one thing at a time and verify in the browser.** A blind, all-at-once
  structural rewrite (swapping a component's whole layout + motion model at once)
  broke things and had to be reverted. Small, verifiable steps win.
- **The agent can't see the browser.** After any visual/animation change, tell
  the user exactly which demos to eyeball, and flag judgement calls for them.
- **Use known-good assets.** Don't introduce new external image IDs you can't
  verify (no network in the sandbox) — reuse the IDs already live in the repo.
- A fixed-pixel, explicit API can beat a clever "automatic" one if the clever
  version is fragile. Prefer predictable.

## Decision log

Only decisions that can't be re-derived from the code. Per-component
rationale lives in the component's docblock (it ships with the install) and
its docs page — not here. Keep this list short; cut entries that stop
mattering.

- **GitHub registry, no server** — the shadcn CLI reads `registry.json` +
  source straight from the repo; installs pin with `#tag` / `#commit`. A
  Next.js registry app was dropped for this.
- **The `@` alias is patched into Vocs** (`patches/vocs.patch`) — Vocs has no
  alias hook; details in the `vocs.config.ts` footer comment. Re-check the
  patch when bumping Vocs.
- **Theme tokens:** primitives style with shadcn theme tokens only, so any
  theme fits. Presets may use literal palette colors when the look *is* the
  domain (TransactionButton's state colors, TimerSurface's orange-on-black).
- **Haptics** come from the `use-haptic` registry hook (the web-haptics
  switch-checkbox trick — see its docblock), never an npm dep. Components
  fire it only on user-input commits, never on controlled/external updates.
- **Naming:** primitives are mechanic noun pairs (ScrollStrip, TickTape);
  presets are domain + base surface (TransactionButton, TimerSurface).

## Commands

```bash
pnpm dev         # docs site (Vocs)
pnpm build       # static build — run before committing
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint
pnpm registry:validate  # lint registry.json (schema, names, file paths)
```
