"use client"

import { ScrollStrip } from "@/registry/new-york/ui/scroll-strip"
import { cn } from "@/lib/utils"

interface Card {
  bank: string
  number: string
  holder: string
  expires: string
  gradient: string
}

const CARDS: Card[] = [
  {
    bank: "Aurora",
    number: "4929 1881 7253 0964",
    holder: "P. Zweg",
    expires: "09/27",
    gradient: "from-violet-600 via-purple-600 to-indigo-700",
  },
  {
    bank: "Meridian",
    number: "5412 7534 9821 4410",
    holder: "P. Zweg",
    expires: "01/29",
    gradient: "from-slate-700 via-slate-800 to-black",
  },
  {
    bank: "Solstice",
    number: "4716 0023 6645 1287",
    holder: "P. Zweg",
    expires: "06/28",
    gradient: "from-amber-500 via-orange-600 to-rose-600",
  },
  {
    bank: "Tide",
    number: "5310 9942 0871 6634",
    holder: "P. Zweg",
    expires: "11/26",
    gradient: "from-cyan-500 via-teal-600 to-emerald-700",
  },
  {
    bank: "Crimson",
    number: "4485 2210 5934 7702",
    holder: "P. Zweg",
    expires: "03/30",
    gradient: "from-rose-600 via-red-700 to-rose-950",
  },
  {
    bank: "Polar",
    number: "5161 8364 2299 0518",
    holder: "P. Zweg",
    expires: "08/28",
    gradient: "from-sky-400 via-blue-600 to-indigo-800",
  },
]

/**
 * Collapsed and expanded are different layouts: the collapsed sliver is the
 * card seen edge-on — as if standing in a wallet, vertical brand name
 * readable — and the proper card face (chip, number, holder, expiry) only
 * fades in once active. No cropped-card look; the clip just reveals
 * whichever layer is showing.
 */
function CreditCard({ card, active }: { card: Card; active: boolean }) {
  return (
    <div
      className={cn(
        "relative h-full w-full bg-gradient-to-br text-white",
        card.gradient,
      )}
    >
      {/* edge — slim wallet view, brand name written vertically, top-aligned */}
      <div
        className={cn(
          "absolute inset-0 flex items-start justify-center pt-4 transition-opacity duration-300",
          active ? "opacity-0" : "opacity-100",
        )}
      >
        <span className="text-[9px] font-semibold tracking-[0.25em] whitespace-nowrap uppercase [writing-mode:vertical-rl]">
          {card.bank}
        </span>
      </div>
      {/* face — the proper credit card, revealed as the clip opens */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-between p-5 transition-all delay-100 duration-300",
          active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <div className="flex items-start justify-between">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase">
            {card.bank}
          </span>
          {/* chip */}
          <div className="h-7 w-9 rounded-md border border-white/40 bg-gradient-to-br from-yellow-200/80 to-yellow-500/80" />
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs tracking-[0.14em] whitespace-nowrap tabular-nums">
            {card.number}
          </span>
          <div className="flex items-end justify-between text-[10px] tracking-wider uppercase opacity-80">
            <span>{card.holder}</span>
            <span>{card.expires}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ScrollStripCardsDemo() {
  return (
    <ScrollStrip
      // Render-function items: each frame receives its live { active } state,
      // so the card itself decides what to show in and out of focus.
      items={CARDS.map((card) => ({ active }: { active: boolean }) => (
        <CreditCard card={card} active={active} />
      ))}
      // Slim slivers: thin enough to read as a card's edge, not a crop.
      frameWidth={17}
      frameHeight={220}
      expandedWidth={224}
      expandedHeight={354}
      gap={9}
      // Tight corners edge-on, card-like corners when expanded — the radius
      // animates along with the clip reveal.
      frameRadius={{ collapsed: 6, expanded: 16 }}
      frameClassName="shadow-lg"
    />
  )
}
