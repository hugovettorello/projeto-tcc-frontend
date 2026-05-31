# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server
pnpm build        # production build
pnpm lint         # run ESLint
npx tsc --noEmit  # type-check without emitting
npx orval         # regenerate API types and fetch functions from the backend swagger
```

There are no tests in this project.

## Environment

Copy `.env.example` to `.env`. Both variables must point to running services:

```
NEXT_PUBLIC_API_URL=http://localhost:8080   # backend API (also serves /swagger.json for Orval)
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # this Next.js app (used for auth callbacks)
```

## Architecture

### Stack

Next.js 15 App Router · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · BetterAuth · Orval (code generation)

### API layer

The backend exposes a Swagger spec at `NEXT_PUBLIC_API_URL/swagger.json`. Running `npx orval` regenerates two output targets (configured in `orval.config.ts`):

- **`app/_lib/api/fetch-generated/index.ts`** — plain `fetch`-based functions and all TypeScript types. Used exclusively in Server Components.
- **`lib/api/rc-generated/index.ts`** (currently commented out in `orval.config.ts`) — TanStack Query hooks for Client Components.

The underlying fetch is `app/_lib/fetch.ts` (`customFetch`), which prepends `NEXT_PUBLIC_API_URL`, forwards cookies from the incoming request, and normalises the response into `{ status, data, headers }`.

**Rule:** always call fetch-generated functions in Server Components; always call rc-generated hooks in Client Components. Never write raw `fetch` calls against the API.

If a needed function is absent from the generated files, run `npx orval` before doing anything else. If it still does not appear, stop and tell the user.

### Authentication

BetterAuth (`better-auth`) is the auth library. The client is `app/_lib/auth-client.ts`.

- **Server-side guard** — call `authClient.getSession({ fetchOptions: { headers: await headers() } })` at the top of a page and redirect to `/auth` if there is no session.
- **Client-side guard** — use `authClient.useSession()` and redirect in a `useEffect`. The `/auth` page redirects to `/` when a session already exists.
- Never use middleware for auth checks.
- When calling any `authClient` method, destructure `error` from the result and handle it explicitly — never wrap in try/catch.

### Styling

Tailwind CSS v4 with a custom theme defined in `app/globals.css`. All custom colours live as CSS variables in `:root` (and `.dark`) and are exposed to Tailwind via the `@theme inline` block.

**Never use hardcoded Tailwind colour utilities** (`text-white`, `bg-[#fff]`, etc.). Always use a theme token (`text-background`, `bg-primary`, etc.). If the required colour does not exist, add it to `globals.css` following the existing `oklch(…)` pattern.

The `--font-space-grotesk` variable (Space Grotesk) is available via the `font-space-grotesk` Tailwind utility alongside the default Geist Sans.

### Component conventions

- One component per file; file names in kebab-case.
- Always use the `Button` component from `@/components/ui/button` — never a native `<button>`.
- Always use `Image` from `next/image` for images.
- Always use `dayjs` for date manipulation and formatting.
- Install shadcn/ui components with `npx shadcn add <component>` before creating custom alternatives. If the TLS error appears, prefix with `NODE_TLS_REJECT_UNAUTHORIZED=0`.
- Reusable page-level components live under `app/_components/`.
- Shared UI primitives live under `components/ui/` (shadcn) or `components/` (custom, e.g. `navbar.tsx`).

### Data fetching pattern

```tsx
// page.tsx (Server Component) — fetch on the server
import { getSomeData } from "@/app/_lib/api/fetch-generated";
const result = await getSomeData(param);
const data = result.status === 200 ? result.data : null;

// Pass as initialData to a Client Component that needs reactivity
// client-component.tsx — use the rc-generated hook with initialData
import { useGetSomeData } from "@/lib/api/rc-generated";
const { data } = useGetSomeData(param, { query: { initialData: props.data } });
```

### Forms

Always use React Hook Form + Zod + the `Form` / `FormField` / `FormItem` components from `@/components/ui/form`. Schema validation via `zodResolver`.

### Mutations (Client Components)

Always use the synchronous `mutate` variant (not `mutateAsync`). Handle success and error via the `onSuccess` / `onError` callbacks, not try/catch.
