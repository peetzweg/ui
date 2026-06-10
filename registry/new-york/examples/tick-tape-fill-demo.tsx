"use client"

import * as React from "react"

import { TickTape } from "@/registry/new-york/ui/tick-tape"

// Every tick and label carries data-side="before" | "after" relative to the
// current value (and data-selected on the exact tick), so a filled/unfilled
// split is plain Tailwind — no render props.
export function TickTapeFillDemo() {
  const [volume, setVolume] = React.useState(35)

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <span className="text-4xl font-semibold tabular-nums tracking-tight text-sky-500">
        {volume}
        <span className="ml-1 text-xl text-sky-500/60">vol</span>
      </span>
      <TickTape
        min={0}
        max={100}
        majorEvery={10}
        value={volume}
        onValueChange={setVolume}
        aria-label="Volume"
        className="w-full text-sky-500"
        tickClassName="bg-sky-500 data-[side=after]:bg-muted-foreground/20"
        glowClassName="bg-sky-100"
        labelClassName="data-[side=after]:opacity-30"
      />
    </div>
  )
}
