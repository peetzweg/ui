import { components } from "./showcase"

export default function App() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">peet/ui</h1>
        <p className="text-muted-foreground">
          A small shadcn-compatible registry of animated, motion-based
          primitives.
        </p>
        <p className="text-muted-foreground text-sm pt-2">
          Install any component straight from this repo:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
            pnpm dlx shadcn@latest add peetzweg/ui/&lt;component&gt;
          </code>
        </p>
      </header>

      <main className="flex flex-col flex-1 gap-8">
        {components.map(({ id, title, description, install, Demo }) => (
          <section
            key={id}
            id={id}
            className="flex flex-col gap-4 border rounded-lg p-4 min-h-[280px] scroll-mt-8"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold">
                <a href={`#${id}`} className="hover:underline">
                  {title}
                </a>
              </h2>
              <p className="text-sm text-muted-foreground">{description}</p>
              <code className="mt-1 w-fit rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground">
                {install}
              </code>
            </div>
            <div className="flex items-center justify-center min-h-[160px]">
              <Demo />
            </div>
          </section>
        ))}
      </main>

      <footer className="text-xs text-muted-foreground">
        <a
          href="https://github.com/peetzweg/ui"
          className="hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          github.com/peetzweg/ui
        </a>
      </footer>
    </div>
  )
}
