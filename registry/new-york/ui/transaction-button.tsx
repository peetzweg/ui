import {
  MultiStateButton,
} from "@/registry/new-york/ui/multi-state-button"
import type { MultiStateButtonStateConfig } from "@/registry/new-york/ui/multi-state-button"
import { cn } from "@/lib/utils"
import { CheckCircle, LoaderCircle, XCircle } from "lucide-react"
import * as React from "react"

/**
 * Transaction-submission preset over `MultiStateButton`.
 *
 * Provides:
 *   - The 7-state union covering a typical extrinsic submission lifecycle
 *     (idle / ready / signing / broadcasting / bestBlock / finalized / failed).
 *   - Default content + colour palette per state.
 *   - A "ready" state that submits the surrounding form via `type="submit"`,
 *     and `preventDefault` on non-"ready" clicks so terminal-state click
 *     handlers (e.g. open block in explorer) don't re-submit the form.
 *
 * Everything is overridable per state via `states[state].{content,className,
 * disabled,onClick}`. For non-transactional UIs, drop down to
 * `MultiStateButton` directly.
 */

export type TransactionButtonState =
  | "idle"
  | "ready"
  | "signing"
  | "broadcasting"
  | "bestBlock"
  | "finalized"
  | "failed"

export interface TransactionButtonStateConfig {
  content?: React.ReactNode
  className?: string
  /** Defaults: `false` for "ready", `true` for every other state. */
  disabled?: boolean
  /**
   * Click handler. For "ready" the form submits naturally on click; for any
   * other state the preset auto-calls `preventDefault()` first so the click
   * doesn't bubble into a `<form>` submit.
   */
  onClick?: () => void
}

export interface TransactionButtonProps {
  state: TransactionButtonState
  states?: Partial<Record<TransactionButtonState, TransactionButtonStateConfig>>
  className?: string
  type?: "button" | "submit" | "reset"
}

const Spinner = () => <LoaderCircle className="h-4 w-4 animate-spin" />

const DEFAULT_CONTENT: Record<TransactionButtonState, React.ReactNode> = {
  idle: <span>Submit</span>,
  ready: <span>Submit</span>,
  signing: (
    <>
      <Spinner />
      <span>Signing…</span>
    </>
  ),
  broadcasting: (
    <>
      <Spinner />
      <span>Broadcasting…</span>
    </>
  ),
  bestBlock: (
    <>
      <Spinner />
      <span>In best block…</span>
    </>
  ),
  finalized: (
    <>
      <CheckCircle className="h-4 w-4" />
      <span>Finalized</span>
    </>
  ),
  failed: (
    <>
      <XCircle className="h-4 w-4" />
      <span>Failed</span>
    </>
  ),
}

// All non-"ready" states render in regular weight — the icons + status feel
// read more like a status badge than a primary call-to-action.
const STATE_CLASSES: Record<TransactionButtonState, string> = {
  idle: "bg-muted text-muted-foreground border border-border font-normal",
  ready: "",
  signing:
    "bg-foreground/10 text-foreground/80 border border-foreground/20 hover:bg-foreground/10 font-normal",
  broadcasting:
    "bg-foreground/10 text-foreground/80 border border-foreground/20 hover:bg-foreground/10 font-normal",
  bestBlock:
    "bg-blue-600 text-white border border-blue-500 hover:bg-blue-600 animate-pulse font-normal",
  finalized:
    "bg-green-600 text-white border border-green-500 hover:bg-green-600 font-normal",
  failed:
    "bg-red-600 text-white border border-red-500 hover:bg-red-600 font-normal",
}

const DEFAULT_DISABLED: Record<TransactionButtonState, boolean> = {
  idle: true,
  ready: false,
  signing: true,
  broadcasting: true,
  bestBlock: true,
  finalized: true,
  failed: true,
}

const TX_STATES: TransactionButtonState[] = [
  "idle",
  "ready",
  "signing",
  "broadcasting",
  "bestBlock",
  "finalized",
  "failed",
]

export function TransactionButton({
  state,
  states,
  className,
  type = "button",
}: TransactionButtonProps) {
  // Merge each state's defaults with the caller overrides and adapt the
  // onClick signature: callers pass `() => void`; MultiStateButton wants
  // `(e: MouseEvent) => void`. For non-"ready" states we auto-suppress form
  // submission so terminal-state click handlers (e.g. open explorer) don't
  // re-submit the surrounding form.
  const merged = React.useMemo(() => {
    const out = {} as Record<
      TransactionButtonState,
      MultiStateButtonStateConfig
    >
    for (const key of TX_STATES) {
      const user = states?.[key]
      const userOnClick = user?.onClick
      const wrappedOnClick: MultiStateButtonStateConfig["onClick"] | undefined =
        userOnClick
          ? (e) => {
              if (key !== "ready") e.preventDefault()
              userOnClick()
            }
          : undefined

      // Idle-state content falls back to the caller-supplied "ready"
      // content (same label, just muted) before the built-in default.
      const fallbackContent =
        key === "idle"
          ? (states?.ready?.content ?? DEFAULT_CONTENT.idle)
          : DEFAULT_CONTENT[key]

      out[key] = {
        content: user?.content ?? fallbackContent,
        className: cn(STATE_CLASSES[key], user?.className),
        disabled: user?.disabled ?? DEFAULT_DISABLED[key],
        onClick: wrappedOnClick,
      }
    }
    return out
  }, [states])

  return (
    <MultiStateButton<TransactionButtonState>
      state={state}
      states={merged}
      className={className}
      type={type}
    />
  )
}
