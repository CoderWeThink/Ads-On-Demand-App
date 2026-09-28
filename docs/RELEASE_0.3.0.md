# Ads on Demand 0.3.0 — Native Docks

Version 0.3.0 is a private Windows x64 testing release. It introduces the first real native desktop docks, background tray behavior, encrypted local app state, and complete Ads on Demand branding.

## Downloads

- `Ads-on-Demand-Setup.exe` — guided per-user Windows installer.
- `Ads-on-Demand-Portable.exe` — single-file portable build; no installation required.

## Included

- Ads on Demand product name, approved logo, Windows icon, taskbar icon, and tray icon.
- Welcome, local preview sign-in, signed-in dashboard, Docks, Activity, Earnings, Settings, account, and Plus preview pages.
- Separate frameless always-on-top Image, Video, Quick Question, and Survey dock windows.
- One running dock at a time, with start/replace, close, display, placement preset, scale, and temporary drag-to-reposition controls in the dashboard.
- System tray behavior: closing the dashboard hides it by default while the app and running dock stay active.
- Configurable background behavior, optional launch at login, and optional restore-last-dock behavior.
- Encrypted local settings, dock state, Activity events, and predefined question/survey responses.
- Duplicate-response rejection and local response deletion.
- USD-only earnings display fixed at `$0.00` until verified production earnings exist.

## Not included yet

- Production account authentication, Google sign-in, or account recovery.
- Railway API, PostgreSQL storage, live advertiser delivery, server moderation, or device registration.
- Verified impressions, real earnings, subscriptions, charges, withdrawals, or payouts.
- Report-ad workflow, production analytics, signed updates, or automatic updates.

Local preview credentials are not transmitted or retained. Question and survey responses are stored only on the device in encrypted local state.

## Windows and security notice

These files are currently unsigned. Windows SmartScreen may display an unknown-publisher warning. They are intended for private testing until the code-signing and staged-update milestone is complete.

## Verification

- `pnpm check` — passed.
- `pnpm build` — passed.
- Windows NSIS installer packaging — passed.
- Windows portable packaging — passed.
- Product metadata — `Ads on Demand`, version `0.3.0`.
- Dashboard, Docks, Activity, Settings, Image Dock, and Quick Question Dock inspected in the running Windows app.
- One-dock replacement, local answer save, duplicate rejection, reposition mode, and background process/dock persistence exercised.

## SHA-256

```text
Ads-on-Demand-Setup.exe
03F90C7CC1474CD487BF1018B55F8512FDB55FD159F473BD7D34C0733C08677C

Ads-on-Demand-Portable.exe
D579DB154DE86CF80D69DAE21784160CF231154A0EC3D584DCD3207156F3D78B
```
