import { Button } from "@/registry/new-york/ui/button"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import * as React from "react"

/**
 * Per-state configuration. Each state owns its content, optional className
 * overrides, interactivity, and click handler — fully orthogonal.
 */
export interface MultiStateButtonStateConfig {
  /** node rendered inside the button — plain text, label + icon, or any JSX */
  content: React.ReactNode
  /** extra classes merged onto the outer button for this state */
  className?: string
  /**
   * Whether the button is disabled in this state. Defaults to `true` — the
   * caller must explicitly opt a state into being interactive. This makes
   * the generic component safe by default (multi-state buttons are usually
   * only clickable in 1–2 of their states).
   */
  disabled?: boolean
  /**
   * Click handler. Receives the native event so the caller can call
   * `e.preventDefault()` themselves if needed (e.g. to suppress a
   * surrounding `<form>` submission for non-"submit-intent" states).
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export interface MultiStateButtonProps<TKey extends string> {
  state: TKey
  states: Record<TKey, MultiStateButtonStateConfig>
  /** extra classes merged onto the outer button regardless of state */
  className?: string
  type?: "button" | "submit" | "reset"
}

const NON_INTERACTIVE =
  "disabled:cursor-not-allowed disabled:pointer-events-auto"
const KEEP_OPACITY = "disabled:opacity-100"

const TRANSITION = {
  type: "spring",
  stiffness: 500,
  damping: 40,
  mass: 0.8,
} as const

const BUTTON_HEIGHT_PX = 36

const MotionButton = motion.create(Button)

/**
 * Multi-state animated button. Renders one of an arbitrary set of caller-
 * defined visual states with a slot-machine / vertical-wheel transition
 * between them. No domain assumptions — the caller owns the state union,
 * the content of each state, and which states are interactive.
 *
 * For the transaction-submission preset (signing/broadcasting/bestBlock/
 * finalized/failed with sensible defaults), use `TransactionButton`.
 */
export function MultiStateButton<TKey extends string>({
  state,
  states,
  className,
  type = "button",
}: MultiStateButtonProps<TKey>) {
  const reduce = useReducedMotion()
  const stateConfig = states[state]

  // Generic default: disabled unless the caller explicitly says otherwise.
  const isDisabled = stateConfig.disabled ?? true
  const isInteractive = !isDisabled

  const stateClick = stateConfig.onClick

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!stateClick) return
    stateClick(e)
  }

  return (
    <MotionButton
      layout={!reduce}
      transition={TRANSITION}
      disabled={isDisabled}
      onClick={isInteractive ? handleClick : undefined}
      size="sm"
      type={type}
      style={{ height: BUTTON_HEIGHT_PX }}
      className={cn(
        // CSS transition-all from the shadcn Button cva fights motion's
        // `layout` (transform: scaleX) animation, causing the text inside
        // to stretch. Restrict CSS transitions to colors only — motion
        // owns everything transform-related.
        "relative overflow-hidden transition-colors",
        !isInteractive && NON_INTERACTIVE,
        KEEP_OPACITY,
        stateConfig.className,
        className,
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={state}
          layout="position"
          initial={
            reduce
              ? { opacity: 0 }
              : { opacity: 0, y: "100%", filter: "blur(4px)" }
          }
          animate={
            reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }
          }
          exit={
            reduce
              ? { opacity: 0 }
              : { opacity: 0, y: "-100%", filter: "blur(4px)" }
          }
          transition={TRANSITION}
          className="inline-flex items-center gap-2 whitespace-nowrap"
        >
          {stateConfig.content}
        </motion.span>
      </AnimatePresence>
    </MotionButton>
  )
}
