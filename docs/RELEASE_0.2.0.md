# Ads on Demand 0.2.0 — Dashboard Preview

This Windows x64 portable build combines the existing welcome/sign-in/create-account UI and the approved dashboard. The supplied transparent logo is used directly, without background removal. Both forms accept passwords of at least five characters.

## Try it

Download `Ads-on-Demand-0.2.0-Windows-x64.exe` from the GitHub release and open it. No developer tools or separate files are required. Enter any valid email and at least five characters to explore the local dashboard. This preview does not create an account, authenticate you, save credentials, or send them to a server.

## Included

- Available earnings, today, and chart totals remain $0.00.
- Earnings chart with 7D, 30D, 90D, All, and pointer details.
- Collapsible sidebar and account sign-out back to welcome.
- Dock preview with Running/Stopped state, Close all confirmation, and restart from Docks.
- Image, Quick Question, Survey, and Video formats; only one running preview at a time.
- Activity records local dock actions for the current session.

Native desktop overlay windows, real ad/video delivery, production authentication, profile/settings services, billing, and payouts remain pending. This is an unsigned preview for testing and brainstorming. The private repository requires collaborator access to download.

## Verification

TypeScript checks and Vite build passed. Automated checks against the packaged Electron runtime verified five-character sign-in/create-account entry, rejection of four characters, sign-out, single-dock switching including Video, Close all confirmation and disabled state, chart ranges, collapse/expand, and narrow-window overflow. Screenshots of welcome and dashboard were inspected. The standalone portable launcher was separately run and successfully opened the dashboard from sign-in.

Build command: `electron-builder --win portable --x64 --config.directories.output=release/0.2.0-final --config.compression=store` after compiling. The uncompressed portable bundle favors packaging speed; its size is 418,063,135 bytes.
