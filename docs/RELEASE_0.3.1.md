# Ads on Demand 0.3.1 — Fixed run in background issue

Version 0.3.1 is a focused lifecycle correction to the private Windows x64 native-dock preview.

## Fixed

- Closing the dashboard with no active dock now quits Ads on Demand completely.
- The app may remain in the system tray only while a dock is actively running and the background setting is enabled.
- Closing the final dock while the dashboard is hidden now shuts down the remaining tray/background process automatically.
- If the active dock unexpectedly closes, its running state is cleared and an otherwise hidden idle app exits.
- Settings now explain that background operation depends on an active dock.

This means the portable build should no longer require Task Manager after you close it without leaving a dock running.

## Still included

- Branded Ads on Demand executable, installer, taskbar icon, and tray icon.
- Native always-on-top Image, Video, Quick Question, and Survey docks.
- One running dock at a time with display, placement, scale, reposition, replace, and close controls.
- Encrypted local settings, Activity events, and question/survey responses.

## Not included yet

- Production accounts, Railway/PostgreSQL services, live advertiser delivery, verified earnings, subscriptions, withdrawals, code signing, or automatic updates.

The build remains unsigned and intended for private testing. Windows SmartScreen may display an unknown-publisher warning.

## Verification

- `pnpm check` — passed.
- Production renderer/main-process build — passed.
- Closing the dashboard with no dock — process exited.
- Closing the dashboard with an active dock — dock and process remained running.
- Closing the final dock while the dashboard was hidden — process exited.
- Windows installer and portable packaging — passed.
- Packaged product metadata — `Ads on Demand`, version `0.3.1`.

## SHA-256

```text
Ads-on-Demand-Setup.exe
AD4168CCFF1C1341E765D2029E5A80A784E9FA724D0572CB752E596226F6C625

Ads-on-Demand-Portable.exe
B50413CB31286B09DE6424DE3714A2CC011F263FE00D559EF591525F02F13A29
```
