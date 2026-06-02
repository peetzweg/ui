"use client"

import * as React from "react"
import { TimeMachine } from "@/registry/new-york/ui/time-machine"
import { Button } from "@/registry/new-york/ui/button"

const IMAGES = [
  "tahoe",
  "fjord",
  "dunes",
  "canyon",
  "harbor",
  "aurora",
  "meadow",
].map((seed) => `https://picsum.photos/seed/${seed}/600/400`)

export function TimeMachineDemo() {
  const [index, setIndex] = React.useState(0)

  // You own each frame's appearance — here, a rounded, bordered image card.
  const frames = IMAGES.map((src, i) => (
    <div
      key={i}
      className="h-48 w-72 overflow-hidden rounded-xl border bg-card shadow-lg"
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
