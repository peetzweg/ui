"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, MessageCircle } from "lucide-react"

import { MorphSurface } from "@/registry/new-york/ui/morph-surface"
import { cn } from "@/lib/utils"

// The icon travels between the trigger and the form header as the surface
// morphs; a shared `layoutId` is all motion needs to tween it across states.
const ICON_ID = "morph-surface-icon"
const ICON_SPRING = { type: "spring" as const, stiffness: 350, damping: 35 }

export function MorphSurfaceDemo() {
  const [open, setOpen] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  function openAndFocus() {
    setOpen(true)
    window.setTimeout(() => textareaRef.current?.focus())
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setOpen(false)
    setSuccess(true)
    window.setTimeout(() => setSuccess(false), 1500)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && event.metaKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <MorphSurface
      open={open}
      onOpenChange={setOpen}
      className="border border-border bg-popover text-popover-foreground shadow-lg"
      // The whole pill is the trigger; it closes on click-outside / Escape.
      // While open the trigger renders nothing — the icon has migrated into
      // the form header.
      collapsed={({ open }) =>
        open ? null : (
          <button
            type="button"
            onClick={openAndFocus}
            className="flex h-[44px] select-none items-center gap-2 whitespace-nowrap px-4 text-sm font-medium"
          >
            <motion.span
              layoutId={ICON_ID}
              transition={ICON_SPRING}
              className="relative grid size-5 place-items-center text-primary"
            >
              <MessageCircle
                className={cn("size-5 transition-opacity", success && "opacity-0")}
              />
              <AnimatePresence>
                {success && (
                  <motion.span
                    className="absolute inset-0 grid place-items-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ ...ICON_SPRING, delay: 0.2 }}
                  >
                    <Check className="size-4" strokeWidth={2.5} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.span>
            Feedback
          </button>
        )
      }
      expanded={
        <form onSubmit={onSubmit} className="flex h-full flex-col p-1">
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <motion.span
                layoutId={ICON_ID}
                transition={ICON_SPRING}
                className="grid size-4 place-items-center text-primary"
              >
                <MessageCircle className="size-4" />
              </motion.span>
              Feedback
            </span>
            <button
              type="submit"
              className="flex items-center gap-1 text-sm text-muted-foreground"
            >
              <Kbd>⌘</Kbd>
              <Kbd>Enter</Kbd>
            </button>
          </div>
          <textarea
            ref={textareaRef}
            name="message"
            placeholder="What's on your mind?"
            required
            spellCheck={false}
            onKeyDown={onKeyDown}
            className="size-full resize-none rounded-lg bg-muted p-4 text-base caret-primary outline-none"
          />
        </form>
      }
    />
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="flex h-6 min-w-6 items-center justify-center rounded-md bg-muted px-1.5 font-sans text-xs text-muted-foreground">
      {children}
    </kbd>
  )
}
