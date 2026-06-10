"use client"

import * as React from "react"

import { TickTape } from "@/registry/new-york/ui/tick-tape"

export function TickTapeDemo() {
  const [value, setValue] = React.useState(50)

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5">
      <span className="text-4xl font-semibold tabular-nums tracking-tight">
        {value}
        <span className="ml-1 text-xl text-muted-foreground">%</span>
      </span>
      <TickTape
        min={0}
        max={100}
        majorEvery={10}
        value={value}
        onValueChange={setValue}
        aria-label="Percentage"
        className="w-full text-primary"
      />
    </div>
  )
}
