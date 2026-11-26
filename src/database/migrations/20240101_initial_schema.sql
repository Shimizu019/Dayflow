-- M3B Initial Schema Migration
-- Version: 1
-- Date: 2024-01-01
-- This migration creates all approved tables for Dayflow v1.0.0
-- Follows approved design from DATABASE-DESIGN.md and ERD.md

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- ============================================================
-- Table: expenses
-- Stores expense records for Wallet functionality
-- Amount stored as INTEGER centavos (100 centavos = ₱1)
-- ============================================================
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount INTEGER NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    CHECK (amount > 0),
    CHECK (category IN ('Food & Drinks', 'Transport', 'Others'))
);

-- ============================================================
-- Table: savings_goals
-- Stores savings goals for Savings functionality
-- Amounts stored as INTEGER centavos
-- ============================================================
CREATE TABLE IF NOT EXISTS savings_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    target_amount INTEGER NOT NULL,
    current_amount INTEGER DEFAULT 0,
    target_date TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    CHECK (target_amount > 0),
    CHECK (current_amount >= 0)
);

-- ============================================================
-- Table: tasks
-- Stores task records for Tasks functionality
-- Priority: High/Medium/Low
-- ============================================================
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    priority TEXT NOT NULL DEFAULT 'Medium',
    completed BOOLEAN DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    CHECK (priority IN ('High', 'Medium', 'Low')),
    CHECK (completed IN (0, 1))
);

-- ============================================================
-- Table: schedule_activities
-- Stores one-time scheduled activities only (M3B scope)
-- No recurrence support (see Decision 5 in M3A.2)
-- ============================================================
CREATE TABLE IF NOT EXISTS schedule_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    start_time TEXT,
    end_time TEXT,
    date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- Table: application_preferences
-- Key-value store for app-wide preferences
-- Theme color, font selection, etc.
-- ============================================================
CREATE TABLE IF NOT EXISTS application_preferences (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- Table: activity_log
-- Aggregated log of recent activities from all modules
-- History preserved indefinitely (no automatic purge)
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    related_id INTEGER,
    activity_date TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================
-- Indexes for Performance
-- ============================================================

-- Expense queries: by category and date
CREATE INDEX IF NOT EXISTS idx_expenses_category_date ON expenses(category, date);

-- Savings goals: by target date
CREATE INDEX IF NOT EXISTS idx_savings_goals_target_date ON savings_goals(target_date);

-- Task filtering: by completed status and due date
CREATE INDEX IF NOT EXISTS idx_tasks_completed_due ON tasks(completed, due_date);

-- Task priority sorting
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Schedule activities: by date
CREATE INDEX IF NOT EXISTS idx_schedule_activities_date ON schedule_activities(date);

-- Application preferences: by key (PKEY already enforced)
-- No separate index needed; PRIMARY KEY provides lookup

-- Activity log: by timestamp (recent activities)
CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON activity_log(timestamp DESC);

-- Activity log: by date for organization
CREATE INDEX IF NOT EXISTS idx_activity_log_date ON activity_log(activity_date);

-- ============================================================
-- Migration Completion Marker
-- ============================================================
-- Record the schema version for future migration detection
PRAGMA user_version = 1;