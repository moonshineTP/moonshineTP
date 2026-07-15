export default function Home() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-16">
      <header className="flex items-center justify-between border-b border-black/10 pb-6 text-sm dark:border-white/15">
        <span className="font-semibold tracking-tight">FIELD NOTES</span>
        <nav className="flex gap-5 text-zinc-600 dark:text-zinc-400">
          <a className="transition-colors hover:text-foreground" href="#notes">Notes</a>
          <a className="transition-colors hover:text-foreground" href="#projects">Projects</a>
          <a className="transition-colors hover:text-foreground" href="#about">About</a>
        </nav>
      </header>

      <section className="grid flex-1 items-center gap-12 py-20 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.24em] text-zinc-500">Portfolio / vlog / lab notebook</p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-7xl">
            Building in public, one useful note at a time.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            An evolving home for technical work, project evidence, and reflections on the decisions behind them.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 text-sm">
            <a className="rounded-full bg-foreground px-5 py-3 text-background transition-opacity hover:opacity-80" href="#notes">Read the latest note</a>
            <a className="rounded-full border border-black/15 px-5 py-3 transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10" href="#projects">Browse projects</a>
          </div>
        </div>

        <aside className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm dark:border-white/15 dark:bg-white/5">
          <p className="text-sm text-zinc-500">Now</p>
          <h2 className="mt-4 text-xl font-semibold">The foundation is in place.</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Next: shape the content model, publish the first field note, and turn the project archive into a readable trail.
          </p>
          <div className="mt-6 border-t border-black/10 pt-4 text-xs text-zinc-500 dark:border-white/15">
            Built with Next.js, TypeScript, Tailwind CSS, MDX, and Bun.
          </div>
        </aside>
      </section>

      <footer className="border-t border-black/10 pt-5 text-sm text-zinc-500 dark:border-white/15">
        <span>Content changes. The record stays.</span>
      </footer>
    </main>
  );
}
