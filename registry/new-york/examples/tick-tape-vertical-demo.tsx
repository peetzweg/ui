"use client"

import * as React from "react"

import { TickTape } from "@/registry/new-york/ui/tick-tape"

// orientation="vertical" scrubs along y with labels beside the ticks; size
// the scrubbed axis via className (h-56 here), the cross axis sizes itself.
// `inverted` puts the high values at the top, and the data-side styling
// colors everything at-or-below the value — a thermometer's mercury column.
export function TickTapeVerticalDemo() {
  const [temperature, setTemperature] = React.useState(21)

  return (
    <div className="flex items-center gap-8">
      <TickTape
        orientation="vertical"
        inverted
        min={15}
        max={30}
        step={0.5}
        majorEvery={2}
        value={temperature}
        onValueChange={setTemperature}
        aria-label="Target temperature"
        className="h-56 text-rose-500"
        tickClassName="bg-rose-500/80 data-[side=after]:bg-muted-foreground/25"
        glowClassName="bg-rose-100"
        labelClassName="text-rose-500 data-[side=after]:text-muted-foreground/60"
      />
      <span className="text-4xl font-semibold tabular-nums tracking-tight text-rose-500">
        {temperature.toFixed(1)}
        <span className="ml-1 text-xl text-rose-500/60">°C</span>
      </span>
    </div>
  )
}
