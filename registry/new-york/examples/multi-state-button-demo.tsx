"use client"

import * as React from "react"
import { CheckCircle, LoaderCircle, XCircle } from "lucide-react"
import { MultiStateButton } from "@/registry/new-york/ui/multi-state-button"

type DemoState = "idle" | "loading" | "success" | "error"

export function MultiStateButtonDemo() {
  const [state, setState] = React.useState<DemoState>("idle")
  const reset = () => setState("idle")
  const run = () => {
    setState("loading")
    setTimeout(
      () => setState(Math.random() > 0.5 ? "success" : "error"),
      1100,
    )
  }
  return (
    <MultiStateButton<DemoState>
      state={state}
      states={{
        idle: {
          content: "Run job",
          disabled: false,
          onClick: run,
        },
        loading: {
          content: (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              <span>Working…</span>
            </>
          ),
          className:
            "bg-foreground/10 text-foreground/80 border border-foreground/20 hover:bg-foreground/10 font-normal",
        },
        success: {
          content: (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Done — reset</span>
            </>
          ),
          className:
            "bg-green-600 text-white border border-green-500 hover:bg-green-600 font-normal",
          disabled: false,
          onClick: reset,
        },
        error: {
          content: (
            <>
              <XCircle className="h-4 w-4" />
              <span>Retry</span>
            </>
          ),
          className:
            "bg-red-600 text-white border border-red-500 hover:bg-red-600 font-normal",
          disabled: false,
          onClick: reset,
        },
      }}
    />
  )
}
