"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { useClickOutside } from "@/registry/new-york/hooks/use-click-outside"
import { cn } from "@/lib/utils"

/** Live surface state handed to the `collapsed` / `expanded` render functions. */
export interface MorphSurfaceState {
  open: boolean
  expand: () => void
  collapse: () => void
  setOpen: (open: boolean) => void
}

/**
 * Surface content: a plain node, or a render function receiving the live
 * state — use the function form to drive the trigger/panel off `open` (hide a
 * shared element on one side, focus an input on expand, etc.).
 */
export type MorphSurfaceContent =
  | React.ReactNode
  | ((state: MorphSurfaceState) => React.ReactNode)

export interface MorphSurfaceProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Resting content — the trigger. Always mounted, anchored to the bottom of
   * the surface so it stays put as the surface grows upward.
   */
  collapsed: MorphSurfaceContent
  /**
   * Open content — the panel. Mounted (and cross-faded in) only while open,
   * absolutely filling the expanded box.
   */
  expanded: MorphSurfaceContent
  /** Controlled open state. */
  open?: boolean
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Collapsed width; `"auto"` shrinks to fit the trigger. */
  collapsedWidth?: number | "auto"
  collapsedHeight?: number
  expandedWidth?: number
  expandedHeight?: number
  collapsedRadius?: number
  expandedRadius?: number
  spring?: { stiffness?: number; damping?: number; mass?: number }
  /** Collapse when a pointer/focus event lands outside the surface. */
  closeOnClickOutside?: boolean
  /** Collapse on the Escape key while open. */
  closeOnEscape?: boolean
}

const DEFAULT_SPRING = { stiffness: 550, damping: 45, mass: 0.7 }

/**
 * A surface that springs between two sizes — a small trigger and a larger
 * panel — morphing its width, height, and corner radius in one motion. The
 * trigger stays mounted and bottom-anchored while the panel cross-fades in
 * above it, so the box appears to grow out of the trigger rather than swap.
 *
 * Headless: it owns the morph, open/close, and dismissal (click-outside +
 * Escape) only — `collapsed` and `expanded` are your content. Give an element
 * on each side the same motion `layoutId` to have it travel between states as
 * the surface morphs (the prototype's accent dot). Works controlled (`open` +
 * `onOpenChange`) or uncontrolled (`defaultOpen`).
 */
export const MorphSurface = React.forwardRef<HTMLDivElement, MorphSurfaceProps>(
  function MorphSurface(
    {
      collapsed,
      expanded,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      collapsedWidth = "auto",
      collapsedHeight = 44,
      expandedWidth = 360,
      expandedHeight = 200,
      collapsedRadius = 20,
      expandedRadius = 14,
      spring,
      closeOnClickOutside = true,
      closeOnEscape = true,
      className,
      style,
      ...props
    },
    forwardedRef,
  ) {
    const isControlled = openProp !== undefined
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    const open = isControlled ? openProp : internalOpen

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (next === open) return
        if (!isControlled) setInternalOpen(next)
        onOpenChange?.(next)
      },
      [open, isControlled, onOpenChange],
    )

    const expand = React.useCallback(() => setOpen(true), [setOpen])
    const collapse = React.useCallback(() => setOpen(false), [setOpen])

    const surfaceRef = React.useRef<HTMLDivElement | null>(null)
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        surfaceRef.current = node
        if (typeof forwardedRef === "function") forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      },
      [forwardedRef],
    )

    useClickOutside(surfaceRef, collapse, {
      enabled: open && closeOnClickOutside,
    })

    React.useEffect(() => {
      if (!open || !closeOnEscape) return
      function onKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") collapse()
      }
      window.addEventListener("keydown", onKeyDown)
      return () => window.removeEventListener("keydown", onKeyDown)
    }, [open, closeOnEscape, collapse])

    const state: MorphSurfaceState = { open, expand, collapse, setOpen }
    const transition = { type: "spring" as const, ...DEFAULT_SPRING, ...spring }

    const render = (content: MorphSurfaceContent) =>
      typeof content === "function" ? content(state) : content

    return (
      // Reserve the expanded footprint and bottom-anchor the surface, so
      // growing upward never shifts surrounding layout.
      <div
        {...props}
        className="flex items-end justify-center"
        style={{ width: expandedWidth, height: expandedHeight }}
      >
        <motion.div
          ref={setRefs}
          initial={false}
          animate={{
            width: open ? expandedWidth : collapsedWidth,
            height: open ? expandedHeight : collapsedHeight,
            borderRadius: open ? expandedRadius : collapsedRadius,
          }}
          // Let the panel start fading the instant it opens, but hold the
          // collapse a beat so the surface has begun shrinking first.
          transition={{ ...transition, delay: open ? 0 : 0.08 }}
          className={cn(
            "relative flex flex-col justify-end overflow-hidden",
            className,
          )}
          style={style}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                key="expanded"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition}
              >
                {render(expanded)}
              </motion.div>
            )}
          </AnimatePresence>
          {/* Trigger stays above the panel so it's always interactive. */}
          <div className="relative z-[1]">{render(collapsed)}</div>
        </motion.div>
      </div>
    )
  },
)
