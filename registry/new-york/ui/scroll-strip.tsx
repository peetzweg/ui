"use client"

import * as React from "react"
import { motion, useSpring, useTransform } from "motion/react"

import { useScrollEnd } from "@/registry/new-york/hooks/use-scroll-end"
import { clamp } from "@/registry/new-york/lib/clamp"
import { cn } from "@/lib/utils"

/**
 * A frame's content: a plain node, or a render function receiving the
 * frame's live state — use the function form when content should change
 * with focus (reveal details while expanded, summarize while collapsed).
 */
export type ScrollStripItem =
  | React.ReactNode
  | ((state: { active: boolean; index: number }) => React.ReactNode)

export interface ScrollStripProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Frame contents. Each fills a frame box of the expanded size — while
   * collapsed only the centered sliver is visible through the clip, so
   * content should fill the box (e.g. an `object-cover` image, or a
   * `h-full w-full` component). The component owns geometry and motion
   * only; appearance is yours.
   */
  items: ScrollStripItem[]
  /**
   * Scroll axis. `horizontal` clips frames to vertical slivers side by
   * side; `vertical` clips them to horizontal slivers in a stack.
   */
  orientation?: "horizontal" | "vertical"
  /** Collapsed frame width (the sliver width when horizontal), in px. */
  frameWidth?: number
  /** Collapsed frame height (the sliver height when vertical), in px. */
  frameHeight?: number
  /** Expanded frame width; also the strip's width when vertical (px). */
  expandedWidth?: number
  /** Expanded frame height; also the strip's height when horizontal (px). */
  expandedHeight?: number
  /** Gap between slivers, in px. */
  gap?: number
  /**
   * Corner radius applied through the clip-path, in px. Pass an object for
   * a different radius per state — it animates along with the reveal.
   */
  frameRadius?: number | { collapsed?: number; expanded?: number }
  /** Controlled expanded index; `null` means collapsed. */
  activeIndex?: number | null
  /** Initial expanded index when uncontrolled. */
  defaultActiveIndex?: number | null
  onActiveIndexChange?: (index: number | null) => void
  /** Auto-expand the nearest frame when scrolling settles. */
  expandOnSettle?: boolean
  spring?: { stiffness?: number; damping?: number; mass?: number }
  /**
   * Extra classes on each frame wrapper. Frames carry
   * `data-active="true" | "false"` for state-dependent styling
   * (e.g. `data-[active=true]:grayscale-0`).
   */
  frameClassName?: string
}

const DEFAULT_SPRING = { stiffness: 500, damping: 50 }

/**
 * A filmstrip of clipped slivers, horizontal or vertical. Every frame is a
 * full expanded-size box clipped down to a sliver along the scroll axis via
 * `clip-path: inset()`; expanding a frame just animates the clip open while
 * its neighbors part by exactly the revealed amount — no layout thrash.
 *
 * Scoped to its own scroll container (native scroll + momentum; when
 * horizontal, vertical wheel input is translated). Scrolling collapses the
 * strip and settles by snapping to — and expanding — the nearest frame.
 * Click toggles a frame; arrow keys step while expanded; Escape collapses.
 */
