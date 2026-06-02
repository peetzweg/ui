"use client"

import * as React from "react"
import { TimeMachine } from "@/registry/new-york/ui/time-machine"
import { Button } from "@/registry/new-york/ui/button"
import { cn } from "@/lib/utils"

const CARDS = [
  { gradient: "from-indigo-500 to-fuchsia-600", last4: "4242" },
  { gradient: "from-rose-500 to-orange-500", last4: "1881" },
  { gradient: "from-emerald-500 to-teal-600", last4: "0573" },
  { gradient: "from-slate-700 to-slate-900", last4: "9921" },
]

// A fully consumer-owned frame: gradient, border, chip, type — TimeMachine
// never sees any of this, it only stacks and cycles whatever you hand it.
function CreditCard({
  gradient,
  last4,
  vertical,
}: {
  gradient: string
  last4: string
  vertical?: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-2xl border border-white/20 bg-gradient-to-br p-4 text-white shadow-xl",
        gradient,
        vertical ? "aspect-[1/1.586] w-44" : "aspect-[1.586/1] w-80",
      )}
    >
      <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] opacity-80">
        <span>peetzweg/ui</span>
        <span>credit</span>
      </div>
      <div className="h-6 w-9 rounded-md bg-white/30" />
      <div className="font-mono text-sm tracking-[0.15em]">•••• {last4}</div>
    </div>
  )
}

/** Same stack, two different aspect ratios — the frame shape is entirely yours. */
export function TimeMachineCards() {
  const [index, setIndex] = React.useState(0)

  const horizontal = CARDS.map((c, i) => <CreditCard key={i} {...c} />)
  const vertical = CARDS.map((c, i) => <CreditCard key={i} {...c} vertical />)

  return (
    <div className="preview flex flex-col items-center gap-6 rounded-lg border border-border bg-background p-8">
      <div className="flex flex-wrap items-center justify-center gap-12">
        <div className="flex flex-col items-center gap-2">
          <TimeMachine
            items={horizontal}
            driver="controlled"
            activeIndex={index}
            onIndexChange={setIndex}
            frameOffset={-22}
            className="h-[240px] w-[360px]"
          />
          <code className="text-[11px] text-muted-foreground">1.586 / 1 — horizontal</code>
        </div>
        <div className="flex flex-col items-center gap-2">
          <TimeMachine
            items={vertical}
            driver="controlled"
            activeIndex={index}
            onIndexChange={setIndex}
            frameOffset={-22}
            className="h-[320px] w-[240px]"
          />
          <code className="text-[11px] text-muted-foreground">1 / 1.586 — vertical</code>
        </div>
      </div>
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
          {index + 1} / {CARDS.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIndex((i) => Math.min(CARDS.length - 1, i + 1))}
          disabled={index === CARDS.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
