import Link from "next/link";
import { Suspense } from "react";

import { SearchResults } from "@/components/search/SearchResults";

export default function SearchPage() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-6 py-8 sm:px-10 lg:px-16">
      <header className="border-b border-black/10 pb-6 dark:border-white/15">
        <Link className="text-sm font-semibold tracking-tight" href="/">
          FIELD NOTES
        </Link>
        <h1 className="mt-10 text-4xl font-semibold tracking-[-0.04em]">Search</h1>
      </header>
      <Suspense fallback={<p className="py-10 text-zinc-600 dark:text-zinc-400">Loading search.</p>}>
        <SearchResults />
      </Suspense>
    </main>
  );
}
