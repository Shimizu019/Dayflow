import { executeQuery } from "../connection";
import { ActivityLog } from "../models";

export async function recordActivity(entry: Omit<ActivityLog, "id" | "created_at">): Promise<ActivityLog> {
  const result = await executeQuery({
    query: "INSERT INTO activity_log (type, title, timestamp, related_id, activity_date, created_at) VALUES (?, ?, datetime('now'), ?, ?, datetime('now'))",
    params: [entry.type, entry.title, entry.related_id ?? null, entry.activity_date ?? new Date().toISOString().slice(0, 10)],
  });
  if (!result.lastId || !result.changes) throw new Error("Activity insert was not confirmed");
  const selected = await executeQuery({
    query: "SELECT id, type, title, timestamp, related_id, activity_date, created_at FROM activity_log WHERE id = ?",
    params: [result.lastId],
  });
  const created = selected.results?.[0] as ActivityLog | undefined;
  if (!created) throw new Error("Inserted activity could not be read back");
  return created;
}

export async function getRecentActivities(limit: number = 10): Promise<ActivityLog[]> {
  const result: any = await executeQuery({
    query: "SELECT id, type, title, timestamp, related_id, activity_date, created_at FROM activity_log ORDER BY timestamp DESC LIMIT ?",
    params: [limit],
  });
  const r = result?.results;
  return r ? (r as ActivityLog[]) : [];
};

export async function getHistoricalActivities(): Promise<ActivityLog[]> {
  const result: any = await executeQuery({
    query: "SELECT id, type, title, timestamp, related_id, activity_date, created_at FROM activity_log ORDER BY created_at ASC",
    params: [],
  });
  const r = result?.results;
  return r ? (r as ActivityLog[]) : [];
};

export async function getActivitiesByType(type: string): Promise<ActivityLog[]> {
  const result: any = await executeQuery({
    query: "SELECT id, type, title, timestamp, related_id, activity_date, created_at FROM activity_log WHERE type = ? ORDER BY timestamp DESC",
    params: [type],
  });
  const r = result?.results;
  return r ? (r as ActivityLog[]) : [];
};

export async function getActivitiesByDateRange(startDate: string, endDate: string): Promise<ActivityLog[]> {
  const result: any = await executeQuery({
    query: "SELECT id, type, title, timestamp, related_id, activity_date, created_at FROM activity_log WHERE activity_date BETWEEN ? AND ? ORDER BY created_at DESC",
    params: [startDate, endDate],
  });
  const r = result?.results;
  return r ? (r as ActivityLog[]) : [];
};
