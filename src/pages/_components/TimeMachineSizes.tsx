"use client"

import { TimeMachine } from "@/registry/new-york/ui/time-machine"

const IMAGES = ["tahoe", "fjord", "dunes", "canyon", "harbor"].map((seed) => ({
  src: `https://picsum.photos/seed/${seed}/600/400`,
  alt: seed,
}))

const SIZES = [
  { label: "h-40 w-56", className: "h-40 w-56" },
  { label: "h-56 w-80", className: "h-56 w-80" },
  { label: "h-72 w-[28rem]", className: "h-72 w-[28rem]" },
]

/** The same component at three sizes — the recede math is size-independent. */
export function TimeMachineSizes() {
  return (
    <div className="preview flex flex-wrap items-end justify-center gap-8 rounded-lg border border-border bg-background p-8">
      {SIZES.map(({ label, className }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <div className={className}>
            <TimeMachine
              items={IMAGES}
              driver="controlled"
              activeIndex={1}
              className="h-full w-full"
            />
          </div>
          <code className="text-[11px] text-muted-foreground">{label}</code>
        </div>
      ))}
    </div>
  )
}
