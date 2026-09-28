# Ads on Demand Backlog

Status key: **Ready** = agreed and safe to start. **Blocked** = needs an account, credential, policy decision, or earlier milestone. **Later** = intentionally deferred.

## Milestone 0 — Product command center

- [x] **Done** Create the project brain and decision record.
- [x] **Done** Create the folder structure for desktop app, API, shared code, schema, and tests.
- [x] **Done** Capture product, privacy, launch-market, and monetization defaults.

## Milestone 1 — Shared production foundation

- [ ] **Ready** Initialize the TypeScript workspace with desktop, API, shared validation, Prisma, and test packages.
- [ ] **Ready** Convert the prototype’s data model into a production PostgreSQL/Prisma schema.
- [ ] **Ready** Add accounts, profiles, consent records, devices, dock preferences, campaigns, creative, moderation, impression sessions, ledger entries, reports, subscriptions, and audit events.
- [ ] **Ready** Implement email/password sign-up, secure session rotation, and account recovery placeholders.
- [ ] **Blocked** Add Google OAuth after a Google Cloud OAuth client and approved redirect URLs exist.
- [ ] **Blocked** Provision Railway API and managed PostgreSQL after the Railway project/account is ready.

## Milestone 2 — Windows application shell

- [x] Implement the approved welcome/sign-in design in Electron + React + TypeScript; real authentication remains pending.
- [x] Package and verify the portable welcome-screen EXE (0.1.0, 2026-09-17).

- [x] **Done** Build the secure Electron main process, narrow preload bridge, renderer shell, and encrypted local state.
- [ ] **In progress** Build sign-in, onboarding, profile consent, dashboard overview, account, and settings screens. Local preview sign-in, dashboard, Activity, and Settings are present; production authentication/onboarding remain pending.
- [ ] **Ready** Add device registration and a normal Windows dashboard window.
- [x] **Done** Add encrypted local app state, local response storage, explicit preview sign-out, and explicit application Quit.

## Next build group — Brand, dashboard, and first dock

- [x] **Done** Use the approved supplied logo for the app identity, dark wordmark, Windows icon, taskbar, tray, and packaged executables.
- [x] **Done** Integrate the new app identity into the welcome screen, signed-in interface, window icon, and packaged EXE.
- [x] **Done** Implement the revised local dashboard shell from the interactive preview: USD-only `$0.00` fallback, earnings line chart, dock preview, collapsible navigation, and `Close all` confirmation. Combined with local welcome flow in v0.2.0.
- [x] **Done** Include Image, Quick Question, Survey, and Video formats in the local Docks preview with one running preview at a time.
- [x] **Done** Build a local-only Docks manager with one running dock at a time; starting another stops and replaces the current dock.
- [x] **Done** Build and test user-enabled, visibly Sponsored native Image, Video, Quick Question, and Survey docks.
- [x] **Done** Verify the full local demo flow and package branded installer and portable Windows executables as 0.3.0.

## Milestone 3 — Dock manager

- [x] **Done** Build the local dock manager: format selection, monitor/location selection, scale, visibility, close, reposition, and restore preferences. Server synchronization remains pending.
- [x] **Done** Build native always-on-top dock windows with obvious Sponsored labeling and no standard window chrome.
- [ ] **Ready** Add report-ad and dock settings flows.
- [ ] **In progress** Persist user-selected layout locally. API/device synchronization remains pending.
- [ ] **In progress** Test monitor recovery, restart recovery, Close all, tray/background behavior, and explicit Quit. Automated multi-monitor coverage remains pending.
- [x] **Done** Fix idle background lifecycle: closing the dashboard with no active dock quits, and closing the final dock while the dashboard is hidden quits the remaining tray process.

## Milestone 4 — Marketplace connection

- [ ] **Ready** Port advertiser campaign, creative submission, moderation, and reporting APIs from the prototype to the production service.
- [ ] **Ready** Add broad audience rules and all-eligible-users delivery.
- [ ] **Ready** Add server-validated eligible-ad request, impression start, and completion flows.
- [ ] **Ready** Add rate limits, budget limits, duplicate protection, device verification, audit logs, and fraud flags.

## Milestone 5 — Ledger and Plus preparation

- [ ] **Ready** Add the immutable earnings ledger and USD history UI. Until verified backend data exists, show `$0.00`; do not display simulated credits or sample money.
- [ ] **Ready** Add Plus Coming soon screen, entitlement model, and feature gates without checkout or charges.
- [ ] **Later** Add real subscription billing only after a separate billing plan and provider decision.
- [ ] **Later** Add withdrawals only after a dedicated payments, compliance, fraud, and support milestone.

## Milestone 6 — Release readiness

- [ ] **Blocked** Set up Windows code signing certificate and staged auto-update channel.
- [ ] **Ready** Add accessibility, security, offline, installer, update, and end-to-end test suites.
- [ ] **Ready** Write privacy policy, terms, user support, moderation, and incident response materials.
- [ ] **Later** Run closed beta, review feedback, and stage US availability.
