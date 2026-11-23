# Juku Cloud – Front end (React + Vite + TypeScript)

English | [日本語](README.ja.md)

The single-page app for [Juku Cloud](https://github.com/Taira0222/juku-cloud), a SaaS for tutoring schools. It talks to the [Rails API](https://github.com/Taira0222/juku-cloud-backend).

> **Status:** no longer online. It was served from S3 + CloudFront. CI (lint and tests) still runs on every push.

## Stack

- React 19, Vite 7, TypeScript 5
- Tailwind CSS, shadcn/ui
- TanStack Query for server state, Zustand for UI state
- Axios, Zod
- Vitest, Testing Library, MSW
- ESLint, Prettier

## Structure (excerpt)

```
src/
├─ Router/       # Guarded routes (AuthRoute / ProtectedRoute / RoleRoute)
├─ pages/        # Screens
├─ features/     # One folder per feature (auth, students, studentTraits, lessonNotes, teachers, ...)
│  └─ lessonNotes/  # Example: api, components, hooks, mutations, queries, types, tests
├─ components/   # Shared UI (wrappers around shadcn/ui)
├─ stores/       # Zustand stores
├─ api/          # Global API client
├─ queries/      # Shared queries
├─ mutations/    # Shared mutations
├─ lib/          # Axios client, error handling
└─ tests/        # MSW server and fixtures
```

## Design notes

- **Server state in TanStack Query:** caching, syncing and invalidation live in one place. Zustand only holds UI state. The teacher screens still use Zustand and are next to move.
- **Zod on the client too:** forms are validated before they reach the API (for example, a handoff note's expiry date can't be in the past). Users get instant feedback, and the API validates again.
- **One error helper:** `getErrorMessage()` turns Axios errors, 422 responses and network failures into consistent messages.
- **Forms that narrow down:** long forms only show what's relevant next (choose subjects and days first, then matching teachers), and choices are toggled as badges.

## Security

- CloudFront sets a Content Security Policy (`default-src 'self'`, `script-src 'self'`, ...).
- Auth tokens are kept in localStorage, so blocking third-party scripts with the CSP is the main defense against XSS.

## Tests

```bash
npm run test           # Unit and integration tests (API mocked with MSW)
npm run test:coverage
```

Coverage: statements 96% · branches 84% · functions 95% · lines 96% (target: 80%+).

## Run locally

Open the repository in the Dev Container (`.devcontainer/`). Put these in `.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:3000       # The Rails API
VITE_FRONTEND_BASE_URL=http://localhost:5173  # Used in teacher invite links
```

Then:

```bash
npm ci
npm run dev
```
