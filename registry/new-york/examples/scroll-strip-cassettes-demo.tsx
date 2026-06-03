"use client"

import { ScrollStrip } from "@/registry/new-york/ui/scroll-strip"
import { cn } from "@/lib/utils"

interface Tape {
  title: string
  year: string
  stripe: string
}

const TAPES: Tape[] = [
  { title: "Road Trip '94", year: "1994", stripe: "bg-orange-500" },
  { title: "Slow Dance", year: "1987", stripe: "bg-rose-500" },
  { title: "Bedroom Demos", year: "1991", stripe: "bg-emerald-500" },
  { title: "Night Drive", year: "1989", stripe: "bg-sky-500" },
  { title: "Summer Static", year: "1996", stripe: "bg-amber-400" },
  { title: "Basement Tapes", year: "1992", stripe: "bg-violet-500" },
  { title: "Dial Tone Dreams", year: "1998", stripe: "bg-teal-400" },
]

function Reel({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full border-4 border-dashed border-zinc-300/90 bg-zinc-800",
        active && "animate-spin [animation-duration:3s]",
      )}
    >
      <div className="h-3 w-3 rounded-full bg-zinc-300/90" />
    </div>
  )
}

/**
 * Vertical orientation: the collapsed sliver is a horizontal strip, so the
 * tape's edge label reads naturally without expanding — like a drawer of
 * cassettes. Expanding reveals the full face, reels spinning.
 */
function Cassette({ tape, active }: { tape: Tape; active: boolean }) {
  return (
    <div className="relative h-full w-full bg-zinc-900 text-zinc-100">
      {/* edge label — readable in the collapsed sliver */}
      <div
        className={cn(
          "absolute inset-0 flex items-center transition-opacity duration-300",
          active ? "opacity-0" : "opacity-100",
        )}
      >
        <div className="flex w-full items-center justify-between px-4">
          <span className="text-[11px] font-medium tracking-[0.15em] uppercase">
            {tape.title}
          </span>
          <span className={cn("h-1.5 w-10 rounded-full", tape.stripe)} />
        </div>
      </div>
      {/* face — label card + reel window */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col gap-2.5 p-3.5 transition-opacity delay-100 duration-300",
          active ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="rounded-sm bg-zinc-100 px-3 py-2 text-zinc-900">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold tracking-wide">
              {tape.title}
            </span>
            <span className="text-[10px] tabular-nums opacity-60">
              {tape.year}
            </span>
          </div>
          <div className={cn("mt-1.5 h-1.5 rounded-full", tape.stripe)} />
          <div className="mt-1 h-1.5 rounded-full bg-zinc-300" />
        </div>
        <div className="mx-auto flex w-4/5 flex-1 items-center justify-between rounded-lg bg-zinc-950/80 px-5">
          <Reel active={active} />
          <span className="text-[9px] tracking-[0.3em] uppercase opacity-50">
            Side A
          </span>
          <Reel active={active} />
        </div>
      </div>
    </div>
  )
}

export function ScrollStripCassettesDemo() {
  return (
    <ScrollStrip
      orientation="vertical"
      items={TAPES.map((tape) => ({ active }: { active: boolean }) => (
        <Cassette tape={tape} active={active} />
      ))}
      // Cross axis doesn't grow (frameWidth === expandedWidth): the tape's
      // face is revealed purely downwards, like pulling one from a drawer.
      frameWidth={300}
      frameHeight={36}
      expandedWidth={300}
      expandedHeight={190}
      gap={8}
      frameRadius={8}
      frameClassName="shadow-md"
      style={{ height: 420 }}
    />
  )
}
