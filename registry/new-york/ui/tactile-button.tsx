"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface TactileButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Controlled "held down" state. When `true` the key stays depressed
   * regardless of interaction — use it for latched / active keys (an
   * illuminated sequencer step, a toggle that's on). Left undefined the key
   * is purely momentary: it presses while pointer/key is down and pops back.
   * The visual depressed state is `pressed || momentary`.
   */
  pressed?: boolean
}

/**
 * The two neumorphic box-shadow stacks the key morphs between. Both have the
 * same three layers (drop · inner-bevel · soft self-shadow) so the browser can
 * interpolate the transition cleanly. Colors come from `--key-*` custom
 * properties so the consumer recolors the key without touching the mechanic:
 *
 *   --key-face       the cap surface (also the element background)
 *   --key-highlight  the lit top-left bevel of a raised key
 *   --key-drop       the cast shadow under a raised key
 *   --key-press      the dark inner shadow of a depressed key
 */
const RAISED_SHADOW =
  "var(--key-drop) 10px 10px 8px, " +
  "inset 1.5px 1.5px 2px 0 var(--key-highlight), " +
  "inset -3.2px -3.2px 8px 0 var(--key-face)"

const PRESSED_SHADOW =
  "var(--key-drop) 0 0 0, " +
  "inset 0.5px 0.5px 4px 0 var(--key-press), " +
  "inset -3.2px -3.2px 8px 0 var(--key-face)"

// Grey "function key" defaults, lifted from the EP-133 light keys. Override any
// of these per instance via `style` (or a Tailwind arbitrary `[--key-face:…]`).
const DEFAULT_VARS: React.CSSProperties = {
  "--key-face": "#c7c3c0",
  "--key-highlight": "#ffffff",
  "--key-drop": "rgba(0, 0, 0, 0.377)",
  "--key-press": "#000000",
} as React.CSSProperties

/**
 * A realistic, neumorphic hardware key — a physical button that *depresses*
 * when you press it: the cast shadow collapses, a dark shadow sinks inside, and
 * the face drops into its well. Modelled on the Teenage Engineering EP-133
 * K.O. II keypad.
 *
 * Headless: the component owns the press mechanic only — the raised⇄pressed
 * shadow morph, the content sink, pointer + keyboard (Space/Enter) wiring, and
 * a controlled `pressed` latch. **You own appearance and content** — set the
 * cap colors through the `--key-*` custom properties (sensible grey defaults
 * provided), the size through `className` (defaults to `5.7em`, so a parent
 * `font-size` scales the whole key), and pass any icon or label as children.
 */
export const TactileButton = React.forwardRef<
  HTMLButtonElement,
  TactileButtonProps
>(function TactileButton(
  {
    pressed,
    className,
    style,
    children,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    onKeyDown,
    onKeyUp,
    ...props
  },
  ref,
) {
  // Momentary depression driven by the active interaction. Tracked separately
  // for pointer and keyboard so releasing one doesn't pop a key the other is
  // still holding.
  const [pointerDown, setPointerDown] = React.useState(false)
  const [keyDown, setKeyDown] = React.useState(false)

  const isDown = pressed === true || pointerDown || keyDown

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      data-pressed={isDown ? "" : undefined}
      onPointerDown={(e) => {
        setPointerDown(true)
        onPointerDown?.(e)
      }}
      onPointerUp={(e) => {
        setPointerDown(false)
        onPointerUp?.(e)
      }}
      onPointerLeave={(e) => {
        setPointerDown(false)
        onPointerLeave?.(e)
      }}
      onPointerCancel={(e) => {
        setPointerDown(false)
        onPointerCancel?.(e)
      }}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) setKeyDown(true)
        onKeyDown?.(e)
      }}
      onKeyUp={(e) => {
        if (e.key === " " || e.key === "Enter") setKeyDown(false)
        onKeyUp?.(e)
      }}
      style={{
        ...DEFAULT_VARS,
        backgroundColor: "var(--key-face)",
        borderRadius: "var(--key-radius, 10px)",
        boxShadow: isDown ? PRESSED_SHADOW : RAISED_SHADOW,
        // Name the properties — never transition-all. Short + interruptible, so
        // CSS (off the main thread) beats a spring here.
        transition: "box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out",
        ...style,
      }}
      className={cn(
        "inline-flex size-[5.7em] cursor-pointer items-center justify-center",
        "border-none outline-none select-none",
        // Disabled keys can't be pushed in.
        "disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
      {...props}
    >
      {/* The face's contents sink with the key. `motion-reduce` drops the
          travel but keeps the shadow morph, so the press still reads. */}
      <span
        className={cn(
          // Fills the key so children can self-align (e.g. a label that sits
          // near the top via `self-start`); icons stay centred by default.
          "flex size-full items-center justify-center transition-transform duration-100 ease-in-out",
          isDown && "translate-y-px scale-[0.97] motion-reduce:transform-none",
        )}
      >
        {children}
      </span>
    </button>
  )
})
