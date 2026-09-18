# Ads on Demand Project Brain

> **Purpose:** This is the durable memory for the Ads on Demand app. Read it before making a material product or implementation decision; update it after the decision is made.

## 1. Product in one sentence

Ads on Demand is a Windows desktop product where users voluntarily choose sponsored desktop docks, control exactly how those docks appear, and can eventually earn from eligible ad activity while advertisers use a separate web workspace to reach broad, consented audiences.

## 2. Product principles

| Principle | What it means in the product |
| --- | --- |
| Choice first | A user can choose, move, pause, close, report, or disable each dock. |
| Clear sponsorship | Every ad surface visibly says it is sponsored. |
| Privacy by design | Do not collect browsing history, keystrokes, screenshots, passwords, microphone data, or unrelated personal data. |
| Separate roles | Regular users primarily use the Windows app; advertisers and administrators primarily use web workspaces. |
| Honest money language | Until payouts exist, balances are development credits and cannot be withdrawn. |
| Safety controls are free | Plus can never remove a user’s free pause, close, reporting, or opt-out controls. |

## 3. Locked product decisions

| Decision | Locked choice |
| --- | --- |
| Primary platform | Windows first. |
| Desktop technology | Electron + TypeScript. |
| Website role | Marketing, signup, advertiser workspace, admin workspace, support, and account management. |
| Account model | One shared account across website and desktop app. |
| Sign-in | Email/password and Google sign-in. |
| API | Custom TypeScript API. |
| API/database hosting | Railway with managed PostgreSQL. |
| Website hosting | Vercel. |
| Desktop app source repository | `https://github.com/CoderWeThink/Ads-On-Demand-App` (user-created, 2026-09-17). |
| Initial launch territory | United States only. |
| Relevance profile | Optional interests, age band, region, and language; editable and consent-based. |
| Advertiser targeting | Broad eligible segments or all eligible users; no user identity or sensitive personal targeting. |
| Main dashboard | A normal Windows application window, never forced always-on-top. |
| Ad docks | User-selected, always-on-top dock windows that the user can pause, close, move, or disable. |
| Plus plan | $5/month concept for extra controls; show as **Coming soon** initially; no billing implementation yet. |
| Earnings | Build a durable ledger first; no payout provider or withdrawals until a later dedicated milestone. |
| Logo | Use the user-supplied blue A / ad-window / cursor `Ads on Demand` logo asset; do not substitute a different logo without user approval. |

## 4. User experience map

### Regular user

1. Creates or signs into a shared account on the website or desktop app.
2. Confirms United States availability and selects an editable relevance profile.
3. Opens the normal Windows dashboard.
4. Chooses dock formats, location, size, and preferences.
5. Starts, pauses, moves, closes, reports, or disables docks at any time.
6. Views device status, a USD earnings overview/chart, and a separate activity history. Until verified backend earnings exist, every money value is `$0.00`; never substitute credits or sample money.
7. Can explore Plus controls, which are visibly marked Coming soon.

### Advertiser

1. Signs into the web workspace.
2. Creates a campaign, budget, creative, and broad targeting rule or chooses all eligible users.
3. Submits creative for moderation.
4. Views campaign activity only after approval.

### Administrator

1. Reviews ads before delivery.
2. Reviews reports, account/device health, and server-generated fraud signals.
3. Audits decisions and resolves moderation issues.

## 5. Desktop app requirements

- Secure Electron application with context isolation and a narrow, typed preload bridge.
- Normal dashboard window with overview, earnings, Docks, Activity, device, profile, settings, account, and Plus pages.
- Free users may save multiple dock configurations but can run only one at a time. Starting another dock automatically stops the current dock; multiple running docks may be a Plus feature later.
- Home shows the running dock as inspectable product UI, with green Running or red Stopped state. `Close all` requires confirmation and can only close; docks start from the Docks page.
- Home uses a line/area earnings chart with 7D, 30D, 90D, and All ranges. Activity remains a separate page.
- One native dock window per active dock; each is visibly sponsored and contains controls for pause, close, placement, report, and settings.
- Dock preferences persist per device and restore only when the user has opted in.
- No auto-start by default; startup behavior is an explicit opt-in setting.
- Docks must not impersonate Windows notifications or capture user input outside their own UI.
- User actions that affect delivery are reflected by the API and stored in the audit trail.

## 6. Production architecture

