# Ads on Demand Build Roadmap

## What will be built first

| Step | Deliverable | Completion signal |
| --- | --- | --- |
| 1 | Production workspace and database baseline | TypeScript workspace, Prisma schema, local database path, and automated checks run. |
| 2 | Shared account foundation | A user can register, sign in, edit profile/consent, and register a Windows device. |
| 3 | Electron dashboard | The signed-in app has a normal window with dashboard, account, profile, preferences, and device controls. |
| 4 | Real dock controls | The user can create, place, pause, close, report, and restore clearly sponsored dock windows. |
| 5 | Marketplace flow | Approved campaigns can serve only to eligible opted-in docks; server validates every eligible impression. |
| 6 | Earnings and web workspaces | Development ledger works; advertiser and administrator web workflows use the shared API. |
| 7 | Release preparation | Tests, installer, code signing, staged updates, privacy/support material, and closed-beta readiness are complete. |

## What will not be built during the first foundation pass

- Real payout methods, withdrawal requests, tax forms, bank accounts, crypto, or payment account storage.
- A live $5 checkout or recurring subscription charge.
- Global launch support.
- Sensitive or behavioral ad targeting.
- Hidden background collection, forced overlays, or non-user-controlled startup.

## External setup needed later

| Service | Needed for | When |
| --- | --- | --- |
| Railway | API hosting and managed PostgreSQL | Before production API deployment. |
| Google Cloud | Google sign-in OAuth credentials | Before enabling Google sign-in. |
| Windows code-signing provider | Trusted installer and auto-updates | Before closed beta distribution. |
| Payment/subscription provider | Later Plus billing | Only after billing milestone approval. |
| Payout provider | Later withdrawals | Only after compliance/payout milestone approval. |

## Working rule

Build and test one milestone at a time. A later milestone may be designed in advance, but it must not be enabled for users until its own privacy, security, operations, and support checklist is complete.
