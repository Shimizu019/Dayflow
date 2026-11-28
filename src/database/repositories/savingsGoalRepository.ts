import { executeQuery } from "../connection";
import { SavingsGoal } from "../models";

export async function getAllSavingsGoals(): Promise<SavingsGoal[]> {
  const result: any = await executeQuery({
    query: "SELECT id, name, target_amount, current_amount, target_date, created_at, updated_at FROM savings_goals ORDER BY created_at DESC",
    params: [],
  });
  const r = result?.results;
  return r ? (r as SavingsGoal[]) : [];
};

export async function getSavingsGoalById(id: number): Promise<SavingsGoal | undefined> {
  const result: any = await executeQuery({
    query: "SELECT id, name, target_amount, current_amount, target_date, created_at, updated_at FROM savings_goals WHERE id = ?",
    params: [id],
  });
  const r = result?.results;
  if (!r || r.length === 0) return undefined;
  return r[0] as SavingsGoal;
};

export async function createSavingsGoal(goal: Omit<SavingsGoal, "id" | "created_at" | "updated_at">): Promise<SavingsGoal> {
  const result = await executeQuery({
    query: "INSERT INTO savings_goals (name, target_amount, current_amount, target_date, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))",
    params: [goal.name, goal.target_amount, goal.current_amount, goal.target_date ?? null],
  });
  if (!result.lastId || !result.changes) throw new Error("Savings goal insert was not confirmed");
  const created = await getSavingsGoalById(result.lastId);
  if (!created) throw new Error("Inserted savings goal could not be read back");
  return created;
}

export async function updateSavingsGoal(id: number, updates: Partial<SavingsGoal>): Promise<boolean> {
  const sets: string[] = [];
  const params: any[] = [];

  if (updates.name !== undefined) { sets.push("name = ?"); params.push(updates.name); }
  if (updates.target_amount !== undefined) { sets.push("target_amount = ?"); params.push(updates.target_amount); }
  if (updates.current_amount !== undefined) { sets.push("current_amount = ?"); params.push(updates.current_amount); }
  if (updates.target_date !== undefined) { sets.push("target_date = ?"); params.push(updates.target_date); }

  if (sets.length === 0) return false;

  sets.push("updated_at = datetime('now')");
  params.push(id);

  const query = `UPDATE savings_goals SET ${sets.join(", ")} WHERE id = ?`;
  const result2: any = await executeQuery({ query, params });
  const changes = result2?.changes;
  return changes && changes > 0;
};

export async function updateGoalCurrentAmount(id: number, amount: number): Promise<boolean> {
  const result2: any = await executeQuery({
    query: "UPDATE savings_goals SET current_amount = ?, updated_at = datetime('now') WHERE id = ?",
    params: [amount, id],
  });
  const changes = result2?.changes;
  return changes && changes > 0;
};

export async function deleteSavingsGoal(id: number): Promise<boolean> {
  const result: any = await executeQuery({
    query: "DELETE FROM savings_goals WHERE id = ?",
    params: [id],
  });
  const changes = result?.changes;
  return changes && changes > 0;
};
