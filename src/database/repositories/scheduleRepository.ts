import { executeQuery } from "../connection";
import { ScheduleActivity } from "../models";

export async function getAllScheduleActivities(): Promise<ScheduleActivity[]> {
  const result: any = await executeQuery({
    query: "SELECT id, title, start_time, end_time, date, created_at, updated_at FROM schedule_activities ORDER BY date ASC, start_time ASC",
    params: [],
  });
  const r = result?.results;
  return r ? (r as ScheduleActivity[]) : [];
};

export async function getScheduleActivityById(id: number): Promise<ScheduleActivity | undefined> {
  const result: any = await executeQuery({
    query: "SELECT id, title, start_time, end_time, date, created_at, updated_at FROM schedule_activities WHERE id = ?",
    params: [id],
  });
  const r = result?.results;
  if (!r || r.length === 0) return undefined;
  return r[0] as ScheduleActivity;
};

export async function createScheduleActivity(activity: Omit<ScheduleActivity, "id" | "created_at" | "updated_at">): Promise<ScheduleActivity> {
  const result: any = await executeQuery({
    query: "INSERT INTO schedule_activities (title, start_time, end_time, date, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now')) RETURNING *",
    params: [activity.title, activity.start_time, activity.end_time, activity.date],
  });
  const r = result?.results;
  return r ? (r[0] as ScheduleActivity) : { id: 0, title: "", start_time: "", end_time: "", date: "", created_at: "", updated_at: "" } as ScheduleActivity;
};

export async function updateScheduleActivity(id: number, updates: Partial<ScheduleActivity>): Promise<boolean> {
  const sets: string[] = [];
  const params: any[] = [];

  if (updates.title !== undefined) { sets.push("title = ?"); params.push(updates.title); }
  if (updates.start_time !== undefined) { sets.push("start_time = ?"); params.push(updates.start_time); }
  if (updates.end_time !== undefined) { sets.push("end_time = ?"); params.push(updates.end_time); }
  if (updates.date !== undefined) { sets.push("date = ?"); params.push(updates.date); }

  if (sets.length === 0) return false;

  sets.push("updated_at = datetime('now')");
  params.push(id);

  const query = `UPDATE schedule_activities SET ${sets.join(", ")} WHERE id = ?`;
  const result2: any = await executeQuery({ query, params });
  const changes = result2?.changes;
  return changes && changes > 0;
};

export async function deleteScheduleActivity(id: number): Promise<boolean> {
  const result: any = await executeQuery({
    query: "DELETE FROM schedule_activities WHERE id = ?",
    params: [id],
  });
  const changes = result?.changes;
  return changes && changes > 0;
};