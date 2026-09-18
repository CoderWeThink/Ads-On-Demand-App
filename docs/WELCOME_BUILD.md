# Portable welcome screen — 0.1.1

Rebuilt and published 2026-09-17 for Windows x64. Local deliverable: `release/Ads-on-Demand.exe` (104,302,732 bytes). GitHub release asset: `Ads-on-Demand-0.1.1-Windows-x64.exe`.

Release: `https://github.com/CoderWeThink/Ads-On-Demand-App/releases/tag/v0.1.1`

SHA-256: `317367D356099C15119670257EEE0E2EF4C01D8BA77FE722F88C683EA2A408EC`

## Included

- Approved split welcome/sign-in screen and bundled, replaceable background image.
- Bold headings with blue “actually,” revised eyebrow/copy, no privacy badge on the left.
- Sign-in/create-account tabs, password visibility toggle, local form validation, and unavailable-service explanations.
- Normal native Windows title bar with minimize, maximize, close, resize, and single-instance behavior.
- Sandboxed renderer, no Node integration, denied permissions/navigation/new windows, and no network connections allowed by the page policy.

## Verification

- `pnpm check` passed for renderer and Electron main process.
- `pnpm portable` completed successfully.
- The rebuilt portable launcher opened successfully as version 0.1.1.
- GitHub accepted the 104,302,732-byte asset and reports the same SHA-256 digest shown above.
- Native Computer inspection of the packaged app verified the image, approved copy, bold headings, blue word, complete controls, and no layout clipping at default size.
- Final single-file launcher opened successfully after the unpacked test build was closed. Computer inspection verified the extracted runtime window, full welcome design, and switching to Create account without clipping. Left open for the user.

## Boundaries

This is only the requested first screen. Sign-in, Google authentication, password recovery, and account creation are not connected; buttons never claim success. No dashboard, advertising dock, payment, or server is included. The binary is unsigned and may display an unknown-publisher warning on other computers. No Windows security settings were changed.
