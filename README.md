# Ads on Demand — Production App

## Download the current preview

[Ads on Demand 0.3.1 for Windows x64](https://github.com/CoderWeThink/Ads-On-Demand-App/releases/tag/v0.3.1)

Open Assets and choose `Ads-on-Demand-Setup.exe` for a normal installation or `Ads-on-Demand-Portable.exe` for a single-file build. This release includes the welcome flow, dashboard, system tray, and real native always-on-top Image, Video, Question, and Survey dock windows. Version 0.3.1 fixes the background lifecycle: closing the dashboard with no active dock now exits completely, while an active dock may continue in the tray. Use any valid email and a password of five or more characters for local preview access. Credentials are not saved or sent; production accounts, live ads, and real earnings are not connected. Repository collaborator access is required for this private download. See [release details](docs/RELEASE_0.3.1.md).

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

**Native dock private preview.** The Windows app now contains the approved welcome flow, signed-in dashboard, encrypted local state, system tray/background mode, and separate always-on-top dock windows. Account services are not connected; no credentials are sent or saved. Live advertising, verified earnings, subscriptions, and payouts remain future milestones.

### Run the portable app

Double-click `release/Ads-on-Demand-Portable.exe` on Windows x64, or run `release/Ads-on-Demand-Setup.exe` to install it. No Node.js, server, or internet connection is needed by this local preview. The build is unsigned, so Windows SmartScreen may warn. Closing the dashboard quits completely when no dock is active. When a dock is active, closing the dashboard hides it to the tray so the dock can continue; closing that final dock then exits the background process automatically.

### Build from source

Use Node.js 24 and pnpm 11: `pnpm install`, `pnpm check`, then `pnpm package:windows`. The lockfile pins resolved dependencies. Outputs are `release/Ads-on-Demand-Setup.exe` and `release/Ads-on-Demand-Portable.exe`; `pnpm start` opens the compiled app after `pnpm build`.

## Non-negotiables

- Windows-first desktop app using Electron + TypeScript.
- One shared account across the web product and desktop app.
- Docks are visibly sponsored, optional, pausable, closable, and user-controlled.
- No browsing history, keystrokes, screenshots, microphone data, forced clicks, browser manipulation, or hidden startup behavior.
- Payouts and charging are not built until their dedicated future milestone.
