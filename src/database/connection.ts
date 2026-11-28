import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";

let initialization: Promise<void> | null = null;
const dbName = "dayflow_db";
const sqliteConnection = new SQLiteConnection(CapacitorSQLite);

export async function initializeSQLite(): Promise<void> {
  if (initialization) return initialization;

  initialization = (async () => {
    let connection;
    try {
      await sqliteConnection.checkConnectionsConsistency();
      const exists = await sqliteConnection.isConnection(dbName, false);
      if (exists.result) connection = await sqliteConnection.retrieveConnection(dbName, false);
    } catch (error) {
      console.warn("Recovering SQLite connection state", error);
    }

    connection ??= await sqliteConnection.createConnection(dbName, false, "no-encryption", 1, false);
    await connection.open();
    await CapacitorSQLite.execute({ database: dbName, statements: "PRAGMA foreign_keys = ON;" });
    console.info("SQLite connection ready", { database: dbName });
  })().catch((error) => {
    initialization = null;
    console.error("SQLite initialization failed", error);
    throw error;
  });

  return initialization;
}

export async function isSQLiteReady(): Promise<boolean> {
  try {
    const result = await CapacitorSQLite.isDBOpen({ database: dbName });
    return result.result === true;
  } catch {
    return false;
  }
}

export async function executeQuery(options: { query: string; params?: any[] }): Promise<any> {
  try {
    await initializeSQLite();
    const statement = options.query.trim();
    const isReadQuery = /^(SELECT|WITH|EXPLAIN)\b/i.test(statement)
      || (/^PRAGMA\b/i.test(statement) && !/\s=/.test(statement));

    if (isReadQuery) {
      const result = await CapacitorSQLite.query({
        database: dbName,
        statement,
        values: options.params ?? [],
      });
      return { results: result.values ?? [] };
    }

    const result = await CapacitorSQLite.run({
      database: dbName,
      statement,
      values: options.params ?? [],
    });
    const changes = result.changes;
    return {
      results: changes?.values ?? [],
      changes: changes?.changes ?? 0,
      lastId: changes?.lastId,
    };
  } catch (error) {
    console.error("SQLite query error:", error);
    throw error;
  }
}

export async function transaction(queryArray: Array<{ query: string; params: any[] }>): Promise<void> {
  try {
    await initializeSQLite();
    await CapacitorSQLite.beginTransaction({ database: dbName });
    for (const item of queryArray) {
      await CapacitorSQLite.run({
        database: dbName,
        statement: item.query,
        values: item.params,
        transaction: false,
      });
    }
    await CapacitorSQLite.commitTransaction({ database: dbName });
  } catch (error) {
    await CapacitorSQLite.rollbackTransaction({ database: dbName });
    console.error("SQLite transaction error:", error);
    throw error;
  }
}

export default { initializeSQLite, isSQLiteReady, executeQuery, transaction };