```text
Vercel website
  ├─ marketing + signup
  ├─ advertiser workspace
  └─ admin workspace
          │
          ▼
Railway TypeScript API ─── Managed PostgreSQL
          ▲                      ├─ accounts / profiles / consent
          │                      ├─ devices / dock preferences
Electron Windows app            ├─ campaigns / creative / moderation
  ├─ dashboard                  ├─ impression sessions / ledger
  └─ controlled dock windows    └─ reports / audit / subscription state
```

## 7. Data boundaries

### May store with explicit consent

- Account identity and authentication records.
- Interest topics, age band, US region, language, and consent version.
- Device registration, dock settings, campaign eligibility, impression sessions, earnings ledger, and reports.

### Must not collect

- Browsing history, typed text, clipboard contents, screenshots, passwords, microphone/camera data, or unrelated application activity.
- Sensitive personal traits or free-text profile details for ad targeting.
- Individual user identities in advertiser-facing audience results.

## 8. Current milestone

**Milestone 1B — Brand, dashboard, and first dock design (2026-09-17)**

User authorized only the decided welcome screen in a portable executable. React + TypeScript renderer and isolated Electron window are implemented. No dashboard, docks, account backend, billing, or payouts are included. Authentication actions explain that services are coming soon and do not transmit or persist credentials. The background is bundled locally and replaceable. Packaging and native verification are complete: `release/Ads-on-Demand.exe` launches independently, and the welcome/create-account screens were inspected in Windows. See `WELCOME_BUILD.md` for the checksum, validation, and limitations. Next work requires the user's choice of the next screen or feature.

The unchanged welcome/sign-in/create-account build is available to authorized repository users from the private GitHub pre-release `v0.1.1`: `https://github.com/CoderWeThink/Ads-On-Demand-App/releases/tag/v0.1.1`. The downloadable asset is the tested Windows x64 portable EXE; it does not contain the newer dashboard preview.

Approved copy: “YOUR DESKTOP, YOUR ADS.”; bold “Ads you actually want.” with only “actually” blue; “Pick ads that fit your interests and earn in ways that are easier than ever before.”; bold “Welcome back.” No left-panel privacy badge.

On 2026-09-17, the user explicitly confirmed the supplied blue A / ad-window / cursor image with the `Ads on Demand` wordmark as the logo to use. The exact supplied asset is stored at `assets/branding/ads-on-demand-approved-logo.png` and is the source for future app branding. The agreed next build group is brand integration, a local demo dashboard, a dock manager, one opt-in native dock proof of concept, and a tested portable update. See `REAL_APP_BUILD_PLAN.md`.

The revised dashboard preview is now the approved working direction. It removes preview/developer controls, replaces credits with USD-only `$0.00` fallback values, replaces Home activity with a trading-style line/area earnings chart, uses a visual dock preview, limits free accounts to one running dock, renames `My Docks` to `Docks`, adds a collapsible sidebar, and changes `Pause all` to confirmation-based `Close all`. These preview decisions are not yet implemented in the Electron renderer and must not be pushed until the user asks.

- [x] Product direction agreed.
- [x] Technology direction agreed.
- [x] Privacy and user-control guardrails recorded.
- [x] Build order and backlog created.
- [x] Initialize the desktop welcome-screen code after user restart approval.
- [x] Record the next logo direction and ordered next-build group.
- [x] Integrate the exact approved logo asset into the welcome screen (version 0.1.1).

## 9. Deferred milestones and risks

| Item | Why it is deferred |
| --- | --- |
| Real payouts | Requires fraud controls, identity/tax considerations, payout provider, legal review, support procedures, and financial reconciliation. |
| $5 billing | Requires a billing provider, account management, invoices/refunds, taxes, and support before charging anyone. |
| Google OAuth credentials | Needs a Google Cloud project and redirect URI setup. |
| Code signing / auto-updates | Needs an organization certificate, secure update channel, and release process. |
| Production analytics | Must be limited to product health and requires a written privacy notice and retention policy. |

## 10. Update protocol

When work resumes:

1. Read this file and the backlog before changing code.
2. Move the relevant backlog item to In progress.
3. Record changed decisions in `DECISIONS.md`.
4. Update this milestone and next-action list after testing.

## 11. Release update strategy

1. Make an incremental change in the app source—only the relevant screen, feature, or fix.
2. Run checks and package a versioned Windows release (for example, `0.1.0` → `0.1.1`). Building an EXE is a normal packaging step, not a full rewrite of the app.
3. Commit and push the change to the private GitHub repository.
4. During early testing, distribute the new portable EXE manually.
5. Before a public launch, add code signing and a hosted Electron update feed. Then installed app versions can check for a signed update, download it, and apply it on the next restart.

Never place passwords, database URLs, API keys, signing credentials, or OAuth secrets in GitHub commits.
