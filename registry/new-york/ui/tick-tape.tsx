"use client"

import * as React from "react"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"

import { useHaptic } from "@/registry/new-york/hooks/use-haptic"
import { clamp } from "@/registry/new-york/lib/clamp"
import { cn } from "@/lib/utils"

export interface TickTapeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  min?: number
  max?: number
  /** Value distance between adjacent ticks. */
  step?: number
  /** Controlled value (always snapped to a tick). */
  value?: number
  /** Initial value when uncontrolled. */
  defaultValue?: number
  onValueChange?: (value: number) => void
  /**
   * `horizontal` scrubs along x with labels above the ticks; `vertical`
   * scrubs along y with labels beside them. Size the scrubbed axis via
   * `className` (`w-full` / `h-64`); the cross axis sizes itself.
   */
  orientation?: "horizontal" | "vertical"
  /**
   * Flip the tape so values increase toward the start — left on a horizontal
   * tape, top on a vertical one (e.g. a thermometer). Arrow keys keep
   * following the visual direction.
   */
  inverted?: boolean
  /** Distance between tick centers along the tape (px). */
  tickGap?: number
  /** Tick thickness along the tape (px). */
  tickWidth?: number
  /** Tick length across the tape (px). */
  tickHeight?: number
  /** Every Nth tick is a labeled major tick. */
  majorEvery?: number
  /** Label content for major ticks; return `null` to hide one. */
  formatLabel?: (value: number) => React.ReactNode
  /** How far (px) from the pointer the scrub glow reaches. `0` disables. */
  glowRadius?: number
  /** Peak opacity of the scrub glow, 0–1. */
  glowIntensity?: number
  /** How much a fully-glowing tick stretches (`scale: 1 + glowStretch`). */
  glowStretch?: number
  /** Scrub speed (px/s) at which the glow reaches full strength. */
  glowVelocity?: number
  /** Replaces the default center triangle (colored via `currentColor`). */
  indicator?: React.ReactNode
  /** Haptic tick per value change on mobile (no-op on desktop). */
  haptics?: boolean
  spring?: { stiffness?: number; damping?: number; mass?: number }
  tickClassName?: string
  glowClassName?: string
  labelClassName?: string
}

const DEFAULT_SPRING = { stiffness: 550, damping: 45, mass: 0.8 }
const GLOW_SPRING = { stiffness: 280, damping: 36 }

/** Pointer movement under this (px) counts as a tap, not a drag. */
const TAP_SLOP = 4
/** Cross-axis room reserved for labels, plus the gap to the ticks. */
const LABEL_SIZE = { horizontal: 16, vertical: 26 }
const LABEL_GAP = 8

/**
 * A tape-measure value scrubber: a strip of ticks (one per `step`, labels on
 * the majors) that you drag, wheel, tap, or arrow-key under a fixed center
 * indicator. The tape springs to position and snaps to the nearest tick on
 * release; while it moves, ticks near the center light up with a
 * velocity-scaled glow that trails the motion (the line-minimap proximity
 * effect). On mobile, every tick crossed emits a light haptic.
 *
 * Headless mechanics: geometry, motion, snapping, and input wiring live here —
 * tick, glow, label, and indicator appearance are yours via the `*ClassName`
 * slots and `formatLabel`/`indicator`. Each tick and label carries
 * `data-side="before" | "after"` (relative to the current value) and
 * `data-selected` on the exact tick, so value-relative styling is plain
 * Tailwind (`data-[side=after]:opacity-25`). Works controlled (`value` +
 * `onValueChange`) or uncontrolled (`defaultValue`); horizontal or vertical.
 * Wheel and keys are scoped to the component, so multiple tapes coexist.
 */
