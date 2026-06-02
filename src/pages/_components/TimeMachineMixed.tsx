"use client"

import * as React from "react"
import { TimeMachine } from "@/registry/new-york/ui/time-machine"
import { Button } from "@/registry/new-york/ui/button"
import { cn } from "@/lib/utils"

function Card({ gradient, last4 }: { gradient: string; last4: string }) {
  return (
    <div
      className={cn(
        "flex aspect-[1/1.586] w-44 flex-col justify-between rounded-2xl border border-white/20 bg-gradient-to-br p-4 text-white shadow-xl",
        gradient,
      )}
    >
      <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] opacity-80">
        <span>peet/ui</span>
        <span>credit</span>
      </div>
      <div className="h-6 w-9 rounded-md bg-white/30" />
      <div className="font-mono text-sm tracking-[0.15em]">•••• {last4}</div>
    </div>
  )
}

// Narrower and taller than the cards, paper-white — a deliberately different
// shape and size living in the same stack.
function Receipt() {
  return (
    <div className="w-36 rounded-sm bg-white p-4 font-mono text-[10px] text-zinc-600 shadow-xl ring-1 ring-black/10">
      <div className="text-center text-xs font-semibold tracking-widest text-zinc-900">
        RECEIPT
      </div>
      <div className="mt-3 space-y-1 border-t border-dashed border-zinc-300 pt-3">
        <div className="flex justify-between">
          <span>Coffee</span>
          <span>4.50</span>
        </div>
        <div className="flex justify-between">
          <span>Croissant</span>
          <span>3.20</span>
        </div>
        <div className="flex justify-between">
          <span>Tip</span>
          <span>1.00</span>
        </div>
      </div>
      <div className="mt-3 flex justify-between border-t border-dashed border-zinc-300 pt-3 font-semibold text-zinc-900">
        <span>TOTAL</span>
        <span>8.70</span>
      </div>
      <div className="mt-4 text-center text-zinc-400">★ thank you ★</div>
    </div>
  )
}

// Heterogeneous frames: three vertical cards and one taller, narrower receipt.
const FRAMES = [
  <Card key="a" gradient="from-indigo-500 to-fuchsia-600" last4="4242" />,
  <Receipt key="b" />,
  <Card key="c" gradient="from-emerald-500 to-teal-600" last4="0573" />,
  <Card key="d" gradient="from-slate-700 to-slate-900" last4="9921" />,
]

export function TimeMachineMixed() {
  const [index, setIndex] = React.useState(0)

  return (
    <div className="preview flex flex-col items-center gap-6 rounded-lg border border-border bg-background p-8">
      <TimeMachine
        items={FRAMES}
        driver="controlled"
        activeIndex={index}
        onIndexChange={setIndex}
        frameOffset={-26}
        className="h-[340px] w-[280px]"
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
          {index + 1} / {FRAMES.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIndex((i) => Math.min(FRAMES.length - 1, i + 1))}
          disabled={index === FRAMES.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
