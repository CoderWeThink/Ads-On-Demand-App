# Building the Real Ads on Demand App

**Created:** 2026-09-17
**Purpose:** Turn the current portable welcome-screen demonstration into a real, safe product—not just a downloadable file.

## First: what “real app” means

The `.exe` is simply the way a Windows application is delivered. The existing `.exe` proves the app can open and show its first screen, but it is not yet the live product because it has no accounts, server, database, user settings, dock service, advertiser review process, or real release/update system.

## Source home and update path

The official private source repository is `https://github.com/CoderWeThink/Ads-On-Demand-App`.

We will develop incrementally: edit only the feature or bug that needs work, test it, then push that small change to GitHub. A new `.exe` still has to be packaged for every version because it contains the updated app files, but this does **not** mean rebuilding or rewriting the product from scratch.

For the first testing phase, each update is a new downloadable EXE. Before a public release, we will add signed automatic updates so people who already installed Ads on Demand can receive a verified update and install it when the app restarts.

A real launch needs these connected parts:

```text
Windows app  <──secure sign-in/settings──>  API + database
     │                                          │
     ├── user-controlled docks                  ├── accounts / consent / devices
     └── local app preferences                  ├── approved ads / reports / audit log
                                                └── future development-credit ledger

Website (Vercel) <──────────────────────────────┘
  marketing, signup, advertiser workspace, admin workspace
```

## Approved logo asset — locked

Use this **specific supplied image** as the approved brand reference and source asset for the next app version:

- File: `assets/branding/ads-on-demand-approved-logo.png`
- SHA-256: `3DAB8384730D336D65ED175D21B3DFB4393E5ED196F88726E393E73136353205`
- Includes: blue A mark, ad-window/cursor graphic, and the `Ads on Demand` wordmark.

We will use the full version on sign-in and marketing-facing screens, and derive a cropped icon from the same supplied asset for the Windows app icon/taskbar. We will not substitute a newly invented logo without your instruction.

## What must be built, in the right order

| Stage | What we build | Why it comes here |
| --- | --- | --- |
| 1. Product-ready desktop experience | Brand assets, dashboard, local dock manager, one user-enabled mock dock | Makes the desktop app feel real before connecting sensitive services. |
| 2. Shared account foundation | API, PostgreSQL database, email/password sign-up, sessions, recovery, consent profile, device registration | Lets the app and website use one safe account system. |
| 3. Connected user app | Real sign-in, onboarding, profile/settings sync, local encrypted session storage, dashboard data | Converts the local demo into a user product. |
| 4. Safe dock system | Native user-enabled dock windows, saved layout, pause/close/report, restart recovery, multi-monitor tests | Delivers the central Ads on Demand feature with user control. |
| 5. Advertiser and admin web tools | Campaign drafts, creative upload, broad targeting, moderation, reports, audit history | Ensures only reviewed creative can be eligible to appear. |
| 6. Delivery and development credits | Eligible-ad selection, validated impression sessions, duplicate prevention, immutable development-credit ledger | Allows product testing without pretending money is available to withdraw. |
| 7. Release readiness | Security testing, privacy/terms/support pages, signed installer, controlled updates, closed beta | Makes installation and support responsible for real people. |
| 8. Later financial milestone | Billing, payouts, tax/identity process, fraud review, customer support operations | Must be designed separately before anyone is charged or paid. |

## Next concrete build group

This is what we can begin next without needing any outside accounts:

1. Put the approved logo into the app window and welcome screen.
2. Build the local dashboard that opens after the demo sign-in.
3. Build `My docks`: select an example format, choose a corner, and pause all.
4. Build one explicitly enabled mock dock with a clear `Sponsored` label and pause, close, and report actions.
5. Test it and package a new Windows `.exe`.

That gives us a genuine **desktop product prototype**. It still will not show outside ads, use real earnings, or collect personal data.

## Things we will need from you later

Nothing below is required to start the next desktop prototype group. These become necessary when we connect live services:

| When we reach | What you will need to provide or approve |
| --- | --- |
| Real account system | Railway account/project for the API and managed PostgreSQL; a secure production domain/subdomain for API endpoints. |
| Email sign-in | An email delivery provider and approved sender address for verification and password-recovery messages. |
| Google sign-in | A Google Cloud OAuth client, consent-screen details, and approved redirect URLs. |
| Public app release | A Windows code-signing certificate and an update-hosting decision. |
| Real advertisers | Creative rules, moderation policy, advertiser terms, and a review owner. |
| Real money | Legal/business review, payout provider, tax/identity approach, fraud prevention, support process, and a precise user agreement. |

## Rules that stay in force

- Only people who opt in can activate docks.
- Docks must clearly identify themselves as Sponsored and offer pause, close, placement, and reporting controls.
- No browsing history, typing, screenshots, clipboard, microphone, camera, passwords, or hidden system monitoring.
- Advertisers only work with broad consented groups; they do not see a person’s identity.
- Development credits are not money, cannot be withdrawn, and do not imply a payout promise.
- The regular-user Windows app and advertiser/admin web tools remain separate experiences using the same account system.
