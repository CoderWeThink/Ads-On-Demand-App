# Ads on Demand — Production App

This folder is the command center for the real Ads on Demand desktop app. It is intentionally organized before application code is written, so the website, desktop app, API, database, and business rules grow from one shared plan.

## What belongs here

| Area | Purpose |
| --- | --- |
| `apps/desktop` | Future Windows Electron application for regular users. |
| `apps/api` | Future custom TypeScript API deployed to Railway. |
| `packages/shared` | Future shared types, validation, and product rules. |
| `prisma` | Future PostgreSQL database schema and migrations. |
| `tests` | Future unit, integration, desktop, and security tests. |
| `docs` | The permanent product memory, decisions, backlog, and build roadmap. |

## Start here

1. Read [`docs/PROJECT_BRAIN.md`](docs/PROJECT_BRAIN.md) for the full product source of truth.
2. Use [`docs/BACKLOG.md`](docs/BACKLOG.md) to choose the next item to build.
3. Record any meaningful new decision in [`docs/DECISIONS.md`](docs/DECISIONS.md).
4. Follow [`docs/BUILD_ROADMAP.md`](docs/BUILD_ROADMAP.md) for the agreed build order.

## Current status

**Portable welcome-screen build.** The Windows app now contains the approved welcome/sign-in design and create-account state. Account services are not connected; no credentials are sent or saved. Other app milestones remain planned.

### Run the portable app

Double-click `release/Ads-on-Demand.exe` on Windows x64. No Node.js, server, installer, or internet connection is needed by the packaged app. This development build is unsigned. It exits when you close its window; it does not enable startup or create shortcuts. Electron may write its normal cache to the Windows user profile, and the portable launcher extracts its runtime temporarily.

### Build from source

Use Node.js 24 and pnpm 11: `pnpm install`, `pnpm check`, then `pnpm portable`. The lockfile pins resolved dependencies. The output is `release/Ads-on-Demand.exe`; `pnpm start` opens the compiled app after `pnpm build`.

## Non-negotiables

- Windows-first desktop app using Electron + TypeScript.
- One shared account across the web product and desktop app.
- Docks are visibly sponsored, optional, pausable, closable, and user-controlled.
- No browsing history, keystrokes, screenshots, microphone data, forced clicks, browser manipulation, or hidden startup behavior.
- Payouts and charging are not built until their dedicated future milestone.
