"use client"

import * as React from "react"

import { TactileButton } from "@/registry/new-york/ui/tactile-button"

// A latched-key demo: `pressed` is controlled, so toggling a step leaves the
// key held down (and lit) until you toggle it back. The momentary press feel
// still plays on top while you click. Cap colors are the consumer's — an
// active step glows amber, an idle one is dark.
const ACTIVE = {
  "--key-face": "#f59e0b",
  "--key-highlight": "#fde68a",
  "--key-press": "#7c2d12",
} as React.CSSProperties

const IDLE = {
  "--key-face": "#2b2b2b",
  "--key-highlight": "#4a4a4a",
} as React.CSSProperties

const STEPS = 8

export function TactileButtonSequencerDemo() {
  const [steps, setSteps] = React.useState<boolean[]>(() =>
    Array.from({ length: STEPS }, (_, i) => i % 3 === 0),
  )

  return (
    <div className="flex flex-col items-center gap-5 text-[11px]">
      {/* Each step sits in its own near-black housing — the recessed slot the
          key casts its shadow onto. */}
      <div className="flex gap-3">
        {steps.map((on, i) => (
          <div
            key={i}
            className="inline-flex items-center justify-center rounded-[5px] bg-[#171717] p-[3px]"
          >
            <TactileButton
              pressed={on}
              style={on ? ACTIVE : IDLE}
              aria-label={`Step ${i + 1}`}
              onClick={() =>
                setSteps((prev) => prev.map((v, j) => (j === i ? !v : v)))
              }
            >
              <span className="text-[1.1em] font-semibold text-white/90">
                {i + 1}
              </span>
            </TactileButton>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Toggle steps — an active key stays depressed via the controlled{" "}
        <code>pressed</code> prop.
      </p>
    </div>
  )
}
