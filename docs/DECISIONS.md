# Ads on Demand Decision Log

This is the short, chronological decision history. For current requirements, use `PROJECT_BRAIN.md`.

2026-09-17: User narrowed the first executable to the agreed welcome screen only. Build a portable Windows x64 EXE. Include sign-in/create-account screen states, with honest unavailable-account messages. Do not implement dashboard, docks, or backend in this increment. Background remains replaceable.

2026-09-17: User explicitly selected the supplied blue A / ad-window / cursor image and Ads on Demand wordmark as the logo to use. Preserve the exact asset as the branding source, rather than treating it only as inspiration. The next app group is branding, a local demo dashboard, dock manager, one explicitly enabled native dock proof of concept, and a portable update.

2026-09-17: The user created the private desktop-app source repository at `https://github.com/CoderWeThink/Ads-On-Demand-App`. Use incremental Git commits and versioned packages; introduce signed automatic updates before the public release phase.

2026-09-17: Version 0.1.1 replaces the temporary CSS A mark on the welcome screen with the exact approved user-supplied logo asset. Windows icon derivation remains part of the next branding step.

2026-09-17: The signed-in dashboard direction was revised and approved for preview. Display money only in USD and show `$0.00` until verified backend earnings exist—never simulated credits or sample money. Free users may save multiple dock configurations but run only one at a time; starting another automatically stops the current dock. The Home dock panel uses a real dock preview with Running/Stopped status, the stopped state is red, `Close all` requires confirmation and never resumes docks, and docks can start only from the Docks page. Recent activity is replaced on Home by a line/area earnings chart with 7D, 30D, 90D, and All ranges; Activity remains its own navigation page. The sidebar is collapsible, `My Docks` is renamed `Docks`, and multiple running docks are mentioned only as a small Plus Coming soon note.

2026-09-17: Published the unchanged welcome/sign-in/create-account app as the private GitHub pre-release `v0.1.1`. The downloadable Windows x64 asset is `Ads-on-Demand-0.1.1-Windows-x64.exe`; dashboard preview code is not included. The release remains unsigned and intended for private testing.

| Date | Decision | Reason / impact |
| --- | --- | --- |
| 2026-09-17 | Build toward the real finished product in controlled milestones. | The app will not be limited to a throwaway showcase; payout and billing remain separate later milestones. |
| 2026-09-17 | Use Electron + TypeScript for the Windows app. | Fits the existing web UI experience and supports native desktop windows, packaging, and updates. |
| 2026-09-17 | Keep one shared account for website and desktop app. | Users can sign up once; web serves advertiser/admin functions and desktop serves regular users. |
| 2026-09-17 | Use custom TypeScript API, Railway, and managed PostgreSQL. | Separates production API/database concerns from the Vercel-hosted website. |
| 2026-09-17 | Offer email/password and Google sign-in. | Keeps onboarding accessible without making Google mandatory. |
| 2026-09-17 | Launch United States first. | Keeps launch, support, and eventual payout policy manageable. |
| 2026-09-17 | Let users choose dock formats and desktop placement. | User control is a core product promise. |
| 2026-09-17 | Keep the dashboard a normal window; user-opened ad docks are always-on-top. | Matches the intended product behavior while avoiding a forced dashboard overlay. |
| 2026-09-17 | Allow consent-based interests, age band, region, and language. | Enables relevance without personal behavioral tracking or sensitive targeting. |
| 2026-09-17 | Let advertisers target broad segments or all eligible users. | Avoids exposing individual user identities to advertisers. |
| 2026-09-17 | Design Plus at $5/month as Coming soon. | Premium controls can be designed now; billing begins only after dedicated readiness work. |
| 2026-09-17 | Keep earnings non-withdrawable until payout readiness. | Avoids misleading money claims and defers financial/compliance requirements. |
