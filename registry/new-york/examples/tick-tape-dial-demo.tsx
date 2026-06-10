"use client"

import * as React from "react"

import { TickTape } from "@/registry/new-york/ui/tick-tape"

// A fractional-step tape: 0.1 MHz ticks, a label on every whole megahertz.
// All the styling lives in the className slots — the mechanics don't change.
export function TickTapeDialDemo() {
  const [frequency, setFrequency] = React.useState(99.5)

  return (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-neutral-950 p-6 text-emerald-400">
      <div className="flex items-baseline justify-between px-1">
        <span className="text-xs font-medium uppercase tracking-widest text-emerald-400/60">
          FM
        </span>
        <span className="text-3xl font-semibold tabular-nums tracking-tight">
          {frequency.toFixed(1)}
          <span className="ml-1.5 text-sm font-medium text-emerald-400/60">
            MHz
          </span>
        </span>
      </div>
      <TickTape
        min={88}
        max={108}
        step={0.1}
        majorEvery={10}
        tickGap={9}
        value={frequency}
        onValueChange={setFrequency}
        formatLabel={(v) => v.toFixed(0)}
        aria-label="FM frequency"
        tickClassName="bg-emerald-400/60"
        glowClassName="bg-emerald-100"
        labelClassName="text-emerald-400/80"
      />
    </div>
  )
}
