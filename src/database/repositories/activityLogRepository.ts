import { executeQuery } from "../connection";
import { ActivityLog } from "../models";

export async function recordActivity(entry: Omit<ActivityLog, "id" | "created_at">): Promise<ActivityLog> {
  const result: any = await executeQuery({
    query: "INSERT INTO activity_log (type, title, timestamp, related_id, activity_date, created_at) VALUES (?, ?, datetime('now'), ?, date('now')) RETURNING *",
    params: [entry.type, entry.title, entry.related_id, entry.activity_date],
  });
  const r = result?.results;
  return r ? (r[0] as ActivityLog) : { id: 0, type: "expense", title: "", timestamp: "", related_id: 0, activity_date: "", created_at: "" } as ActivityLog;
};

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