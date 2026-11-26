# Dayflow Database Design

## Approval Status
**M3A.2 Finalized:** All 7 database decisions approved for M3B implementation.

---

## Decision 1 — Currency Format (APPROVED)
- **Storage:** INTEGER (whole number in centavos)
- **Conversion:** 100 centavos = ₱1.00
- **Display:** UI formats to 2 decimal places with ₱ symbol
- **Example:**
  - ₱1,250.00 = 125000 (stored)
  - ₱1,250.50 = 125050 (stored)
- **Affected Tables:** `expenses.amount`, `savings_goals.target_amount`, `savings_goals.current_amount`
- **Constraint:** No floating-point arithmetic in stored values; all calculations convert to centavos, compute, then format for display.

---

## Decision 2 — Expense Categories (APPROVED)
- **Exact Categories (4 only):**
  1. Food & Drinks
  2. Transport
  3. Others
- **Strict Constraint:** Do NOT add Entertainment, Utilities, Health, or Education without explicit approval.
- **Affected Table:** `expenses.category`
- **Rationale:** Matches existing Dayflow frontend exactly. New categories require separate approval process.

---

## Decision 3 — Task Priority Colors (APPROVED)
- **Presentation Rules (Frontend Only):**
  - High = Red
  - Medium = Orange
  - Low = Green
- **Database Impact:** NO color columns added to `tasks` table.
- **Implementation:** Priority colors are presentation-layer CSS classes mapped from priority ENUM values.
- **Rationale:** Keeps database schema minimal; colors are UI concern per M3A.3 approval.

---

## Decision 4 — Savings Contribution Tracking (APPROVED)
- **Implementation:** Aggregate amounts only for M3B.
- **`savings_goals` Table:**
  - `target_amount` (INTEGER, centavos)
  - `current_amount` (INTEGER, centavos, DEFAULT 0)
- **No `savings_contributions` table** in M3B.
- **Future Phase:** Contributions table can be added in Phase 2 migration if required.
- **Affected Table:** `savings_goals` only.

---

## Decision 5 — Schedule Recurrence (APPROVED)
- **Scope:** One-time activities only for M3B.
- **No RRULE implementation.**
- **No `recurrence_rule` database column.**
- **No recurrence selector in UI.**
- **Affected Table:** `schedule_activities` — schema remains one-time-only.
- **Rationale:** Keeps initial implementation simple; recurrence can be added in future milestone.

---

## Decision 6 — Activity Log Retention (APPROVED)
- **Policy:** Retain all activity history. No automatic deletion.
- **Dashboard Queries:** Display most recent activities (ORDER BY timestamp DESC).
- **Purge:** No automatic purge. User-initiated reset only (future feature).
- **Affected Table:** `activity_log` — all records preserved indefinitely.
- **Rationale:** Per M3A.6 approval, historical records must remain stored unless user explicitly deletes/resets data.

---

## Decision 7 — Offline Conflict Resolution (APPROVED)
- **Architecture:** Single-device application only.
- **No multi-device synchronization.**
- **No account-based synchronization.**
- **No conflict-resolution mechanism.**
- **Timestamps:** `created_at` and `updated_at` columns present on all tables for local record tracking, but no sync infrastructure.
- **Affected Tables:** All 5 main tables (`expenses`, `savings_goals`, `tasks`, `schedule_activities`, `application_preferences`).
- **Rationale:** Per M3A.7 approval, Dayflow is single-device only.

---

## Entity-Relationship Summary

### Tables (5 main + 1 auxiliary)

| Table | Primary Key | Key Columns | Constraints |
|-------|-------------|-------------|-------------|
| `expenses` | `id` INTEGER AUTOINCREMENT | `title TEXT NOT NULL`, `amount INTEGER NOT NULL`, `category TEXT NOT NULL`, `date TEXT NOT NULL`, `created_at TEXT`, `updated_at TEXT` | CHECK(`amount` > 0), category IN ('Food & Drinks', 'Transport', 'Others') |
| `savings_goals` | `id` INTEGER AUTOINCREMENT | `name TEXT NOT NULL`, `target_amount INTEGER NOT NULL`, `current_amount INTEGER DEFAULT 0`, `target_date TEXT` | CHECK(`target_amount` > 0), CHECK(`current_amount` >= 0) |
| `tasks` | `id` INTEGER AUTOINCREMENT | `title TEXT NOT NULL`, `description TEXT`, `due_date TEXT`, `priority TEXT DEFAULT 'Medium'`, `completed BOOLEAN DEFAULT 0`, `created_at TEXT`, `updated_at TEXT` | CHECK(`priority` IN ('High', 'Medium', 'Low')), CHECK(`completed` IN (0, 1)) |
| `schedule_activities` | `id` INTEGER AUTOINCREMENT | `title TEXT NOT NULL`, `start_time TEXT`, `end_time TEXT`, `date TEXT`, `created_at TEXT`, `updated_at TEXT` | No recurrence support (M3B scope) |
| `application_preferences` | `key` TEXT PRIMARY KEY | `value TEXT NOT NULL`, `updated_at TEXT` | Key IN ('theme_color', 'font_family', 'notifications_enabled', 'app_version') |
| `activity_log` | `id` INTEGER AUTOINCREMENT | `type TEXT NOT NULL`, `title TEXT NOT NULL`, `timestamp TEXT NOT NULL`, `related_id INTEGER`, `activity_date TEXT` | Index on `timestamp`, Index on `activity_date` |

### Relationships

- `expenses` → `activity_log` (1-n, via `related_id` optional)
- `savings_goals` → `activity_log` (1-n, via `related_id` optional)
- `tasks` → `activity_log` (1-n, via `related_id` optional)
- `application_preferences` — standalone key-value, no foreign keys
- All tables have `created_at` and `updated_at` for local tracking

### Indexes (Performance)

1. `expenses` INDEX(`category`, `date`) — spending summary queries
2. `savings_goals` INDEX(`target_date`) — goal deadline queries
3. `tasks` INDEX(`completed`, `due_date`) — task filtering queries
4. `tasks` INDEX(`priority`) — priority sorting queries
5. `schedule_activities` INDEX(`date`) — calendar queries
6. `application_preferences` PRIMARY KEY(`key`) — lookup by key
7. `activity_log` INDEX(`timestamp DESC`) — recent activity queries
8. `activity_log` INDEX(`activity_date`) — retention/organization queries

---

## Change Log

| Date | Decision | Change |
|------|----------|--------|
| M3A.2 | All 7 decisions | Finalized and documented |
| — | Currency Format | INTEGER in centavos approved |
| — | Expense Categories | Fixed 4-category enum approved |
| — | Task Priority Colors | Hardcoded semantic colors approved |
| — | Savings Contribution | Aggregate only approved |
| — | Schedule Recurrence | One-time only approved |
| — | Activity Log Retention | All history retained approved |
| — | Offline Conflict Resolution | Single-device only approved |

---

## M3B Implementation Ready

**Status:** Documentation finalized. Database schema designed and approved. Ready for M3B SQLite implementation phase.

**Next Step:** Begin M3B — Create SQLite tables, implement migrations, implement repositories based on this approved schema.

---

## Unresolved Items (Deferred)

The following are intentionally deferred and NOT part of approved M3B schema:

1. Expanded expense categories (Entertainment, Utilities, etc.)
2. Savings contribution history table
3. Schedule recurrence support
4. Configurable activity log retention policy
5. Multi-device conflict resolution
6. Floating-point decimal precision changes (already approved as INTEGER)
7. Task priority color customization (hardcoded semantic only)

**These items require separate approval before implementation.**