export const TickTape = React.forwardRef<HTMLDivElement, TickTapeProps>(
  function TickTape(
    {
      min = 0,
      max = 100,
      step = 1,
      value: valueProp,
      defaultValue,
      onValueChange,
      orientation = "horizontal",
      inverted = false,
      tickGap = 12,
      tickWidth = 2,
      tickHeight = 28,
      majorEvery = 5,
      formatLabel,
      glowRadius = 56,
      glowIntensity = 1,
      glowStretch = 0.4,
      glowVelocity = 600,
      indicator,
      haptics = true,
      spring,
      tickClassName,
      glowClassName,
      labelClassName,
      className,
      onKeyDown,
      ...props
    },
    forwardedRef,
  ) {
    const vertical = orientation === "vertical"
    const stepCount = Math.max(1, Math.round((max - min) / step))
    const tickCount = stepCount + 1
    // Snap derived values to the step's decimal precision so float drift
    // (e.g. 88 + 0.1 * n) never leaks into labels or onValueChange.
    const decimals = Math.max(decimalsOf(step), decimalsOf(min))
    const snapValue = React.useCallback(
      (pos: number) =>
        Number(
          (min + Math.round(clamp(pos, [0, stepCount])) * step).toFixed(
            decimals,
          ),
        ),
      [min, step, stepCount, decimals],
    )
    const valueToPos = React.useCallback(
      (v: number) => clamp((v - min) / step, [0, stepCount]),
      [min, step, stepCount],
    )

    const isControlled = valueProp !== undefined
    const [internalValue, setInternalValue] = React.useState(
      () => defaultValue ?? min,
    )
    const value = isControlled ? valueProp : internalValue

    // Live mirrors so handlers bound once (wheel, pointer) read latest state.
    const valueRef = React.useRef(value)
    React.useEffect(() => {
      valueRef.current = value
    }, [value])
    const onValueChangeRef = React.useRef(onValueChange)
    React.useEffect(() => {
      onValueChangeRef.current = onValueChange
    })
    const isControlledRef = React.useRef(isControlled)
    React.useEffect(() => {
      isControlledRef.current = isControlled
    }, [isControlled])

    // One haptic tick per crossed tick — only user input commits, so
    // controlled/external updates never buzz.
    const hapticTick = useHaptic()
    const hapticsRef = React.useRef(haptics)
    React.useEffect(() => {
      hapticsRef.current = haptics
    }, [haptics])

    const commit = React.useCallback(
      (next: number) => {
        if (next === valueRef.current) return
        valueRef.current = next
        if (!isControlledRef.current) setInternalValue(next)
        if (hapticsRef.current) hapticTick()
        onValueChangeRef.current?.(next)
      },
      [hapticTick],
    )

    // Tape position, in ticks (float while dragging). The spring translates
    // the track so tick `pos` sits under the fixed center indicator.
    const offset = useSpring(0, { ...DEFAULT_SPRING, ...spring })
    const posRef = React.useRef(valueToPos(value))
    const reducedMotion = useReducedMotion()
    const reducedMotionRef = React.useRef(reducedMotion)
    React.useEffect(() => {
      reducedMotionRef.current = reducedMotion
    }, [reducedMotion])

    const viewportRef = React.useRef<HTMLDivElement | null>(null)
    const viewportSizeRef = React.useRef(0)
    const [viewportSize, setViewportSize] = React.useState(0)

    // Layout slot for a tick index — inverted tapes lay ticks out back to
    // front, so all geometry goes through this mapping.
    const placeOf = React.useCallback(
      (index: number) => (inverted ? stepCount - index : index),
      [inverted, stepCount],
    )

    const applyPos = React.useCallback(
      (pos: number, jump = false) => {
        posRef.current = clamp(pos, [0, stepCount])
        const target =
          viewportSizeRef.current / 2 -
          (placeOf(posRef.current) * tickGap + tickWidth / 2)
        if (jump || reducedMotionRef.current) offset.jump(target)
        else offset.set(target)
      },
      [stepCount, tickGap, tickWidth, offset, placeOf],
    )

    React.useLayoutEffect(() => {
      const el = viewportRef.current
      if (!el) return
      const measure = () => {
        const size = vertical ? el.clientHeight : el.clientWidth
        viewportSizeRef.current = size
        setViewportSize(size)
        applyPos(posRef.current, true)
      }
      measure()
      const observer = new ResizeObserver(measure)
      observer.observe(el)
      return () => observer.disconnect()
    }, [applyPos, vertical])

    // Follow external value changes (controlled updates, keyboard) — but not
    // mid-scrub, where the pointer/wheel owns the (fractional) position and
    // the live commits this effect reacts to must not snap it back.
    const draggingRef = React.useRef(false)
    const wheelingRef = React.useRef(false)
    React.useEffect(() => {
      if (draggingRef.current || wheelingRef.current) return
      const target = valueToPos(value)
      if (Math.abs(posRef.current - target) > 1e-6) applyPos(target)
    }, [value, valueToPos, applyPos])

    // Drag (with pointer capture) — 1:1 px tracking through the spring, live
    // value commits while crossing ticks, snap to the nearest tick on release.
    // A near-still press counts as a tap and jumps to the tick under it.
    const [dragging, setDragging] = React.useState(false)
    const dragStart = React.useRef({ client: 0, pos: 0, moved: false })

    function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
      event.currentTarget.setPointerCapture(event.pointerId)
      dragStart.current = {
        client: vertical ? event.clientY : event.clientX,
        pos: posRef.current,
        moved: false,
      }
      draggingRef.current = true
      setDragging(true)
    }

    function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
      if (!draggingRef.current) return
      const client = vertical ? event.clientY : event.clientX
      const delta = client - dragStart.current.client
      if (Math.abs(delta) > TAP_SLOP) dragStart.current.moved = true
      if (!dragStart.current.moved) return
      applyPos(dragStart.current.pos + (inverted ? delta : -delta) / tickGap)
      commit(snapValue(posRef.current))
    }

    function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
      if (!draggingRef.current) return
      draggingRef.current = false
      setDragging(false)
      if (!dragStart.current.moved && viewportRef.current) {
        const rect = viewportRef.current.getBoundingClientRect()
        const along = vertical
          ? event.clientY - rect.top
          : event.clientX - rect.left
        const place = (along - offset.get() - tickWidth / 2) / tickGap
        applyPos(Math.round(inverted ? stepCount - place : place))
      } else {
        applyPos(Math.round(posRef.current))
      }
      commit(snapValue(posRef.current))
    }

    // Wheel scrubbing, scoped to the element (passive: false so the page
    // doesn't scroll). Fractional while wheeling; snaps once input settles.
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
      const el = containerRef.current
      if (!el) return
      let snapTimer = 0
      function onWheel(event: WheelEvent) {
        event.preventDefault()
        const delta =
          Math.abs(event.deltaX) > Math.abs(event.deltaY)
            ? event.deltaX
            : event.deltaY
        wheelingRef.current = true
        applyPos(posRef.current + (inverted ? -delta : delta) / tickGap)
        commit(snapValue(posRef.current))
        window.clearTimeout(snapTimer)
        snapTimer = window.setTimeout(() => {
          wheelingRef.current = false
          applyPos(Math.round(posRef.current))
          commit(snapValue(posRef.current))
        }, 160)
      }
      el.addEventListener("wheel", onWheel, { passive: false })
      return () => {
        el.removeEventListener("wheel", onWheel)
        window.clearTimeout(snapTimer)
        wheelingRef.current = false
      }
    }, [applyPos, commit, snapValue, tickGap, inverted])

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      const stepBy = (ticks: number) =>
        snapValue(valueToPos(valueRef.current) + ticks)
      // Arrows follow the visual direction: `dir` is the value change one
      // visual step forward (right/down), flipped on inverted tapes. On a
      // horizontal tape up/down keep their slider meaning (up = more).
      const dir = inverted ? -1 : 1
      let next: number | null = null
      switch (event.key) {
        case "ArrowRight":
          next = stepBy(dir)
          break
        case "ArrowLeft":
          next = stepBy(-dir)
          break
        case "ArrowDown":
          next = stepBy(vertical ? dir : -1)
          break
        case "ArrowUp":
          next = stepBy(vertical ? -dir : 1)
          break
        case "PageUp":
          next = stepBy(majorEvery)
          break
        case "PageDown":
          next = stepBy(-majorEvery)
          break
        case "Home":
          next = snapValue(0)
          break
        case "End":
          next = snapValue(stepCount)
          break
      }
      if (next === null) return
      event.preventDefault()
      applyPos(valueToPos(next))
      commit(next)
    }

    const ticks = React.useMemo(
      () =>
        Array.from({ length: tickCount }, (_, index) => ({
          index,
          value: Number((min + index * step).toFixed(decimals)),
          major: index % majorEvery === 0,
        })),
      [tickCount, min, step, decimals, majorEvery],
    )

    const labelArea = LABEL_SIZE[orientation] + LABEL_GAP
    const crossSize = labelArea + tickHeight
    const trackLength = stepCount * tickGap + tickWidth
    const edgeMask = `linear-gradient(${vertical ? "to bottom" : "to right"}, transparent, black 12%, black 88%, transparent)`

    return (
      <div
        {...props}
        ref={setRefs}
        role="slider"
        tabIndex={0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-orientation={orientation}
        data-dragging={dragging || undefined}
        onKeyDown={handleKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={cn(
          "relative cursor-grab touch-none select-none rounded-md outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring/50",
          dragging && "cursor-grabbing",
          vertical && "flex",
          className,
        )}
      >
        <div
          ref={viewportRef}
          className={cn(
            "relative overflow-hidden",
            vertical ? "h-full" : "w-full",
          )}
          style={{
            [vertical ? "width" : "height"]: crossSize,
            maskImage: edgeMask,
            WebkitMaskImage: edgeMask,
          }}
        >
          <motion.div
            className={cn(
              "absolute",
              vertical ? "inset-x-0 top-0" : "inset-y-0 left-0",
            )}
            style={
              vertical
                ? { y: offset, height: trackLength }
                : { x: offset, width: trackLength }
            }
          >
            {ticks.map((tick) =>
              tick.major ? (
                <span
                  key={`label-${tick.index}`}
                  data-side={tick.value <= value ? "before" : "after"}
                  data-selected={tick.value === value || undefined}
                  className={cn(
                    "absolute text-xs font-medium tabular-nums text-muted-foreground",
                    vertical
                      ? "-translate-y-1/2 text-right"
                      : "top-0 -translate-x-1/2",
                    labelClassName,
                  )}
                  style={
                    vertical
                      ? {
                          left: 0,
                          width: LABEL_SIZE.vertical,
                          top: placeOf(tick.index) * tickGap + tickWidth / 2,
                        }
                      : {
                          left: placeOf(tick.index) * tickGap + tickWidth / 2,
                          lineHeight: `${LABEL_SIZE.horizontal}px`,
                        }
                  }
                >
                  {formatLabel ? formatLabel(tick.value) : tick.value}
                </span>
              ) : null,
            )}
            {ticks.map((tick) => (
              <Tick
                key={tick.index}
                place={placeOf(tick.index)}
                offset={offset}
                vertical={vertical}
                side={tick.value <= value ? "before" : "after"}
                selected={tick.value === value}
                crossStart={labelArea}
                tickGap={tickGap}
                tickWidth={tickWidth}
                tickHeight={tickHeight}
                viewportSize={viewportSize}
                glowRadius={glowRadius}
                glowIntensity={glowIntensity}
                glowStretch={glowStretch}
                glowVelocity={glowVelocity}
                tickClassName={tickClassName}
                glowClassName={glowClassName}
              />
            ))}
          </motion.div>
        </div>
        <div
          className={cn(
            "pointer-events-none flex",
            vertical
              ? "ml-1 flex-col justify-center"
              : "mt-1 justify-center",
          )}
        >
          {indicator ?? (
            <svg
              width="10"
              height="7"
              viewBox="0 0 10 7"
              className={cn("fill-current", vertical && "-rotate-90")}
              aria-hidden
            >
              <path d="M5 0L9.33 6.75H0.67L5 0Z" />
            </svg>
          )}
        </div>
      </div>
    )
  },
)

