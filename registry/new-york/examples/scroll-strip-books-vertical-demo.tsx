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
]

/**
 * The shelf layout, rotated. With `orientation="vertical"` each collapsed
 * sliver is a *horizontal* strip — a book lying flat, spine facing up — and
 * expanding pulls the full cover down out of the stack. Same different-layout-
 * per-state trick (spine ↔ cover, cross-faded on `active`), just along the
 * other axis.
 */
function Book({ book, active }: { book: Book; active: boolean }) {
  return (
    <div className={cn("relative h-full w-full text-orange-50", book.bg)}>
      {/* spine — horizontal label, readable in the collapsed sliver */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-between px-4 transition-opacity duration-300",
          active ? "opacity-0" : "opacity-100",
        )}
      >
        <span className="text-[11px] font-medium tracking-[0.18em] uppercase">
          {book.title}
        </span>
        <span className="text-[10px] tracking-wider uppercase opacity-70">
          {book.author}
        </span>
      </div>
      {/* cover — full layout, revealed as the clip opens downward */}
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

export function ScrollStripBooksVerticalDemo() {
  return (
    <ScrollStrip
      orientation="vertical"
      items={BOOKS.map((book) => ({ active }: { active: boolean }) => (
        <Book book={book} active={active} />
      ))}
      // Cross axis constant (frameWidth === expandedWidth): the cover is
      // revealed purely downward, like sliding a book out of a flat stack.
      frameWidth={300}
      frameHeight={40}
      expandedWidth={300}
      expandedHeight={240}
      gap={8}
      frameRadius={6}
      frameClassName="shadow-md"
      style={{ height: 440 }}
    />
  )
}