export const ScrollStrip = React.forwardRef<HTMLDivElement, ScrollStripProps>(
  function ScrollStrip(
    {
      items,
      orientation = "horizontal",
      frameWidth = 72,
      frameHeight = 288,
      expandedWidth = 480,
      expandedHeight = 720,
      gap = 16,
      frameRadius = 0,
      activeIndex: activeProp,
      defaultActiveIndex = null,
      onActiveIndexChange,
      expandOnSettle = true,
      spring,
      frameClassName,
      className,
      style,
      ...props
    },
    forwardedRef,
  ) {
    const vertical = orientation === "vertical"

    // Generalize over the axes: "main" is the scroll/clip axis, "cross" is
    // the one that grows on expand.
    const mainCollapsed = vertical ? frameHeight : frameWidth
    const mainExpanded = vertical ? expandedHeight : expandedWidth
    const crossCollapsed = vertical ? frameWidth : frameHeight
    const crossExpanded = vertical ? expandedWidth : expandedHeight

    const radii =
      typeof frameRadius === "number"
        ? { collapsed: frameRadius, expanded: frameRadius }
        : { collapsed: frameRadius.collapsed ?? 0, expanded: frameRadius.expanded ?? 0 }

    const maxIndex = Math.max(items.length - 1, 0)
    const step = mainCollapsed + gap
    const insetCenter = (mainExpanded - mainCollapsed) / 2
    const crossDiff = crossExpanded - crossCollapsed

    const isControlled = activeProp !== undefined
    const [internalActive, setInternalActive] = React.useState<number | null>(
      defaultActiveIndex,
    )
    const active = isControlled ? activeProp : internalActive

    // Live value so handlers bound once read the latest state.
    const activeRef = React.useRef(active)
    React.useEffect(() => {
      activeRef.current = active
    }, [active])

    const setActive = React.useCallback(
      (next: number | null) => {
        const value = next === null ? null : clamp(next, [0, maxIndex])
        if (value === activeRef.current) return
        activeRef.current = value
        if (!isControlled) setInternalActive(value)
        onActiveIndexChange?.(value)
      },
      [isControlled, maxIndex, onActiveIndexChange],
    )

    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node
        if (typeof forwardedRef === "function") forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      },
      [forwardedRef],
    )

    const getScroll = React.useCallback(
      (el: HTMLDivElement) => (vertical ? el.scrollTop : el.scrollLeft),
      [vertical],
    )

    // Frames center against the container, so its main-axis size must be
    // measured.
    const [containerMain, setContainerMain] = React.useState(0)
    React.useEffect(() => {
      const el = containerRef.current
      if (!el) return
      const measure = () =>
        setContainerMain(vertical ? el.clientHeight : el.clientWidth)
      const observer = new ResizeObserver(measure)
      observer.observe(el)
      measure()
      return () => observer.disconnect()
    }, [vertical])

    // True while a programmatic smooth-scroll is in flight, so its scroll
    // events don't read as user scrubbing (which collapses the strip).
    const settling = React.useRef(false)

    // Frame i is centered when the scroll offset === i * step; re-center
    // whenever a frame becomes active (click, arrows, settle, or controlled
    // parent).
    React.useEffect(() => {
      const el = containerRef.current
      if (el === null || active === null) return
      const target = active * step
      if (Math.abs(getScroll(el) - target) <= 1) return
      settling.current = true
      el.scrollTo({
        [vertical ? "top" : "left"]: target,
        behavior: "smooth",
      })
    }, [active, step, vertical, getScroll])

    // User scrubbing collapses the expanded frame.
    const handleScroll = () => {
      if (settling.current) return
      if (activeRef.current !== null) setActive(null)
    }

    // Settle: snap to — and (optionally) expand — the nearest frame.
    useScrollEnd(containerRef, () => {
      if (settling.current) {
        settling.current = false
        return
      }
      const el = containerRef.current
      if (!el) return
      const index = Math.round(clamp(getScroll(el) / step, [0, maxIndex]))
      if (activeRef.current === null && expandOnSettle) {
        setActive(index)
      }
    })

    // Wheel input is applied to the scroll offset directly, in both
    // orientations — bypassing the browser's animated wheel scrolling and
    // its momentum, so the strip tracks the gesture 1:1 and `scrollend`
    // (→ snap-and-expand) fires the moment input stops. Horizontal strips
    // additionally gain vertical-wheel scrolling this way. At either end
    // the event passes through to the page.
    React.useEffect(() => {
      const el = containerRef.current
      if (!el) return
      function onWheel(event: WheelEvent) {
        if (!el || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return
        const maxScroll = vertical
          ? el.scrollHeight - el.clientHeight
          : el.scrollWidth - el.clientWidth
        const position = vertical ? el.scrollTop : el.scrollLeft
        const atStart = position <= 0 && event.deltaY < 0
        const atEnd = position >= maxScroll && event.deltaY > 0
        if (atStart || atEnd) return
        event.preventDefault()
        const next = clamp(position + event.deltaY, [0, maxScroll])
        if (vertical) el.scrollTop = next
        else el.scrollLeft = next
      }
      el.addEventListener("wheel", onWheel, { passive: false })
      return () => el.removeEventListener("wheel", onWheel)
    }, [vertical])

    // Arrow keys along the scroll axis step while expanded; Escape collapses.
    React.useEffect(() => {
      const [prevKey, nextKey] = vertical
        ? ["ArrowUp", "ArrowDown"]
        : ["ArrowLeft", "ArrowRight"]
      function onKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
          setActive(null)
          return
        }
        const current = activeRef.current
        if (current === null) return
        if (event.key === nextKey) {
          event.preventDefault()
          setActive(current + 1)
        } else if (event.key === prevKey) {
          event.preventDefault()
          setActive(current - 1)
        }
      }
      window.addEventListener("keydown", onKeyDown)
      return () => window.removeEventListener("keydown", onKeyDown)
    }, [setActive, vertical])

    const transition = { type: "spring" as const, ...DEFAULT_SPRING, ...spring }

    // Neighbors part by exactly the amount the active frame's visible edge
    // grows on each side.
    function parting(i: number) {
      if (active === null || active === i) return 0
      return i > active ? insetCenter : -insetCenter
    }

    return (
      <div
        {...props}
        ref={setRefs}
        onScroll={handleScroll}
        className={cn(
          "relative",
          vertical
            ? "overflow-y-auto overscroll-y-contain"
            : "w-full overflow-x-auto overscroll-x-contain",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
        style={{
          ...(vertical
            ? { width: expandedWidth, height: expandedHeight }
            : { height: expandedHeight }),
          ...style,
        }}
      >
        <div
          className={cn("relative", vertical ? "w-full" : "h-full")}
          style={
            vertical
              ? { height: containerMain + maxIndex * step }
              : { width: containerMain + maxIndex * step }
          }
        >
          {containerMain > 0 &&
            items.map((item, i) => (
              <Frame
                key={i}
                vertical={vertical}
                active={active === i}
                inset={insetCenter}
                radii={radii}
                transition={transition}
                parting={parting(i)}
                mainPos={i * step + (containerMain - mainExpanded) / 2}
                mainSize={mainExpanded}
                crossSize={crossCollapsed}
                crossExpandedSize={crossExpanded}
                crossShift={-crossDiff / 2}
                className={frameClassName}
                onClick={() => setActive(active === i ? null : i)}
              >
                {typeof item === "function"
                  ? item({ active: active === i, index: i })
                  : item}
              </Frame>
            ))}
        </div>
      </div>
    )
  },
)

