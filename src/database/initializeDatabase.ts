import { CapacitorSQLite } from "@capacitor-community/sqlite";
import { transaction } from "./connection";

const DATABASE_VERSION = 2;
const DB_NAME = "dayflow_db";

const MIGRATION_SCHEMA = {
  version: DATABASE_VERSION,
  tables: {
    expenses: `
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        amount INTEGER NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `,
    savings_goals: `
      CREATE TABLE IF NOT EXISTS savings_goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        target_amount INTEGER NOT NULL,
        current_amount INTEGER DEFAULT 0,
        target_date TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `,
    tasks: `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        due_date TEXT,
        due_time TEXT,
        priority TEXT NOT NULL DEFAULT 'Medium',
        completed BOOLEAN DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `,
    schedule_activities: `
      CREATE TABLE IF NOT EXISTS schedule_activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        start_time TEXT,
        end_time TEXT,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `,
    application_preferences: `
      CREATE TABLE IF NOT EXISTS application_preferences (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `,
    activity_log: `
      CREATE TABLE IF NOT EXISTS activity_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        related_id INTEGER,
        activity_date TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `,
  },
};

export async function initializeDatabase(): Promise<void> {
  try {
    const exists = await CapacitorSQLite.isDatabase({ database: DB_NAME });

    if (exists.result) {
      const version = await getDbVersion();
      if (version < DATABASE_VERSION) {
        await runMigrations(version);
      }
    } else {
      await createInitialSchema();
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

async function getDbVersion(): Promise<number> {
  try {
    const result: any = await CapacitorSQLite.query({
      database: DB_NAME,
      statement: "PRAGMA user_version;",
    });
    return parseInt(result?.results?.[0]?.user_version ?? "0", 10);
  } catch {
    return 0;
  }
}

async function runMigrations(fromVersion: number): Promise<void> {
  const migrationQueries: Array<{ query: string; params: any[] }> = [];

  if (fromVersion < 2) {
    migrationQueries.push({
      query: "ALTER TABLE tasks ADD COLUMN due_time TEXT",
      params: [],
    });
  }

  await transaction(migrationQueries);

  await CapacitorSQLite.run({
    database: DB_NAME,
    statement: "PRAGMA user_version = ?",
    values: [DATABASE_VERSION],
  });
}

async function createInitialSchema(): Promise<void> {
  const tableQueries: string[] = Object.values(MIGRATION_SCHEMA.tables);

  const queriesWithParams: Array<{ query: string; params: any[] }> = tableQueries.map((query) => ({
    query,
    params: [],
  }));

  await transaction(queriesWithParams);

  await CapacitorSQLite.run({
    database: DB_NAME,
    statement: "PRAGMA user_version = ?",
    values: [DATABASE_VERSION],
  });

  await seedDemoData();

  console.log(`Initial schema created, version: ${DATABASE_VERSION}`);
}

async function seedDemoData(): Promise<void> {
  const now = new Date().toISOString();
  const today = now.split('T')[0];

  const seedQueries: Array<{ query: string; params: any[] }> = [
    {
      query: "INSERT INTO expenses (title, amount, category, date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      params: ['Lunch at Cafe', 28000, 'Food & Drinks', today, now, now],
    },
    {
      query: "INSERT INTO expenses (title, amount, category, date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      params: ['Jeepney Fare', 1500, 'Transport', today, now, now],
    },
    {
      query: "INSERT INTO savings_goals (name, target_amount, current_amount, target_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      params: ['Emergency Fund', 500000, 125000, '2026-12-31', now, now],
    },
    {
      query: "INSERT INTO savings_goals (name, target_amount, current_amount, target_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      params: ['New Laptop', 800000, 200000, '2027-03-15', now, now],
    },
    {
      query: "INSERT INTO tasks (title, description, due_date, priority, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      params: ['Finish UI Design', 'Complete Dayflow dashboard screens', today, 'High', 0, now, now],
    },
    {
      query: "INSERT INTO tasks (title, description, due_date, priority, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      params: ['Review Figma Prototype', 'Check latest design files', today, 'Medium', 0, now, now],
    },
    {
      query: "INSERT INTO tasks (title, description, due_date, priority, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      params: ['Read a book', 'Read atomic habits chapter 3', 'Tomorrow', 'Low', 1, now, now],
    },
    {
      query: "INSERT INTO schedule_activities (title, start_time, end_time, date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      params: ['Class: Web Development', '9:00 AM', '11:00 AM', today, now, now],
    },
    {
      query: "INSERT INTO schedule_activities (title, start_time, end_time, date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      params: ['Group Project Meeting', '1:00 PM', '3:00 PM', today, now, now],
    },
    {
      query: "INSERT INTO activity_log (type, title, timestamp, related_id, activity_date, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      params: ['expense', 'Logged expense: Lunch at Cafe', now, 1, today, now],
    },
    {
      query: "INSERT INTO activity_log (type, title, timestamp, related_id, activity_date, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      params: ['expense', 'Logged expense: Jeepney Fare', now, 2, today, now],
    },
    {
      query: "INSERT INTO activity_log (type, title, timestamp, related_id, activity_date, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      params: ['savings', 'Created goal: Emergency Fund', now, 1, today, now],
    },
    {
      query: "INSERT INTO activity_log (type, title, timestamp, related_id, activity_date, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      params: ['task', 'Created task: Finish UI Design', now, 1, today, now],
    },
    {
      query: "INSERT INTO activity_log (type, title, timestamp, related_id, activity_date, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      params: ['task', 'Completed task: Read a book', now, 3, today, now],
    },
    {
      query: "INSERT INTO activity_log (type, title, timestamp, related_id, activity_date, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      params: ['savings', 'Scheduled: Class: Web Development', now, 1, today, now],
    },
  ];

  await transaction(seedQueries);
  console.log('Demo data seeded');
}

export async function verifySchema(): Promise<boolean> {
  try {
    const version: number = await getDbVersion();
    return version === DATABASE_VERSION;
  } catch {
    return false;
  }
}

export default { initializeDatabase, verifySchema };
