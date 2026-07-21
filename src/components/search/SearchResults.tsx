"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { searchMetadata } from "@/lib/search";

import { SearchForm } from "./SearchForm";

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const results = searchMetadata(query);

  return (
    <>
      <div className="mt-6 max-w-xl">
        <SearchForm defaultValue={query} key={query} />
      </div>

      <section className="py-10" aria-live="polite">
        {!query ? (
          <p className="text-zinc-600 dark:text-zinc-400">Enter a search term.</p>
        ) : results.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            No entries matched “{query}”.
          </p>
        ) : (
          <ul className="divide-y divide-black/10 dark:divide-white/15">
            {results.map((result) => (
              <li key={result.href}>
                <Link
                  className="block py-6 transition-colors hover:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 dark:hover:text-zinc-300"
                  href={result.href}
                >
                  <h2 className="text-xl font-semibold tracking-[-0.02em]">{result.title}</h2>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">{result.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
