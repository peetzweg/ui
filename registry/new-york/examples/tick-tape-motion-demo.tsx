"use client"

import * as React from "react"

import { TickTape } from "@/registry/new-york/ui/tick-tape"

// Same tape, three motion characters: glow off entirely, the default, and an
// exaggerated trail (wider reach, full glow at low scrub speed, taller
// stretch, looser tape spring). Also shows several tapes coexisting — wheel
// and keys stay scoped to the one you're on.
export function TickTapeMotionDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Row label="No glow">
        <TickTape
          defaultValue={20}
          max={40}
          majorEvery={10}
          glowIntensity={0}
          aria-label="No glow"
        />
      </Row>
      <Row label="Default">
        <TickTape defaultValue={20} max={40} majorEvery={10} aria-label="Default glow" />
      </Row>
      <Row label="Exaggerated">
        <TickTape
          defaultValue={20}
          max={40}
          majorEvery={10}
          glowRadius={140}
          glowVelocity={150}
          glowStretch={1.6}
          spring={{ stiffness: 220, damping: 28 }}
          aria-label="Exaggerated glow"
        />
      </Row>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}
