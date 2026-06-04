"use client"

import * as React from "react"
import { TimeMachine } from "@/registry/new-york/ui/time-machine"

const IMAGES = [
  "photo-1472214103451-9374bd1c798e", // golden field
  "photo-1465146344425-f00d5f5c8f07", // flowers
  "photo-1447752875215-b2761acb3c5d", // forest light
  "photo-1469474968028-56623f02e42e", // valley sunburst
].map(
  (id) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&h=400&q=80`,
)

export function TimeMachineScrollDemo() {
  // Uncontrolled — the component owns the index; we mirror it for the caption.
  const [index, setIndex] = React.useState(0)

  const frames = IMAGES.map((src, i) => (
    <div
      key={i}
      className="h-48 w-72 overflow-hidden rounded-lg border-2 border-white bg-white shadow-xl"
    >
      <img src={src} alt="" className="h-full w-full object-cover" />
    </div>
  ))

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <TimeMachine
        items={frames}
        driver="scroll"
        defaultIndex={0}
        onIndexChange={setIndex}
        className="h-[300px] w-full"
      />
      <p className="text-xs text-muted-foreground tabular-nums">
        Scroll over it to scrub — {index + 1} / {IMAGES.length}, clamping at the
        ends
      </p>
    </div>
  )
}
