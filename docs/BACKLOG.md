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

- [ ] **Ready** Build the secure Electron main process, preload bridge, and renderer shell.
- [ ] **Ready** Build sign-in, onboarding, profile consent, dashboard overview, account, and settings screens.
- [ ] **Ready** Add device registration and a normal Windows dashboard window.
- [ ] **Ready** Add local encrypted session storage and explicit account sign-out.

## Next build group — Brand, dashboard, and first dock

- [ ] **In progress** Use the approved supplied `ads-on-demand-approved-logo.png` asset for the app identity. The welcome screen is complete; Windows icon packaging remains.
- [ ] **Ready** Integrate the new app identity into the welcome screen, window icon, and packaged EXE.
- [x] **Done** Implement the revised local dashboard shell from the interactive preview: USD-only `$0.00` fallback, earnings line chart, dock preview, collapsible navigation, and `Close all` confirmation. Combined with local welcome flow in v0.2.0.
- [x] **Done** Include Image, Quick Question, Survey, and Video formats in the local Docks preview with one running preview at a time.
- [ ] **Ready** Build a local-only Docks manager that can save multiple configurations but run only one dock at a time; starting another stops the current dock.
- [ ] **Ready** Build and test one user-enabled, visibly Sponsored native dock proof of concept.
- [ ] **Ready** Verify the full demo flow and package the next portable Windows EXE.

## Milestone 3 — Dock manager

- [ ] **Ready** Build dock manager: format selection, monitor/location selection, size, visibility, pause, close, and restore preferences.
- [ ] **Ready** Build native always-on-top dock windows with obvious Sponsored labeling.
- [ ] **Ready** Add report-ad and dock settings flows.
- [ ] **Ready** Persist user-selected layout per registered device.
- [ ] **Ready** Test one-monitor and multi-monitor behavior, restart recovery, Close all, and normal dashboard minimize/close behavior.

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
