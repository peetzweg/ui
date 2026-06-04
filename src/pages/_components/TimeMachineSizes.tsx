"use client"

import { TimeMachine } from "@/registry/new-york/ui/time-machine"

const IMAGES = [
  "photo-1506905925346-21bda4d32df4", // mountain ridge
  "photo-1441974231531-c6227db76b6e", // forest road
  "photo-1470071459604-3b5ec3a7fe05", // foggy hills
  "photo-1433086966358-54859d0ed716", // waterfall
  "photo-1501785888041-af3ef285b470", // lake & peaks
].map(
  (id) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&h=400&q=80`,
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
              frameClassName={`${size} overflow-hidden rounded-lg border-2 border-white bg-white shadow-xl`}
              className="h-full w-full"
            />
          </div>
          <code className="text-[11px] text-muted-foreground">{size}</code>
        </div>
      ))}
    </div>
  )
}
