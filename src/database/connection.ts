import { CapacitorSQLite } from "@capacitor-community/sqlite";

let dbInitialized = false;
const dbName = "dayflow_db";

export async function initializeSQLite(): Promise<void> {
  if (dbInitialized) {
    console.log("SQLite already initialized");
    return;
  }

  await CapacitorSQLite.createConnection({
    database: dbName,
    encrypted: false,
    mode: "no-encryption",
    version: 1,
    readonly: false,
  });

  await CapacitorSQLite.open({ database: dbName });
  await CapacitorSQLite.execute({ database: dbName, statements: "PRAGMA foreign_keys = ON;" });

  dbInitialized = true;
  console.log("SQLite initialized successfully");
}

export async function isSQLiteReady(): Promise<boolean> {
  try {
    const result = await CapacitorSQLite.isDatabase({ database: dbName });
    return result.result === true;
  } catch {
    return false;
  }
}

export async function executeQuery(options: { query: string; params?: any[] }): Promise<any> {
  try {
    const result = await CapacitorSQLite.run({ database: dbName, statement: options.query, values: options.params ?? [] });
    return result as any;
  } catch (error) {
    console.error("SQLite query error:", error);
    throw error;
  }
}

export async function transaction(queryArray: Array<{ query: string; params: any[] }>): Promise<void> {
  try {
    await CapacitorSQLite.beginTransaction({ database: dbName });
    for (const item of queryArray) {
      await CapacitorSQLite.run({ database: dbName, statement: item.query, values: item.params });
    }
    await CapacitorSQLite.commitTransaction({ database: dbName });
  } catch (error) {
    await CapacitorSQLite.rollbackTransaction({ database: dbName });
    console.error("SQLite transaction error:", error);
    throw error;
  }
}

export default { initializeSQLite, isSQLiteReady, executeQuery, transaction };
