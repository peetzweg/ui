# UI Interaction Prototypes

Source prototypes we're **remixing** into reusable, shadcn-installable
components in this registry. Each `*.zip` is a self-contained interaction
demo; we rebuild them from scratch as generic, framework-agnostic components.

> The zips are unpacked under `_extracted/<name>/` (gitignored working copy).
> Re-run with `unzip <name>.zip -d _extracted/<name>`.

## Anatomy of a prototype

Every prototype follows the same shape:

```
<name>/
  source.tsx              # the component (default export) — the thing to port
  *.module.css|scss       # scoped styles (some prototypes)
  system.css              # SHARED design-token sheet (identical across all)
  *.ts                    # helpers (clamp, use-shortcuts, use-click-outside, …)
  fonts/                  # bundled display font + JetBrains Mono woff2 (proprietary — don't ship)
  *.jpg|png               # bundled demo assets, imported statically
  README.md               # identical boilerplate install note (no real info)
```

### `system.css` — the shared foundation

All prototypes import the same `system.css`. It is **not** a component — it's a
Tailwind v4 `@theme` block defining:

- **Radix color scales** (`--color-gray1..12`, `blue`, `red`, `amber`, `green`,
  `pink`, plus alpha + P3 variants) and brand colors (`--color-orange #ff4d00`).
- A **type scale** (`--text-10..64`), weights, line-heights, radii, and a large
  **shadow system** (`--shadow-border-small/medium/large`, `tooltip`, `menu`,
  `modal`).
- **Motion easings** (`--ease-swift`, `--ease-overlay`, a sampled `--timing-bounce`
  spring curve) and keyframes (`blink`, `fade-in`).
- Utility classes used by the components: `grid-stack`, `translate-center`,
  `flex-center`, `gesture-grabbing`, `gesture-resizing`, `bleed`.

**This is the #1 decoupling task.** Ported components reference tokens like
`border-gray2`, `bg-orange`, `--color-gray-a8`. To be installable they must
either (a) be rewritten onto shadcn's theme tokens (`--border`, `--muted`,
`--primary`, `--ring`, …), or (b) we publish a small **`dd-theme`** registry item
(a `registry:theme`/CSS file) that consumers add once. Recommendation: map to
shadcn tokens where a 1:1 exists; ship a tiny theme item only for the orange
accent + the handful of utility classes (`grid-stack`, `translate-center`).

## The recurring Next.js coupling (and how to decouple)

These show up across the set. The fix pattern is the same each time:

| Next-ism | Found in | Plain-React / shadcn replacement |
| --- | --- | --- |
| `"use client"` | most | **Keep it** — shadcn ships it; harmless under Vite. |
| `next/image` | copy-paste, dock, radial-timeline, scroll-strip, time-machine | Plain `<img>`, or an `imageComponent`/`render` slot prop. Drop `placeholder="blur"` (or accept `blurDataURL`). |
| static asset imports (`./1.jpg`) | time-machine, dock, scroll-strip, copy-paste, … | Turn into **props**: `items` / `images: string[]` (or `ReactNode[]`). Demo assets move to the showcase, not the component. |
| `next/font` + `@font-face` (display font) | all (`system.css`) | Don't ship the proprietary font; inherit the consumer's `--font-sans`. |
| `next-themes` `useTheme` | gesture-hints | Use the shadcn `.dark` CSS variant — no JS theme hook needed. |
| `use-sound` + `/sounds/*` | line-graph | Optional `sound?` prop; lazy-load, no bundled audio. |
| locale lock (`timeZone: "Europe/Tallinn"`) | line-graph | Prop / default to `undefined` (user locale). |
| `system.css` tokens | all | See "shared foundation" above. |

Shared helpers (`clamp`, `use-shortcuts`/`tinykeys`, `use-click-outside`,
`merge-refs`, `use-media-query`, `use-scroll-end`) should be published as small
`registry:lib` / `registry:hook` items and referenced via `registryDependencies`,
so multiple components reuse them.

## Inventory

Reusability = effort to turn into a generic, installable shadcn component.

### Easy — mostly self-contained, little/no Next coupling

| Prototype | What it is | Notable |
| --- | --- | --- |
| **blur-reveal** | Content reveal: clip-path + blur clear in one coordinated motion. | Already generic; takes `children`, `duration`, `blur`. |
| **fallback-avatar** | Deterministic colorful SVG avatar from a hashed name. | Pairs with shadcn `avatar`. Props: `size`, `colors`, `fallbackDelay`. |
| **grid-lines** | Decorative dashed corner/grid lines via CSS gradients. | Pure CSS. Props: `direction`, `color`, `size`. |
| **nextjs-dev-tools** | Animated count/issue badge that expands on state change. | Zero Next coupling despite the name. Generic notification badge: `count`, `icon`, `color`, `size`. |
| **responsive-gestures** | Drag box with momentum projection + snap-to-target. | Better shipped as a `useSnapGesture` hook + demo. |

