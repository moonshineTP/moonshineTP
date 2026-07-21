"use client";

type SearchFormProps = {
  defaultValue?: string;
};

export function SearchForm({ defaultValue = "" }: SearchFormProps) {
  return (
    <form action="/search" className="w-full" method="get" role="search">
      <label className="sr-only" htmlFor="site-search">
        Search portfolio entries
      </label>
      <input
        className="w-full border border-black/15 bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-zinc-500 focus:border-black/45 dark:border-white/20 dark:placeholder:text-zinc-400 dark:focus:border-white/60"
        defaultValue={defaultValue}
        id="site-search"
        name="q"
        placeholder="Search"
        type="search"
      />
    </form>
  );
}
