import type { MDXComponents } from "mdx/types";

const components = {
  h1: ({ children, ...props }) => (
    <h1 className="mt-10 text-4xl font-semibold tracking-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mt-8 text-2xl font-semibold tracking-tight" {...props}>
      {children}
    </h2>
  ),
  p: ({ children, ...props }) => (
    <p className="mt-4 leading-8 text-zinc-700 dark:text-zinc-300" {...props}>
      {children}
    </p>
  ),
  a: ({ children, ...props }) => (
    <a className="underline underline-offset-4" {...props}>
      {children}
    </a>
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
