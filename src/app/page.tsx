export default function Home() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col px-6 py-8 font-sans sm:px-10 lg:px-14">
      <header className="flex items-center justify-between border-b border-black/10 pb-5 text-sm dark:border-white/15">
        <span className="font-medium tracking-tight">moonshineTP</span>
        <a
          className="text-zinc-600 underline decoration-black/20 underline-offset-4 transition-colors hover:text-foreground dark:text-zinc-400 dark:decoration-white/25"
          href="https://github.com/moonshineTP"
          rel="noreferrer"
          target="_blank"
        >
          GitHub
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </header>

      <section className="grid flex-1 content-center gap-12 py-20 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="text-sm text-zinc-500">Field notes</p>
          <h1 className="mt-3 max-w-2xl text-5xl font-medium leading-none tracking-[-0.045em] sm:text-7xl">
            Index
          </h1>
        </div>
        <dl className="border-l border-black/10 pl-5 dark:border-white/15">
          <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">
            Public entries
          </dt>
          <dd className="mt-2 text-4xl font-medium tabular-nums">0</dd>
        </dl>
      </section>

      <section aria-labelledby="entries-title" className="border-t border-black/10 dark:border-white/15">
        <div className="flex items-center justify-between py-4 text-sm">
          <h2 className="font-medium" id="entries-title">
            Entries
          </h2>
          <span className="text-zinc-500">00</span>
        </div>
        <div className="grid min-h-40 place-items-center border-y border-black/10 text-sm text-zinc-500 dark:border-white/15">
          <p>No public entries.</p>
        </div>
      </section>

      <footer className="flex items-center justify-between pt-5 text-xs text-zinc-500">
        <span>moonshineTP</span>
        <span>2026</span>
      </footer>
    </main>
  );
}
