import type { ComponentType } from "react"
import { MultiStateButtonDemo } from "@/registry/new-york/examples/multi-state-button-demo"
import { TransactionButtonDemo } from "@/registry/new-york/examples/transaction-button-demo"

export type ShowcaseItem = {
  /** Anchor id — README deep-links to `#${id}`. */
  id: string
  title: string
  description: string
  /** The `shadcn add` address for this item. */
  install: string
  Demo: ComponentType
}

// Add a component: drop its entry here + an example under registry/new-york/examples.
export const components: ShowcaseItem[] = [
  {
    id: "multi-state-button",
    title: "MultiStateButton",
    description:
      "Generic multi-state animated button. Slot-machine label transitions; bring your own state union.",
    install: "pnpm dlx shadcn@latest add peetzweg/ui/multi-state-button",
    Demo: MultiStateButtonDemo,
  },
  {
    id: "transaction-button",
    title: "TransactionButton",
    description:
      "Seven-state transaction-submission preset over MultiStateButton. Idle → ready → signing → broadcasting → bestBlock → finalized / failed.",
    install: "pnpm dlx shadcn@latest add peetzweg/ui/transaction-button",
    Demo: TransactionButtonDemo,
  },
]