const Tick = React.memo(function Tick({
  place,
  offset,
  vertical,
  side,
  selected,
  crossStart,
  tickGap,
  tickWidth,
  tickHeight,
  viewportSize,
  glowRadius,
  glowIntensity,
  glowStretch,
  glowVelocity,
  tickClassName,
  glowClassName,
}: {
  /** Layout slot along the tape (already inversion-mapped). */
  place: number
  offset: MotionValue<number>
  vertical: boolean
  side: "before" | "after"
  selected: boolean
  crossStart: number
  tickGap: number
  tickWidth: number
  tickHeight: number
  viewportSize: number
  glowRadius: number
  glowIntensity: number
  glowStretch: number
  glowVelocity: number
  tickClassName?: string
  glowClassName?: string
}) {
  // Velocity-scaled proximity glow: while the tape moves, ticks near the
  // center indicator brighten and stretch, decaying through a spring once the
  // motion passes — fast scrubs leave a trail, slow ones barely register.
  const glow = useSpring(0, GLOW_SPRING)
  const scale = useTransform(glow, (g) => 1 + glowStretch * g)

  useMotionValueEvent(offset, "change", (latest) => {
    const distance =
      latest + place * tickGap + tickWidth / 2 - viewportSize / 2
    if (glowIntensity <= 0 || Math.abs(distance) > glowRadius) {
      if (glow.get() > 0.001) glow.set(0)
      return
    }
    const speed = Math.min(1, Math.abs(offset.getVelocity()) / glowVelocity)
    const falloff = 1 - Math.abs(distance) / glowRadius
    glow.set(glowIntensity * speed * falloff * falloff)
  })

  const dataAttrs = { "data-side": side, "data-selected": selected || undefined }

  return (
    <motion.div
      className="absolute"
      style={
        vertical
          ? {
              top: place * tickGap,
              left: crossStart,
              height: tickWidth,
              width: tickHeight,
              scaleX: scale,
            }
          : {
              left: place * tickGap,
              top: crossStart,
              width: tickWidth,
              height: tickHeight,
              scaleY: scale,
            }
      }
    >
      <div
        {...dataAttrs}
        className={cn(
          "absolute inset-0 rounded-full bg-muted-foreground/50",
          tickClassName,
        )}
      />
      <motion.div
        {...dataAttrs}
        className={cn("absolute inset-0 rounded-full bg-foreground", glowClassName)}
        style={{ opacity: glow }}
      />
    </motion.div>
  )
})

function decimalsOf(n: number): number {
  const text = String(n)
  const dot = text.indexOf(".")
  return dot === -1 ? 0 : text.length - dot - 1
}
