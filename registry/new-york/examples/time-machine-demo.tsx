"use client"

import * as React from "react"
import { TimeMachine } from "@/registry/new-york/ui/time-machine"
import { Button } from "@/registry/new-york/ui/button"

const IMAGES = [
  "photo-1506905925346-21bda4d32df4", // mountain ridge
  "photo-1441974231531-c6227db76b6e", // forest road
  "photo-1470071459604-3b5ec3a7fe05", // foggy hills
  "photo-1433086966358-54859d0ed716", // waterfall
  "photo-1501785888041-af3ef285b470", // lake & peaks
  "photo-1472214103451-9374bd1c798e", // golden field
  "photo-1465146344425-f00d5f5c8f07", // flowers
].map(
  (id) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&h=400&q=80`,
)

export function TimeMachineDemo() {
  const [index, setIndex] = React.useState(0)

  // You own each frame's appearance — here, a photo-print look: a bright
  // white mat and a soft shadow, rather than a hard border line.
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
        driver="controlled"
        activeIndex={index}
        onIndexChange={setIndex}
        className="h-[300px] w-full"
      />
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          Prev
        </Button>
        <span className="text-xs text-muted-foreground tabular-nums">
          {index + 1} / {IMAGES.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIndex((i) => Math.min(IMAGES.length - 1, i + 1))}
          disabled={index === IMAGES.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
