"use client"

import { Minus, Plus } from "lucide-react"

import { TactileButton } from "@/registry/new-york/ui/tactile-button"

// The colors are the consumer's: each key sets its cap surface through the
// `--key-*` custom properties. These three tones recreate the EP-133 keypad —
// light "function" keys, the red RECORD, and the dark PLAY.
const LIGHT = {
  "--key-face": "#c7c3c0",
  "--key-highlight": "#ffffff",
} as React.CSSProperties

const RECORD = {
  "--key-face": "#d42a02",
  "--key-highlight": "#fb702c",
} as React.CSSProperties

const DARK = {
  "--key-face": "#545251",
  "--key-highlight": "#a8a6a4",
} as React.CSSProperties

// Each key is set into its own near-black housing (`.btn` in the original) —
// a recessed slot the key sits in and casts its shadow onto. Appearance lives
// in the showcase, so the housing wraps the headless key here. The tight frame
// and the sharper housing radius (5px) against the rounder key (10px) are core
// to the look: the square-ish slot peeks past the key at each corner.
function Housing({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center justify-center rounded-[5px] bg-[#171717] p-[3px]">
      {children}
    </div>
  )
}

export function TactileButtonDemo() {
  return (
    // `font-size` scales the whole keypad — the keys default to `5.7em`.
    <div className="flex flex-col items-center gap-5 text-[16px]">
      <div className="flex flex-col gap-[1.5em]">
        <div className="flex gap-[1.5em]">
          <Housing>
            <TactileButton style={LIGHT} aria-label="Decrement">
              <Minus className="size-6 text-[#5f5f5f]" strokeWidth={2.5} />
            </TactileButton>
          </Housing>
          <Housing>
            <TactileButton style={LIGHT} aria-label="Increment">
              <Plus className="size-6 text-[#5f5f5f]" strokeWidth={2.5} />
            </TactileButton>
          </Housing>
        </div>
        <div className="flex gap-[1.5em]">
          <Housing>
            <TactileButton style={RECORD}>
              <span className="self-start pt-[0.9em] text-[0.85em] font-medium tracking-wider text-white">
                RECORD
              </span>
            </TactileButton>
          </Housing>
          <Housing>
            <TactileButton style={DARK}>
              <span className="self-start pt-[0.9em] text-[0.85em] font-medium tracking-wider text-white">
                PLAY
              </span>
            </TactileButton>
          </Housing>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Teenage Engineering [EP-133 K.O. II] — Buttons
      </p>
    </div>
  )
}
