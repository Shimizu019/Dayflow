import { executeQuery } from "../connection";
import { ApplicationPreference } from "../models";

export async function getPreference(key: string): Promise<ApplicationPreference | undefined> {
  const result: any = await executeQuery({
    query: "SELECT key, value, updated_at FROM application_preferences WHERE key = ?",
    params: [key],
  });
  const r = result?.results;
  if (!r || r.length === 0) return undefined;
  return r[0] as ApplicationPreference;
};

export async function getAllPreferences(): Promise<ApplicationPreference[]> {
  const result: any = await executeQuery({
    query: "SELECT key, value, updated_at FROM application_preferences ORDER BY key",
    params: [],
  });
  const r = result?.results;
  return r ? (r as ApplicationPreference[]) : [];
};

export async function savePreference(key: string, value: string): Promise<boolean> {
  const result: any = await executeQuery({
    query: "INSERT OR REPLACE INTO application_preferences (key, value, updated_at) VALUES (?, ?, datetime('now'))",
    params: [key, value],
  });
  const changes = result?.changes;
  return changes && changes > 0;
};

export async function deletePreference(key: string): Promise<boolean> {
  const result: any = await executeQuery({
    query: "DELETE FROM application_preferences WHERE key = ?",
    params: [key],
  });
  const changes = result?.changes;
  return changes && changes > 0;
};