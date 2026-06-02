"use client"

import { TimeMachine } from "@/registry/new-york/ui/time-machine"

const IMAGES = ["tahoe", "fjord", "dunes", "canyon", "harbor"].map(
  (seed) => `https://picsum.photos/seed/${seed}/600/400`,
)

// Plain images here — `frameClassName` gives every frame one uniform size/style.
const frames = IMAGES.map((src, i) => (
  <img key={i} src={src} alt="" className="h-full w-full object-cover" />
))

const SIZES = [
  "h-40 w-56",
  "h-56 w-80",
  "h-72 w-[28rem]",
]

/** The same component at three sizes — the recede math is size-independent. */
export function TimeMachineSizes() {
  return (
    <div className="preview flex flex-wrap items-end justify-center gap-8 rounded-lg border border-border bg-background p-8">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <div className={size}>
            <TimeMachine
              items={frames}
              driver="controlled"
              activeIndex={1}
              frameClassName={`${size} overflow-hidden rounded-lg border bg-card`}
              className="h-full w-full"
            />
          </div>
          <code className="text-[11px] text-muted-foreground">{size}</code>
        </div>
      ))}
    </div>
  )
}
