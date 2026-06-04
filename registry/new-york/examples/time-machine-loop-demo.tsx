"use client"

import * as React from "react"
import { TimeMachine } from "@/registry/new-york/ui/time-machine"

const IMAGES = [
  "photo-1501785888041-af3ef285b470", // lake & peaks
  "photo-1469474968028-56623f02e42e", // valley sunburst
  "photo-1470071459604-3b5ec3a7fe05", // foggy hills
  "photo-1447752875215-b2761acb3c5d", // forest light
  "photo-1433086966358-54859d0ed716", // waterfall
].map(
  (id) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&h=400&q=80`,
)

export function TimeMachineLoopDemo() {
  // Uncontrolled (no `activeIndex`) so the component owns the index and `loop`
  // governs wrapping; we just mirror it for the caption.
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
        loop
        defaultIndex={0}
        onIndexChange={setIndex}
        className="h-[300px] w-full"
      />
      <p className="text-xs text-muted-foreground tabular-nums">
        Scroll over it — or press ← → — {index + 1} / {IMAGES.length}, wrapping
        past either end
      </p>
    </div>
  )
}
