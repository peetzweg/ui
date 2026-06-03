/** Clamp `value` into the inclusive `[min, max]` range. */
export function clamp(value: number, [min, max]: [number, number]): number {
  return Math.min(Math.max(value, min), max)
}
