"use client"

import {
  TransactionButton,
  type TransactionButtonState,
} from "@/registry/new-york/ui/transaction-button"

const STATES: TransactionButtonState[] = [
  "idle",
  "ready",
  "signing",
  "broadcasting",
  "bestBlock",
  "finalized",
  "failed",
]

/** Every lifecycle state rendered at once, using the built-in defaults. */
export function TransactionButtonStates() {
  return (
    <div className="preview flex flex-wrap items-start justify-center gap-x-6 gap-y-4 rounded-lg border border-border bg-background p-8">
      {STATES.map((state) => (
        <div key={state} className="flex flex-col items-center gap-2">
          <TransactionButton state={state} />
          <code className="text-[11px] text-muted-foreground">{state}</code>
        </div>
      ))}
    </div>
  )
}
