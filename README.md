# DayFlow

**Offline-first personal management for Android**

DayFlow brings daily planning, expense tracking, savings goals, and personal schedules into one focused app. It is designed for a single device and local data storage, without accounts, a remote backend, or cloud synchronization.

## Release status

**Dayflow v1.0.2 — Early Access** (GitHub pre-release, tag `v1.0.2`)

- Status: **Early Access** — not yet fully verified on Android devices; user feedback is needed.
- Version consistency: `package.json` `1.0.2`; `package-lock.json` `1.0.2`; Android `versionName` `1.0.2`; Android `versionCode` `3`; Application ID `com.dayflow.app`.
- Release type: GitHub Pre-release.

## Product scope
DayFlow brings daily planning, expense tracking, savings goals, and personal schedules into one focused app. It is designed for a single device and local data storage, without accounts, a remote backend, or cloud synchronization.

## Product scope

- **Dashboard:** Summaries derived from stored records (expenses, savings, tasks, activity log) persisted in SQLite.
- **My Wallet:** Expense tracking for `Food & Drinks`, `Transport`, and `Others`. Amounts are stored as integer centavos (`₱1.00 = 100`). There are no income or wallet-balance features in the approved scope.
- **Savings:** Each goal has an aggregate current amount and target amount. There is no contributions history.
- **Tasks:** `All`, `Pending`, and `Completed` filters, with `High`, `Medium`, and `Low` priorities.
- **Schedule:** One-time events only; recurring events are out of scope.
- **Profile and Theme:** Local appearance preferences with preview and persistence. There is no logout flow.
- **Backup and Restore:** Inactive until implemented and verified.

The app has no password lock or authentication flow in its approved architecture.

## Technology stack

| Area | Technology |
|---|---|
| UI | React 19 and TypeScript |
| Development and production builds | Vite 8 |
| Navigation | React Router 7, client-side routing |
| State | Zustand 5; persist middleware for lightweight UI preferences |
| Styling | Tailwind CSS 3.4.17, PostCSS, Autoprefixer, and custom CSS variables |
| Icons and charts | Lucide React and Recharts |
| Linting and type checking | Oxlint and the TypeScript compiler |
| Android runtime | Capacitor 8 |
| Local database | SQLite through `@capacitor-community/sqlite` 8.x |
| Android tooling | Android Studio and Gradle |

Capacitor packages use aligned 8.x versions. See `package.json` and `package-lock.json` for the exact installed versions. Node.js 22 or newer is required for the current Capacitor toolchain.

## Data and architecture

SQLite is the planned single source of truth for expenses, savings goals, tasks, schedule events, application preferences, and activity history. The approved schema contains six tables:

- `expenses`
- `savings_goals`
- `tasks`
- `schedule_activities`
- `application_preferences`
- `activity_log`

Schema, initialization code, models, and repositories are in `src/database`. The application's data-layer repositories and SQLite schema are now implemented. `useDayflowStore` contains state management wiring to access those repositories. Persistent application records are stored in SQLite and may differ from the demo state shown in the UI. Frontend-to-SQLite integration continues beyond this Early Access release.

Zustand persistence is limited to lightweight interface state (selected schedule day and task/wallet filters). Persistent application records must not be copied into browser storage.

There is no remote backend, cloud sync, or account system.

## Design direction

The existing DayFlow UI and branding should be preserved during technical work:

- Primary purple: `#6D42EF`; dark purple: `#6338E8`; deep purple: `#5028CE`.
- Pale lavender background: `#F4F1FE`; primary text: `#191627`; secondary text: `#7B768F`.
- Plus Jakarta Sans with Inter fallback; no external font CDN.
- Seven client-side screens: Dashboard, My Wallet, Savings, Tasks, Schedule, Profile, and Theme.
- White bottom navigation with a curved central notch, elevated center `+` action, and centered Add New modal.

The font-family names are configured in CSS, but no local font files are currently present in the repository.

## Development

Install dependencies and start the Vite development server:

```bash
npm ci
npm run dev
```

Useful project commands:

```bash
npm run lint
npm run typecheck
npm run build
npm run preview
```

