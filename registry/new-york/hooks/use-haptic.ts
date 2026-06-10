"use client"

import * as React from "react"

/**
 * A light haptic "tick" on mobile; a silent no-op on desktop.
 *
 * Two paths (the web-haptics technique, https://haptics.lochie.me):
 * - Android / Chromium: `navigator.vibrate()` with a short pulse.
 * - iOS Safari 17.4+ has no vibrate API; instead, programmatically clicking a
 *   hidden `<input type="checkbox" switch>` fires the native switch-toggle
 *   haptic — currently the only way to reach the Taptic Engine from the web.
 *
 * Returns a stable `tick()` callback. Calls are rate-limited to one per
 * `minGapMs` so per-step ticking during a fast scrub doesn't saturate the
 * motor. The hidden switch is created lazily on first use (SSR-safe) and
 * removed on unmount.
 */
export function useHaptic({ minGapMs = 16 }: { minGapMs?: number } = {}) {
  const labelRef = React.useRef<HTMLLabelElement | null>(null)
  const lastTickRef = React.useRef(0)

  React.useEffect(
    () => () => {
      labelRef.current?.remove()
      labelRef.current = null
    },
    [],
  )

  return React.useCallback(() => {
    if (typeof window === "undefined") return
    const now = performance.now()
    if (now - lastTickRef.current < minGapMs) return
    lastTickRef.current = now

    if (typeof navigator.vibrate === "function") {
      navigator.vibrate(8)
      return
    }

    if (!labelRef.current) {
      const label = document.createElement("label")
      label.setAttribute("aria-hidden", "true")
      label.style.display = "none"
      const input = document.createElement("input")
      input.type = "checkbox"
      // Safari's switch rendering of a checkbox — toggling it is what emits
      // the haptic. Harmlessly ignored everywhere else.
      input.setAttribute("switch", "")
      input.tabIndex = -1
      input.style.display = "none"
      label.appendChild(input)
      document.body.appendChild(label)
      labelRef.current = label
    }
    labelRef.current.click()
  }, [minGapMs])
}
