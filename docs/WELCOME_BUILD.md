# Portable welcome screen — 0.1.0

Built 2026-09-17 for Windows x64. Deliverable: `release/Ads-on-Demand.exe` (102,667,457 bytes).

SHA-256: `E74077DC0207ADFBCC3F15D5537C2E27378FA4984DC3217BB611207CCB58644F`

## Included

- Approved split welcome/sign-in screen and bundled, replaceable background image.
- Bold headings with blue “actually,” revised eyebrow/copy, no privacy badge on the left.
- Sign-in/create-account tabs, password visibility toggle, local form validation, and unavailable-service explanations.
- Normal native Windows title bar with minimize, maximize, close, resize, and single-instance behavior.
- Sandboxed renderer, no Node integration, denied permissions/navigation/new windows, and no network connections allowed by the page policy.

## Verification

- `pnpm check` passed for renderer and Electron main process.
- `pnpm portable` completed successfully.
- Native Computer inspection of the packaged app verified the image, approved copy, bold headings, blue word, complete controls, and no layout clipping at default size.
- Final single-file launcher opened successfully after the unpacked test build was closed. Computer inspection verified the extracted runtime window, full welcome design, and switching to Create account without clipping. Left open for the user.

## Boundaries

This is only the requested first screen. Sign-in, Google authentication, password recovery, and account creation are not connected; buttons never claim success. No dashboard, advertising dock, payment, or server is included. The binary is unsigned and may display an unknown-publisher warning on other computers. No Windows security settings were changed.
