"use client"

import { ScrollStrip } from "@/registry/new-york/ui/scroll-strip"
import { cn } from "@/lib/utils"

interface Book {
  title: string
  author: string
  bg: string
}

const BOOKS: Book[] = [
  { title: "A Field Guide to Motion", author: "R. Ilves", bg: "bg-orange-700" },
  { title: "The Sliver & the Frame", author: "M. Okabe", bg: "bg-slate-800" },
  { title: "Springs, Damped", author: "C. Laurent", bg: "bg-emerald-800" },
  { title: "Interface Archaeology", author: "T. Brandt", bg: "bg-indigo-800" },
  { title: "Notes on Easing", author: "S. Whitfield", bg: "bg-rose-800" },
  { title: "The Scroll Position", author: "H. Mori", bg: "bg-teal-700" },
  { title: "Clip Path Cartography", author: "A. Duarte", bg: "bg-violet-800" },
  { title: "Patterns of Play", author: "E. Sandoval", bg: "bg-stone-700" },
]

/**
 * Collapsed and expanded states are *different layouts*, cross-faded on
 * `active`: the spine layer is sized to the sliver (vertical title, readable
 * while collapsed), the cover layer uses the full box. The clip only
 * reveals — what's painted underneath is entirely up to the frame.
 */
function Book({ book, active }: { book: Book; active: boolean }) {
  return (
    <div className={cn("relative h-full w-full text-orange-50", book.bg)}>
      {/* spine — vertical title centered in the collapsed sliver */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
          active ? "opacity-0" : "opacity-100",
        )}
      >
        <span className="text-[11px] font-medium tracking-[0.18em] whitespace-nowrap uppercase [writing-mode:vertical-rl]">
          {book.title}
        </span>
      </div>
      {/* cover — full layout, revealed as the clip opens */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-between p-5 transition-opacity delay-100 duration-300",
          active ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="border-t border-b border-current/40 py-3">
          <h3 className="text-xl leading-tight font-semibold text-balance">
            {book.title}
          </h3>
          <p className="mt-2 text-xs tracking-wider uppercase opacity-80">
            {book.author}
          </p>
        </div>
        <span className="text-[10px] tracking-[0.3em] uppercase opacity-60">
          Peet Press
        </span>
      </div>
    </div>
  )
}

export function ScrollStripBooksDemo() {
  return (
    <ScrollStrip
      items={BOOKS.map((book) => ({ active }: { active: boolean }) => (
        <Book book={book} active={active} />
      ))}
      // Same collapsed and expanded height: spines stand on a shelf and the
      // cover opens purely sideways.
      frameWidth={44}
      frameHeight={300}
      expandedWidth={210}
      expandedHeight={300}
      gap={8}
      frameRadius={4}
      frameClassName="shadow-md"
    />
  )
}
