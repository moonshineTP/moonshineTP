# Field Notes

An evolving technical portfolio built as a vlog, project archive, and collection of reflective notes.

The site uses Next.js App Router, TypeScript, Tailwind CSS, MDX, and Bun.

## Local development

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project map

- `src/app/` contains routes, layouts, and global styles.
- `content/` is reserved for publishable notes and project entries.
- `docs/` contains the human-agent co-authoring workflow.
- `specs/` contains the agent's current interpretation of the product for supervisor review.
- `public/` contains static assets.

## Checks

```bash
bun lint
bun run build
```

## Cloudflare deployment

The app is configured for Cloudflare Workers through the OpenNext adapter.

```bash
bun run preview
bun run deploy
```

Run `bun run cf-typegen` after adding Wrangler bindings to regenerate the Cloudflare environment types.

GitHub Actions also publishes a static export to GitHub Pages after the `main` quality gate passes. Enable GitHub Actions as the Pages source in repository settings. The Cloudflare workflow requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets.

The root `AGENTS.md` points coding agents to the version-matched Next.js documentation bundled in `node_modules/next/dist/docs/`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
