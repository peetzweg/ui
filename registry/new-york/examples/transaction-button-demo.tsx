"use client"

import * as React from "react"
import {
  TransactionButton,
  type TransactionButtonState,
} from "@/registry/new-york/ui/transaction-button"

const HAPPY_PATH: TransactionButtonState[] = [
  "signing",
  "broadcasting",
  "bestBlock",
  "finalized",
]

const FAILURE_PATH: TransactionButtonState[] = [
  "signing",
  "broadcasting",
  "failed",
]

export function TransactionButtonDemo() {
  const [state, setState] = React.useState<TransactionButtonState>("ready")
  const [shouldFail, setShouldFail] = React.useState(false)
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = React.useCallback(() => {
    for (const t of timers.current) clearTimeout(t)
    timers.current = []
  }, [])

  const run = React.useCallback(() => {
    const path = shouldFail ? FAILURE_PATH : HAPPY_PATH
    clearTimers()
    path.forEach((s, i) => {
      const t = setTimeout(() => setState(s), 1000 * (i + 1))
      timers.current.push(t)
    })
    // Auto-reset to "ready" 2 s after a terminal state so the demo loops.
    const settle = setTimeout(
      () => setState("ready"),
      1000 * (path.length + 2),
    )
    timers.current.push(settle)
  }, [clearTimers, shouldFail])

  React.useEffect(() => clearTimers, [clearTimers])

  return (
    <div className="flex flex-col items-center gap-3">
      <TransactionButton
        state={state}
        states={{ ready: { content: "Sign & Submit", onClick: run } }}
      />
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={shouldFail}
          onChange={(e) => setShouldFail(e.target.checked)}
          className="h-3 w-3"
        />
        Simulate failure
      </label>
    </div>
  )
}
