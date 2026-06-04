"use client"

import * as React from "react"
import { motion } from "motion/react"
import {
  Flame,
  Frown,
  Heart,
  Laugh,
  PartyPopper,
  Smile,
  ThumbsUp,
} from "lucide-react"

import { MorphSurface } from "@/registry/new-york/ui/morph-surface"

// Icons, not emoji — emoji glyphs sit off-centre in their line box (font
// baseline + advance width), which reads as misaligned in a round trigger.
const REACTIONS = [
  { id: "like", Icon: ThumbsUp },
  { id: "love", Icon: Heart },
  { id: "haha", Icon: Laugh },
  { id: "party", Icon: PartyPopper },
  { id: "fire", Icon: Flame },
  { id: "sad", Icon: Frown },
]

const SPRING = { type: "spring" as const, stiffness: 400, damping: 32 }

// Each reaction's `layoutId` keys off its id, so the one you pick is the one
// that travels between the tray and the trigger.
const reactionId = (id: string) => `reaction-${id}`

export function MorphSurfaceReactionsDemo() {
  const [open, setOpen] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const selected = REACTIONS.find((r) => r.id === selectedId) ?? null

  function pick(id: string) {
    setSelectedId(id)
    setOpen(false)
  }

  return (
    <MorphSurface
      open={open}
      onOpenChange={setOpen}
      // Height stays constant, only width morphs — a pure horizontal unfurl.
      collapsedWidth={48}
      collapsedHeight={48}
      collapsedRadius={24}
      expandedWidth={236}
      expandedHeight={48}
      expandedRadius={24}
      // A ring instead of a border, so it doesn't eat 2px off the box and
      // throw the centred content off.
      className="bg-popover text-popover-foreground shadow-lg ring-1 ring-border"
      // Nothing in the trigger stays visible while open — the picked icon has
      // migrated into the tray.
      collapsed={({ open }) =>
        open ? null : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Add reaction"
            className="flex h-12 w-full items-center justify-center text-muted-foreground"
          >
            {selected ? (
              <motion.span
                layoutId={reactionId(selected.id)}
                transition={SPRING}
                className="text-foreground"
              >
                <selected.Icon className="size-5" />
              </motion.span>
            ) : (
              <Smile className="size-5" />
            )}
          </button>
        )
      }
      expanded={
        <div className="flex h-full items-center justify-center">
          {REACTIONS.map(({ id, Icon }) => (
            <motion.button
              key={id}
              type="button"
              layoutId={reactionId(id)}
              transition={SPRING}
              onClick={() => pick(id)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Icon className="size-5" />
            </motion.button>
          ))}
        </div>
      }
    />
  )
}
