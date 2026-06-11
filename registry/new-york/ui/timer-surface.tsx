"use client"

import * as React from "react"
import { Timer } from "lucide-react"

import { MorphSurface } from "@/registry/new-york/ui/morph-surface"
import { TickTape } from "@/registry/new-york/ui/tick-tape"
import { cn } from "@/lib/utils"

/**
 * Sleep-timer preset over `MorphSurface` + `TickTape`.
 *
 * A compact pill showing the set duration morphs into a dark, iOS-style panel:
 * a minute tape (labels every 5) scrubbed under a fixed pointer, a live
 * duration readout, and a start button. Mechanics stay in the primitives —
 * this layer bakes in the timer domain: minute range, duration formatting,
 * the orange-on-black palette, and start/collapse semantics.
 *
 * For a different look or layout, drop down to the primitives directly.
 */

export interface TimerSurfaceProps {
  /** Controlled selected duration, in whole minutes. */
  minutes?: number
  /** Initial duration when uncontrolled. */
  defaultMinutes?: number
  onMinutesChange?: (minutes: number) => void
  maxMinutes?: number
  /** Fired with the selected duration when the start button is pressed. */
  onStart?: (minutes: number) => void
  startLabel?: React.ReactNode
  /** Readout + trigger text; defaults to `15:00` / `1:40:00` style. */
  formatDuration?: (minutes: number) => string
  /** Controlled open state (forwarded to MorphSurface). */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Collapse the surface after starting. */
  collapseOnStart?: boolean
  expandedWidth?: number
  expandedHeight?: number
  /** Lands on the morphing surface — override the palette here. */
  className?: string
}

/** `90` → `"1:30:00"`, `15` → `"15:00"`. */
export function formatTimerDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return hours > 0
    ? `${hours}:${String(rest).padStart(2, "0")}:00`
    : `${rest}:00`
}

export function TimerSurface({
  minutes: minutesProp,
  defaultMinutes = 15,
  onMinutesChange,
  maxMinutes = 120,
  onStart,
  startLabel = "Start Timer",
  formatDuration = formatTimerDuration,
  open,
  defaultOpen,
  onOpenChange,
  collapseOnStart = true,
  expandedWidth = 480,
  expandedHeight = 210,
  className,
}: TimerSurfaceProps) {
  const isControlled = minutesProp !== undefined
  const [internalMinutes, setInternalMinutes] = React.useState(defaultMinutes)
  const minutes = isControlled ? minutesProp : internalMinutes

  const setMinutes = React.useCallback(
    (next: number) => {
      if (!isControlled) setInternalMinutes(next)
      onMinutesChange?.(next)
    },
    [isControlled, onMinutesChange],
  )

  return (
    <MorphSurface
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      collapsedWidth="auto"
      collapsedHeight={44}
      collapsedRadius={22}
      expandedWidth={expandedWidth}
      expandedHeight={expandedHeight}
      expandedRadius={40}
      className={cn("bg-neutral-950 text-orange-400 shadow-xl", className)}
      collapsed={({ open, expand }) =>
        open ? null : (
          <button
            type="button"
            onClick={expand}
            className="flex h-[44px] select-none items-center gap-2 whitespace-nowrap px-4 text-sm font-semibold active:scale-[0.97]"
          >
            <Timer className="size-4" aria-hidden />
            <span className="tabular-nums">{formatDuration(minutes)}</span>
          </button>
        )
      }
      expanded={({ collapse }) => (
        <div className="flex h-full flex-col justify-between pb-5 pt-6">
          <TickTape
            min={0}
            max={maxMinutes}
            step={1}
            majorEvery={5}
            value={minutes}
            onValueChange={setMinutes}
            aria-label="Timer duration in minutes"
            tickClassName="bg-orange-400/90"
            glowClassName="bg-amber-100"
            labelClassName="text-orange-400"
          />
          <div className="flex items-end justify-between gap-4 px-6">
            <button
              type="button"
              disabled={minutes === 0}
              onClick={() => {
                onStart?.(minutes)
                if (collapseOnStart) collapse()
              }}
              className="rounded-full bg-orange-400/15 px-5 py-2.5 text-lg font-semibold active:scale-[0.97] disabled:opacity-40"
            >
              {startLabel}
            </button>
            <span className="text-5xl font-semibold tabular-nums tracking-tight text-orange-500">
              {formatDuration(minutes)}
            </span>
          </div>
        </div>
      )}
    />
  )
}
