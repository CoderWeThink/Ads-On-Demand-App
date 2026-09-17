# Next Build Group — Brand, Dashboard, and First Dock

**Status:** Planned on 2026-09-17. This is the agreed next group of work after the portable welcome-screen build.

## Visual direction to carry forward

The supplied logo concept becomes the preferred **next logo direction**:

- A bright-blue rounded **A** mark.
- A small ad-window and cursor inside the mark.
- A clean `Ads on Demand` wordmark, with `Ads` in blue and the rest in deep navy/near-black.
- The icon must remain recognizable at small sizes: app icon, title bar, dock badge, and taskbar.
- The exact final logo asset is still to be produced and approved; this reference is the design brief, not a license-cleared finished brand file.

## Goal of this build group

Turn the current welcome screen into the first believable version of the Windows product: a branded dashboard where a user can understand their account, see a safe demo balance, and manage a first optional desktop dock.

No real ads, credentials, payouts, billing, tracking, or always-on-top dock should be shipped as real production behavior in this group.

## Ordered work

### 1. Brand pack and app identity

- Create a production-ready version of the new logo direction.
- Export an app icon for Windows and a transparent mark for the desktop UI.
- Update the welcome screen and app window identity to use it.
- Keep the approved welcome copy and background image unless we intentionally replace them.

**Result:** the EXE, title bar, and sign-in screen all look like one product.

### 2. Dashboard shell

- After the current sign-in demo, open a normal, non-pinned Dashboard screen.
- Add a concise overview: welcome message, development-credit balance, dock status, and one clear action to manage docks.
- Use clear labels that state balances are development credits and not withdrawable.
- Add a navigation structure for Home, My docks, Activity, Profile, and Settings. Screens can be present as polished placeholders where features have not been built yet.

**Result:** the application feels like a real desktop product rather than only a sign-in page.

### 3. First dock-manager experience

- Build a `My docks` screen with a small set of example formats: Image Ad, Quick Question, and Survey.
- Let the user turn a demo dock on/off, choose a screen corner, and use Pause all.
- Make every dock choice visibly optional and explainable.
- Save demo preferences locally only; no account/API connection yet.

**Result:** users can see the core promise—choosing the sponsored docks they want—before real ad serving exists.

### 4. First native dock proof of concept

- Open one Electron dock window only when the user explicitly enables it.
- Keep it visibly labeled `Sponsored` with pause, close, and report controls.
- Test positioning, closing, pausing, restart behavior, and that the main dashboard remains a normal window.
- Use mock creative only; no outside advertisers and no earning claims tied to interaction.

**Result:** a safe, inspectable proof that the central desktop experience works.

### 5. Quality pass and portable update

- Test the complete welcome → demo dashboard → dock flow on Windows.
- Test small-window and normal desktop layouts, keyboard access, and no horizontal overflow.
- Increase the app version, rebuild the portable EXE, and verify it launches independently.
- Update the project brain, backlog, and decision log with what is actually completed.

**Result:** one updated Windows file you can run and show.

## Explicitly not in this group

- Real email/password or Google authentication.
- Railway, database, accounts, campaigns, moderation, or advertiser workspace work.
- Real impression measurement, ads from third parties, or earnings calculations.
- Payments, Plus checkout, subscriptions, withdrawals, or payouts.
- Hidden background behavior, automatic startup, or system-wide tracking.

## What we need before the later account-connected milestone

- A final approved logo asset or permission to create one from this direction.
- A Google Cloud project only when Google sign-in is ready to be implemented.
- Railway account/project access only when the API and database milestone begins.
- A Windows code-signing certificate only when preparing public releases and updates.
