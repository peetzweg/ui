import type { ReactNode } from "react"

/**
 * Callout marking a docs page as an opinionated preset over a generic
 * primitive in this registry. Renders a "Preset" badge plus a link back to
 * the base component, so the primitive/preset layering is visible at a
 * glance on every preset page.
 */
export function PresetBanner({
  base,
  href,
  children,
}: {
  /** display name of the primitive this preset is built on */
  base: string
  /** docs link to the primitive's page */
  href: string
  /** optional one-liner on what the preset bakes in */
  children?: ReactNode
}) {
  // Markdown links get the site basePath ("/ui" on GitHub Pages) applied by
  // Vocs; raw anchors in components don't, so prefix it manually.
  const base_ = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? ""
  return (
    <div className="preset-banner my-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
      <span className="rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Preset
      </span>
      <span>
        An opinionated preset of <a href={`${base_}${href}`}>{base}</a>.
        {children ? <> {children}</> : null}
      </span>
    </div>
  )
}