interface FrameProps {
  children: React.ReactNode
  vertical: boolean
  active: boolean
  /** Main-axis clip inset (px each side) while collapsed. */
  inset: number
  radii: { collapsed: number; expanded: number }
  transition: {
    type: "spring"
    stiffness?: number
    damping?: number
    mass?: number
  }
  /** Main-axis parting shift for neighbors of the active frame. */
  parting: number
  /** Main-axis position within the track. */
  mainPos: number
  /** Fixed main-axis box size (the expanded size; the clip does the rest). */
  mainSize: number
  /** Collapsed and expanded cross-axis sizes. */
  crossSize: number
  crossExpandedSize: number
  /** Cross-axis shift keeping the expanding frame centered. */
  crossShift: number
  className?: string
  onClick: () => void
}

function Frame({
  children,
  vertical,
  active,
  inset,
  radii,
  transition,
  parting,
  mainPos,
  mainSize,
  crossSize,
  crossExpandedSize,
  crossShift,
  className,
  onClick,
}: FrameProps) {
  // The expand/collapse reveal: a sprung clip-path inset, not a size
  // animation — the box never changes main-axis size, so there's no layout
  // thrash.
  const clip = useSpring(active ? 0 : inset, DEFAULT_SPRING)
  React.useEffect(() => {
    clip.set(active ? 0 : inset)
  }, [active, inset, clip])
  const clipPath = useTransform(clip, (c) => {
    const px = Math.max(c, 0)
    // Radius rides the same spring as the clip: t = 0 collapsed, 1 expanded.
    const t = inset > 0 ? 1 - px / inset : 1
    const r = radii.collapsed + (radii.expanded - radii.collapsed) * t
    return vertical
      ? `inset(${px}px 0 round ${r}px)`
      : `inset(0 ${px}px round ${r}px)`
  })

  return (
    <motion.div
      initial={false}
      data-active={active}
      animate={
        vertical
          ? {
              y: parting,
              x: active ? crossShift : 0,
              width: active ? crossExpandedSize : crossSize,
            }
          : {
              x: parting,
              y: active ? crossShift : 0,
              height: active ? crossExpandedSize : crossSize,
            }
      }
      transition={transition}
      className={cn("absolute cursor-pointer select-none", className)}
      style={{
        ...(vertical
          ? {
              top: mainPos,
              left: `calc(50% - ${crossSize / 2}px)`,
              height: mainSize,
            }
          : {
              left: mainPos,
              top: `calc(50% - ${crossSize / 2}px)`,
              width: mainSize,
            }),
        clipPath,
        zIndex: active ? 1 : 0,
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
