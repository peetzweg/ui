import type { ReactNode } from "react"

/** Styled, token-scoped box that hosts a live component demo on a docs page. */
export function Preview({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`preview flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-lg border border-border bg-background p-8 ${className}`}
    >
      {children}
    </div>
  )
}
