"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Star } from "lucide-react"

import { MorphSurface } from "@/registry/new-york/ui/morph-surface"
import { cn } from "@/lib/utils"

const SCORES = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
const SPRING = { type: "spring" as const, stiffness: 400, damping: 32 }

// The picked number travels between the column and the trigger.
const scoreId = (n: number) => `score-${n}`

export function MorphSurfaceScoreDemo() {
  const [open, setOpen] = React.useState(false)
  const [score, setScore] = React.useState<number | null>(null)

  function pick(n: number) {
    setScore(n)
    setOpen(false)
  }

  return (
    <MorphSurface
      open={open}
      onOpenChange={setOpen}
      // Width stays constant, only height morphs — a vertical unfurl. The
      // surface grows upward from its bottom anchor, so the column stacks
      // above the trigger.
      collapsedWidth={44}
      collapsedHeight={44}
      collapsedRadius={22}
      expandedWidth={44}
      expandedHeight={320}
      expandedRadius={22}
      className="bg-popover text-popover-foreground shadow-lg ring-1 ring-border"
      collapsed={({ open }) =>
        open ? null : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={score ? `Score: ${score}` : "Rate"}
            className="flex h-11 w-full items-center justify-center"
          >
            {score !== null ? (
              <motion.span
                layoutId={scoreId(score)}
                transition={SPRING}
                className="text-base font-semibold tabular-nums"
              >
                {score}
              </motion.span>
            ) : (
              <Star className="size-5 text-muted-foreground" />
            )}
          </button>
        )
      }
      expanded={
        <div className="flex h-full flex-col items-center justify-center">
          {SCORES.map((n) => (
            <motion.button
              key={n}
              type="button"
              layoutId={scoreId(n)}
              transition={SPRING}
              onClick={() => pick(n)}
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-sm font-medium tabular-nums transition-colors",
                n === score
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {n}
            </motion.button>
          ))}
        </div>
      }
    />
  )
}
