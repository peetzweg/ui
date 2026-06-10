"use client"

import * as React from "react"

import { TickTape } from "@/registry/new-york/ui/tick-tape"

// The `indicator` slot replaces the default triangle. The TickTape root is
// position: relative, so an absolutely-positioned element in the slot can
// draw across the tape itself — here a needle through the ticks, plus an
// in-flow dot below.
export function TickTapeNeedleDemo() {
  const [length, setLength] = React.useState(12)

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <span className="text-4xl font-semibold tabular-nums tracking-tight">
        {length}
        <span className="ml-1 text-xl text-muted-foreground">cm</span>
      </span>
      <TickTape
        min={0}
        max={30}
        majorEvery={5}
        value={length}
        onValueChange={setLength}
        aria-label="Length in centimeters"
        className="w-full"
        indicator={
          <>
            <span className="absolute left-1/2 top-6 h-7 w-px -translate-x-1/2 bg-red-500" />
            <span className="size-1.5 rounded-full bg-red-500" />
          </>
        }
      />
    </div>
  )
}
