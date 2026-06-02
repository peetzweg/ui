"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

type TimeMachineImage = { src: string; alt?: string }

/** A frame can be an image descriptor or any React node (card, video, …). */
export type TimeMachineItem = React.ReactNode | TimeMachineImage

export interface TimeMachineProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Frames to stack, front-to-back. */
  items: TimeMachineItem[]
  /**
   * How the active frame advances:
   * - `scroll` — wheel over the component (scoped to it; no page-scroll hijack of the body)
   * - `keyboard` — arrow keys only
   * - `controlled` — parent owns `activeIndex`; no internal listeners
   *
   * Arrow keys also work in `scroll` mode.
   */
  driver?: "scroll" | "keyboard" | "controlled"
  /** Controlled active index. */
  activeIndex?: number
  /** Initial index when uncontrolled. */
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  /** How many frames recede before clamping (depth of the stack). */
  framesVisible?: number
  /** Vertical px offset applied per step of depth. */
  frameOffset?: number
  /** Scale removed per step of depth. */
  scaleStep?: number
  /** Wheel px required to advance one frame (`scroll` driver). */
  snapDistance?: number
  /** Wrap around at the ends. */
  loop?: boolean
  spring?: { stiffness?: number; damping?: number; mass?: number }
  /** Class applied to each frame — set the frame's size here. */
  frameClassName?: string
}

function clamp(value: number, [min, max]: [number, number]) {
  return Math.min(Math.max(value, min), max)
}

function isImage(item: TimeMachineItem): item is TimeMachineImage {
  return (
    typeof item === "object" &&
    item !== null &&
    "src" in item &&
    typeof (item as TimeMachineImage).src === "string"
  )
}

const DEFAULT_SPRING = { stiffness: 250, damping: 20, mass: 0.5 }

export const TimeMachine = React.forwardRef<HTMLDivElement, TimeMachineProps>(
  function TimeMachine(
    {
      items,
      driver = "scroll",
      activeIndex,
      defaultIndex = 0,
      onIndexChange,
      framesVisible = 3,
      frameOffset = -30,
      scaleStep = 0.08,
      snapDistance = 50,
      loop = false,
      spring,
      frameClassName,
      className,
      ...props
    },
    forwardedRef,
  ) {
    const max = Math.max(items.length - 1, 0)
    const isControlled = activeIndex !== undefined

    const [internalIndex, setInternalIndex] = React.useState(() =>
      clamp(defaultIndex, [0, max]),
    )
    const index = clamp(isControlled ? activeIndex : internalIndex, [0, max])

    // Keep a live value so wheel/key handlers (bound once) read the latest index.
    const indexRef = React.useRef(index)
    React.useEffect(() => {
      indexRef.current = index
    }, [index])

    const setIndex = React.useCallback(
      (next: number | ((current: number) => number)) => {
        const current = indexRef.current
        let value = typeof next === "function" ? next(current) : next
        if (loop && items.length > 0) {
          const span = items.length
          value = ((value % span) + span) % span
        } else {
          value = clamp(value, [0, Math.max(items.length - 1, 0)])
        }
        if (value === current) return
        indexRef.current = value
        if (!isControlled) setInternalIndex(value)
        onIndexChange?.(value)
      },
      [isControlled, items.length, loop, onIndexChange],
    )

    // Arrow-key navigation (everything but the fully-controlled mode).
    React.useEffect(() => {
      if (driver === "controlled") return
      function onKey(event: KeyboardEvent) {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          setIndex((i) => i + 1)
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          setIndex((i) => i - 1)
        } else {
          return
        }
        event.preventDefault()
      }
      window.addEventListener("keydown", onKey)
      return () => window.removeEventListener("keydown", onKey)
    }, [driver, setIndex])

    // Wheel-to-scrub, scoped to the component (no document.body mutation).
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node
        if (typeof forwardedRef === "function") forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      },
      [forwardedRef],
    )

    React.useEffect(() => {
      if (driver !== "scroll") return
      const el = containerRef.current
      if (!el) return
      let accumulated = 0
      function onWheel(event: WheelEvent) {
        event.preventDefault()
        accumulated += event.deltaY
        const steps = Math.trunc(accumulated / snapDistance)
        if (steps !== 0) {
          accumulated -= steps * snapDistance
          setIndex((i) => i + steps)
        }
      }
      el.addEventListener("wheel", onWheel, { passive: false })
      return () => el.removeEventListener("wheel", onWheel)
    }, [driver, snapDistance, setIndex])

    const transition = { type: "spring" as const, ...DEFAULT_SPRING, ...spring }

    return (
      <div
        ref={setRefs}
        className={cn(
          "relative grid h-full w-full place-items-center overflow-hidden",
          className,
        )}
        {...props}
      >
        {items.map((item, i) => {
          const offsetIndex = i - index
          const passed = index > i
          const scale = clamp(1 - offsetIndex * scaleStep, [scaleStep, 2])
          const y = clamp(offsetIndex * frameOffset, [
            frameOffset * framesVisible,
            Infinity,
          ])

          return (
            <motion.div
              key={i}
              className={cn(
                "[grid-area:1/1] aspect-[3/2] w-2/3 overflow-hidden rounded-lg border bg-card",
                frameClassName,
              )}
              initial={false}
              animate={{ y, scale, transition }}
              style={{
                borderWidth: 2 / scale,
                opacity: passed ? 0 : 1,
                filter: `blur(${passed ? 2 : 0}px)`,
                transitionProperty: "opacity, filter",
                transitionDuration: "200ms",
                transitionTimingFunction: "ease-in-out",
                willChange: "opacity, filter, transform",
                zIndex: items.length - i,
              }}
            >
              {isImage(item) ? (
                <img
                  src={item.src}
                  alt={item.alt ?? ""}
                  className="h-full w-full object-cover"
                />
              ) : (
                item
              )}
            </motion.div>
          )
        })}
      </div>
    )
  },
)