### Medium — solid pattern, needs props extraction + token remap

| Prototype | What it is | Notable |
| --- | --- | --- |
| **checkbox** | Animated checkbox: spring strikethrough + label slide. | High utility. Extract spring/interval to props. |
| **gesture-hints** | Drag/press hint indicators (pulsing arrows/ripples). | Drop `next-themes`. Props: `direction`, `size`, `color`, timing. |
| **logos-carousel** | Staggered cross-fade through sets of logos. | Make `logos: ReactNode[][]`; CSS-keyframe based. |
| **morphing** | Width-morphing label that cycles text char-by-char. | Make `items: string[]`; remove hardcoded user/email. |
| **morph-surface** | Button that morphs into a feedback form (shared-layout). | Add `onSubmit`; expose dimensions + spring. |
| **scroll-strip** | Horizontal filmstrip; selected frame expands. | `images` prop; extract scroll→translate hook; needs scrollend polyfill. |

### Hard — heavy interaction math or domain-specific

| Prototype | What it is | Notable |
| --- | --- | --- |
| **time-machine** | Scroll/keyboard-driven stacked-image gallery (3D recede). | **Priority pick** — see below. Mutates `document.body` height; hardcoded frame size; `next/image`. |
| **copy-paste** | ⌘C grabs an element → shrinks → follows cursor → ⌘V pastes back. | Deeply tied to `next/image` + one bundled image. |
| **interpolation** | Velocity-dismissed bottom sheet; blur/opacity track drag. | Genuinely useful (vaul-like) but math-heavy. Decouple from the device mock. |
| **radial-timeline** | Rotating radial timeline; scroll-zoom into a detail sheet. | `@use-gesture/react`; deeply data-shaped. |
| **line-graph** | 365-day activity graph w/ morphing cursor + audio. | Strava-schema specific; bundled sounds; locale lock. |

## Recommended starting set

A tier-1 batch that maximizes visual payoff per unit of porting effort and
establishes the shared plumbing (token remap + helper lib items) that everything
else reuses:

1. **time-machine** — your pick; the generalization work below.
2. **blur-reveal** — trivial port, immediately useful, exercises the token remap.
3. **fallback-avatar** — slots next to shadcn `avatar`; pure logic, easy win.
4. **checkbox** — broad utility; establishes the "animated form primitive" pattern.
5. **dock** — high "wow" factor; forces the "assets become props" pattern (icons array).

Then tier-2 (logos-carousel, morphing, morph-surface, gesture-hints, the
dev-tools badge), leaving the math-heavy/domain ones (copy-paste, interpolation,
radial-timeline, line-graph) for last.

Each port lands as `registry/new-york/ui/<name>.tsx` + an example + a
`registry.json` entry + a `src/showcase.tsx` row — same pipeline as the existing
components, installable via `shadcn add peetzweg/ui/<name>`.

## time-machine: generalization plan

The current prototype is a fixed-size, scroll-bound, `next/image` gallery. The
animation math (`scale = 1 - offset*0.08`, `y = offset * -30`, spring) is already
**size-independent** — it works off relative offsets — so making it size-flexible
is mostly about removing hard bindings and inverting control:

**Decouple from globals / Next**
- Replace `next/image` + the 7 static `import img from "./n.jpg"` with a
  generic `items` prop: `Array<ReactNode>` (any content — images, cards, video)
  or `Array<{ src; alt }>` rendered through a default `<img>`.
- Stop mutating `document.body.style.height` / listening on `window`. Make the
  index **controlled** (`activeIndex` + `onIndexChange`), with optional built-in
  drivers that operate on the component's own container ref.

**Make it size-flexible (your ask)**
- Expose frame size via `width`/`height` (or just `className` on the frame) and a
  container size, instead of the hardcoded `max-w-[600px] h-[40%] max-h-[400px]`.
- Keep the relative tuning knobs as props with the current values as defaults:
  `frameOffset = -30`, `scaleStep = 0.08`, `framesVisible = 3`,
  `snapDistance = 50`, `spring = { stiffness: 250, damping: 20, mass: 0.5 }`.
  Because positioning is relative, the same component works at thumbnail or
  hero scale just by changing the size props.

**Proposed API**

```tsx
type Driver = "scroll" | "keyboard" | "controlled"

<TimeMachine
  items={frames}              // ReactNode[] | { src: string; alt?: string }[]
  driver="scroll"             // scroll (scoped to container), keyboard, or fully controlled
  activeIndex?                // controlled mode
  defaultIndex={0}
  onIndexChange={fn}
  framesVisible={3}
  frameOffset={-30}
  scaleStep={0.08}
  snapDistance={50}
  spring={{ stiffness: 250, damping: 20, mass: 0.5 }}
  loop={false}
  className                   // size lives here / on items
/>
```

Ship the `clamp` helper and the `useShortcuts` (tinykeys) hook as separate
`registry:lib`/`registry:hook` items so keyboard nav is reusable across the set.
