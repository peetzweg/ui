"use client"

import * as React from "react"

import {
  TimerSurface,
  formatTimerDuration,
} from "@/registry/new-york/ui/timer-surface"

export function TimerSurfaceDemo() {
  const [started, setStarted] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col items-center gap-2">
      <TimerSurface
        defaultMinutes={15}
        maxMinutes={120}
        onStart={(minutes) => setStarted(formatTimerDuration(minutes))}
      />
      <p className="h-5 text-sm text-muted-foreground" aria-live="polite">
        {started ? `Timer started for ${started}` : " "}
      </p>
    </div>
  )
}
