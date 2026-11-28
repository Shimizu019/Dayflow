import { executeQuery } from "../connection";
import { Task } from "../models";

export async function getAllTasks(): Promise<Task[]> {
  const result: any = await executeQuery({
    query: "SELECT id, title, description, due_date, due_time, priority, completed, created_at, updated_at FROM tasks ORDER BY priority DESC, due_date ASC, due_time ASC",
    params: [],
  });
  const r = result?.results;
  return r ? (r as Task[]) : [];
};

export async function getTaskById(id: number): Promise<Task | undefined> {
  const result: any = await executeQuery({
    query: "SELECT id, title, description, due_date, due_time, priority, completed, created_at, updated_at FROM tasks WHERE id = ?",
    params: [id],
  });
  const r = result?.results;
  if (!r || r.length === 0) return undefined;
  return r[0] as Task;
};

export async function createTask(task: Omit<Task, "id" | "created_at" | "updated_at">): Promise<Task> {
  const result = await executeQuery({
    query: "INSERT INTO tasks (title, description, due_date, due_time, priority, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
    params: [task.title, task.description ?? null, task.due_date ?? null, task.due_time ?? null, task.priority, task.completed ? 1 : 0],
  });
  if (!result.lastId || !result.changes) throw new Error("Task insert was not confirmed");
  const created = await getTaskById(result.lastId);
  if (!created) throw new Error("Inserted task could not be read back");
  return created;
}

export async function updateTask(id: number, updates: Partial<Task>): Promise<boolean> {
  const sets: string[] = [];
  const params: any[] = [];

  if (updates.title !== undefined) { sets.push("title = ?"); params.push(updates.title); }
  if (updates.description !== undefined) { sets.push("description = ?"); params.push(updates.description); }
  if (updates.due_date !== undefined) { sets.push("due_date = ?"); params.push(updates.due_date); }
  if (updates.due_time !== undefined) { sets.push("due_time = ?"); params.push(updates.due_time); }
  if (updates.priority !== undefined) { sets.push("priority = ?"); params.push(updates.priority); }
  if (updates.completed !== undefined) { sets.push("completed = ?"); params.push(updates.completed); }

  if (sets.length === 0) return false;

  sets.push("updated_at = datetime('now')");
  params.push(id);

  const query = `UPDATE tasks SET ${sets.join(", ")} WHERE id = ?`;
  const result2: any = await executeQuery({ query, params });
  const changes = result2?.changes;
  return changes && changes > 0;
};

export async function updateTaskCompletion(id: number, completed: boolean): Promise<boolean> {
  const result2: any = await executeQuery({
    query: "UPDATE tasks SET completed = ?, updated_at = datetime('now') WHERE id = ?",
    params: [completed, id],
  });
  const changes = result2?.changes;
  return changes && changes > 0;
};

export async function deleteTask(id: number): Promise<boolean> {
  const result: any = await executeQuery({
    query: "DELETE FROM tasks WHERE id = ?",
    params: [id],
  });
  const changes = result?.changes;
  return changes && changes > 0;
};
