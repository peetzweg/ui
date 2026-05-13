import * as React from "react"
import { MultiStateButtonDemo } from "@/registry/new-york/examples/multi-state-button-demo"
import { TransactionButtonDemo } from "@/registry/new-york/examples/transaction-button-demo"

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">peet/ui</h1>
        <p className="text-muted-foreground">
          A small shadcn-compatible registry of animated, motion-based
          primitives.
        </p>
        <p className="text-muted-foreground text-sm pt-2">
          Install any component with:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
            pnpm dlx shadcn@latest add &lt;url&gt;
          </code>
        </p>
      </header>
      <main className="flex flex-col flex-1 gap-8">
        <section className="flex flex-col gap-4 border rounded-lg p-4 min-h-[280px] relative">
          <div className="flex flex-col">
            <h2 className="text-base font-semibold">MultiStateButton</h2>
            <p className="text-sm text-muted-foreground">
              Generic multi-state animated button. Slot-machine label
              transitions; bring your own state union.
            </p>
          </div>
          <div className="flex items-center justify-center min-h-[160px] relative">
            <MultiStateButtonDemo />
          </div>
        </section>

        <section className="flex flex-col gap-4 border rounded-lg p-4 min-h-[280px] relative">
          <div className="flex flex-col">
            <h2 className="text-base font-semibold">TransactionButton</h2>
            <p className="text-sm text-muted-foreground">
              Seven-state transaction-submission preset over MultiStateButton.
              Idle → ready → signing → broadcasting → bestBlock → finalized /
              failed.
            </p>
          </div>
          <div className="flex items-center justify-center min-h-[160px] relative">
            <TransactionButtonDemo />
          </div>
        </section>
      </main>
    </div>
  )
}
