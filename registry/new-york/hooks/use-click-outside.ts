"use client"

import * as React from "react"

type PointerEventType =
  | "mousedown"
  | "mouseup"
  | "touchstart"
  | "touchend"
  | "focusin"
  | "focusout"

/**
 * Invoke `handler` when an event fires outside `ref`'s element (or outside
 * every element when an array of refs is passed — useful for a trigger +
 * popover pair).
 *
 * Listeners bind once; the latest `handler` is read through a ref, so passing
 * an inline callback won't re-subscribe. Pass `enabled: false` to suspend.
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null> | React.RefObject<T | null>[],
  handler: (event: Event) => void,
  {
    eventType = "mousedown",
    enabled = true,
  }: { eventType?: PointerEventType; enabled?: boolean } = {},
): void {
  const savedHandler = React.useRef(handler)
  React.useEffect(() => {
    savedHandler.current = handler
  })

  const refs = Array.isArray(ref) ? ref : [ref]
  // Stable across renders so the effect doesn't resubscribe on every array
  // literal; the underlying refs are mutated in place anyway.
  const refsRef = React.useRef(refs)
  refsRef.current = refs

  React.useEffect(() => {
    if (!enabled) return

    function callback(event: Event) {
      const target = event.target as Node | null
      // Ignore targets already detached from the document (e.g. a node removed
      // by the same interaction) — they read as "outside" everything.
      if (!target || !target.isConnected) return

      const isOutside = refsRef.current
        .filter((r) => r.current)
        .every((r) => !r.current!.contains(target))

      if (isOutside) savedHandler.current(event)
    }

    window.addEventListener(eventType, callback)
    return () => window.removeEventListener(eventType, callback)
  }, [eventType, enabled])
}
