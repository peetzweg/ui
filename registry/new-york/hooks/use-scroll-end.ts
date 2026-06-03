"use client"

import * as React from "react"

/**
 * Invoke `onScrollEnd` when scrolling settles on `ref`'s element.
 *
 * Uses the native `scrollend` event where supported (Chrome 114+,
 * Firefox 109+) and falls back to a trailing debounce on `scroll`
 * elsewhere (Safari).
 */
export function useScrollEnd<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onScrollEnd: () => void,
  { delay = 150 }: { delay?: number } = {},
) {
  // Keep the latest callback in a ref so the listeners bind once.
  const handler = React.useRef(onScrollEnd)
  React.useEffect(() => {
    handler.current = onScrollEnd
  })

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    // Note: typed as always-present in lib.dom, hence the boolean indirection;
    // at runtime Safari still lacks scrollend.
    const supportsScrollEnd: boolean = "onscrollend" in el
    if (supportsScrollEnd) {
      const onEnd = () => handler.current()
      el.addEventListener("scrollend", onEnd)
      return () => el.removeEventListener("scrollend", onEnd)
    }

    let timeout: ReturnType<typeof setTimeout>
    const onScroll = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => handler.current(), delay)
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      clearTimeout(timeout)
      el.removeEventListener("scroll", onScroll)
    }
  }, [ref, delay])
}
