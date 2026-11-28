import { CapacitorSQLite } from "@capacitor-community/sqlite";
import { transaction } from "./connection";

const DATABASE_VERSION = 3;
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
        description TEXT,
        location TEXT,
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
      if (version === 0) {
        await createInitialSchema();
        await ensureCurrentColumns();
      } else if (version < DATABASE_VERSION) {
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
    const result = await CapacitorSQLite.query({
      database: DB_NAME,
      statement: "PRAGMA user_version;",
      values: [],
    });
    const version = result.values?.[0]?.user_version ?? 0;
    return Number.parseInt(String(version), 10) || 0;
  } catch (error) {
    console.error("Unable to read SQLite schema version", error);
    throw error;
  }
}

async function runMigrations(fromVersion: number): Promise<void> {
  await ensureCurrentColumns(fromVersion);

  await CapacitorSQLite.run({
    database: DB_NAME,
    statement: `PRAGMA user_version = ${DATABASE_VERSION}`,
    values: [],
  });
}

async function ensureCurrentColumns(_fromVersion = 0): Promise<void> {
  const additions: Array<{ table: string; column: string; definition: string }> = [
    { table: "tasks", column: "due_time", definition: "TEXT" },
    { table: "schedule_activities", column: "description", definition: "TEXT" },
    { table: "schedule_activities", column: "location", definition: "TEXT" },
  ];
  const queries: Array<{ query: string; params: any[] }> = [];

  for (const addition of additions) {
    const info = await CapacitorSQLite.query({
      database: DB_NAME,
      statement: `PRAGMA table_info(${addition.table})`,
      values: [],
    });
    const columns = (info.values ?? []) as Array<{ name: string }>;
    if (!columns.some((column) => column.name === addition.column)) {
      queries.push({
        query: `ALTER TABLE ${addition.table} ADD COLUMN ${addition.column} ${addition.definition}`,
        params: [],
      });
    }
  }

  if (queries.length) await transaction(queries);
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
    statement: `PRAGMA user_version = ${DATABASE_VERSION}`,
    values: [],
  });

  console.log(`Initial schema created, version: ${DATABASE_VERSION}`);
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
