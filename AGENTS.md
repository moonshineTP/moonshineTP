<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Portfolio project rules

- Use Bun for package installation, scripts, and the lockfile. Do not introduce a second package manager.
- Read the relevant bundled Next.js guide in `node_modules/next/dist/docs/` before changing framework code.
- Treat `/docs` as the human-agent co-authoring area. Put workflow notes, decisions, and prompts there.
- Treat `/specs` as the agent-maintained interpretation of the product. The user is the supervisor and can accept, amend, or reject it.
- Keep the public site focused on a technical portfolio with editable notes, reflective writing, and project evidence.
- Keep content separate from route and UI code. Prefer MDX content in `/content` when the content layer is introduced.

## Three.js

- Keep Three.js behind local `"use client"` component boundaries under `src/components/three/`.
- Create the renderer, scene, camera, browser observers, and animation loop inside `useEffect`; dispose geometry, materials, observers, and renderer resources on cleanup.
- Size a renderer from its container and cap `devicePixelRatio` to avoid unnecessary GPU work. Do not import Three.js into server-only content or data modules.

## Search and router sketch

- Use the App Router under `src/app`. Use `next/link` for normal navigation and `useRouter` from `next/navigation` only for event-driven transitions. Do not use `next/router`.
- Planned content routes are `/notes`, `/notes/[slug]`, `/projects`, `/projects/[slug]`, and `/about`. Dynamic detail pages should validate the slug and return `notFound()` for missing entries.
- Keep search state in the URL. Start with `q` on the notes listing, read it from the Page `searchParams` prop for server-side filtering, and keep the interactive input in a narrow Client Component. Wrap `useSearchParams` consumers in `Suspense` when they are needed for client-side URL synchronization.
- Use `router.replace` for incremental search edits so each keystroke does not add browser history. Preserve unrelated query parameters when updating search state.
- Keep search indexing and content loading in the content/data layer. Route and UI code should consume the shared entry metadata instead of maintaining a second search dataset.

## Cloudflare deployment

- Deploy the Next.js App Router through Cloudflare Workers using `@opennextjs/cloudflare` and the checked-in `wrangler.jsonc`.
- Use `bun run preview` to test the OpenNext Worker build locally and `bun run deploy` to build and deploy it. Use `bun run cf-typegen` after changing Wrangler bindings.
- Keep `.open-next/` and `.wrangler/` out of version control. Store deployment credentials and environment values in Cloudflare or CI settings, never in committed files.
- GitHub Actions owns the quality gate and triggers the Cloudflare deployment only after the `main` CI run succeeds. The workflow expects `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets.

## GitHub Pages deployment

- The GitHub Pages workflow sets `GITHUB_PAGES=true`, which enables Next.js static export with trailing slashes and unoptimized local images. The default build remains the Cloudflare Workers build.
- GitHub Pages deploys the `out/` artifact from the tested `main` commit through the Actions deployment source. DNS records and any custom domain configuration remain outside the repository.
