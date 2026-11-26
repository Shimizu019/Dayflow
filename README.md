# DayFlow

**Offline-first personal management for Android**

DayFlow brings daily planning, expense tracking, savings goals, and personal schedules into one focused app. It is designed for a single device and local data storage, without accounts, a remote backend, or cloud synchronization.

## Product scope

- **Dashboard:** Summaries derived from stored records when SQLite integration is complete.
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

Schema, initialization code, models, and repositories are in `src/database`. The current screens are **not yet connected to those repositories**: `useDayflowStore` still contains demo data. Do not treat that demo state as production records. Frontend-to-SQLite integration is a separate milestone and has not started.

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

Capacitor 8 dependencies are installed, but this checkout does not currently contain an `android/` native project. Android synchronization and Gradle builds have not been verified. Do not recreate the native project as part of a frontend migration; review its requirements and existing configuration before adding or changing native platform files.

## Project documentation

- [UI/UX specification](docs/UI-UX-SPECIFICATION.md)
- [Database design](docs/DATABASE-DESIGN.md)
- [Entity relationship diagram](docs/ERD.md)