## Android status

Capacitor 8 dependencies are installed and an `android/` native project is now present in the working tree. Android synchronization and Gradle builds have been verified locally. The native project uses Gradle, and source files under `android/` are tracked in the repository; build outputs (`android/app/build/`, `android/build/`), local machine configuration (`android/local.properties`), and signing files are ignored. Release signing is optional and can be enabled via environment variables. Debug signing remains unchanged. Do not recreate the native project as part of a frontend migration; review its requirements and existing configuration before adding or changing native platform files.

## Project documentation

- [UI/UX specification](docs/UI-UX-SPECIFICATION.md)
- [Database design](docs/DATABASE-DESIGN.md)
- [Entity relationship diagram](docs/ERD.md)

## Installation — Android

1. Download the APK from the releases page (v1.0.2).
2. Enable "Install from unknown sources" in Android settings.
3. Install the APK and launch Dayflow.
4. Minimum Android version: **Android 7.0 (API 24)** / `compileSdkVersion` 36.

## Known limitations

- No release signing configured — APK is unsigned and requires manual sideloading after a keystore is configured.
- Backup and Restore are inactive until implemented and verified.
- Fonts use system fallbacks (Plus Jakarta Sans / Inter); no local font files bundled in production.
- No automated test coverage; device installation, offline behavior, and persistence-after-restart have not yet been device-tested.
- Some lint warnings about impure `Date()` calls during render (non-blocking, cosmetic).
- Public assets folder (`public/`) contains only empty subdirectories; `index.html` references `/icons/favicon.svg`, which is missing — add a favicon asset before shipping.

## Version consistency

| Field | Value |
|---|---|
| `package.json` version | `1.0.2` |
| `package-lock.json` version | `1.0.2` |
| Android `versionName` | `"1.0.2"` |
| Android `versionCode` | `3` |
| Application ID | `com.dayflow.app` (unchanged) |

## Signing configuration

Debug signing is automatic and unchanged. Release signing is optional and enabled through environment variables:

- `DAYFLOW_RELEASE_STORE_FILE` — absolute path to the release keystore (`.jks` or `.keystore`)
- `DAYFLOW_RELEASE_STORE_PASSWORD` — keystore password
- `DAYFLOW_RELEASE_KEY_ALIAS` — key alias (default: `dayflow`)
- `DAYFLOW_RELEASE_KEY_PASSWORD` — key password

Passwords are never committed. Signing-related private files (`*.jks`, `*.keystore`, `*.bks`, `*.p12`, `android/key.properties`) are ignored. If not all variables are set, release builds remain unsigned.

## Repository completeness

Tracked: `src/` (all source), `docs/`, `public/` (asset dirs; see limitations above), `LICENSE`, `README.md`, `package.json`, `package-lock.json`, `tailwind.config.cjs`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `capacitor.config.ts`, `postcss.config.cjs`, `index.html`, `.gitignore`, `.oxlintrc.json`.

Android project source is now tracked under `android/`; ignored: `android/.gradle/`, `android/build/`, `android/app/build/`, `android/local.properties`, `android/key.properties`, and all keystore files.

Ignored by design: `node_modules/`, `dist/`, `build/`, `*.local`, `.env*`, `.idea/`, `coverage/`, `*.tsbuildinfo`, `*.log`, `gradlew` / `gradlew.bat`, `variables.gradle`, `gradle.properties`, `capacitor.settings.gradle`, `*.tgz`, `.cache/`.

## Git status

Uncommitted working-tree changes exist in: `package.json`, `src/database/connection.ts`, `src/database/initializeDatabase.ts`, `src/store/useDayflowStore.ts` — your existing work preserved, not staged or committed. Untracked artifacts (not part of source): `status.txt`, `untracked.txt`, `src/assets.d.ts`, `src/store/useDayflowStore.ts.bak`, and `"h savings screen"` (an untracked diff artifact). Unknown files were not deleted per release policy.

## Feedback and bug reporting

Please open an issue on the GitHub repository with:
- Device model and Android version
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots if applicable

Thank you for testing Dayflow Early Access!
