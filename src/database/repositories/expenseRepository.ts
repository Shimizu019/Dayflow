import { executeQuery } from "../connection";
import { Expense } from "../models";

export async function getAllExpenses(): Promise<Expense[]> {
  const result: any = await executeQuery({
    query: "SELECT id, title, amount, category, date, created_at, updated_at FROM expenses ORDER BY date DESC, created_at DESC",
    params: [],
  });
  const r = result?.results;
  return r ? (r as Expense[]) : [];
};

export async function getExpenseById(id: number): Promise<Expense | undefined> {
  const result: any = await executeQuery({
    query: "SELECT id, title, amount, category, date, created_at, updated_at FROM expenses WHERE id = ?",
    params: [id],
  });
  const r = result?.results;
  if (!r || r.length === 0) return undefined;
  return r[0] as Expense;
};

export async function createExpense(expense: Omit<Expense, "id" | "created_at" | "updated_at">): Promise<Expense> {
  const result = await executeQuery({
    query: "INSERT INTO expenses (title, amount, category, date, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))",
    params: [expense.title, expense.amount, expense.category, expense.date],
  });
  if (!result.lastId || !result.changes) throw new Error("Expense insert was not confirmed");
  const created = await getExpenseById(result.lastId);
  if (!created) throw new Error("Inserted expense could not be read back");
  return created;
}

export async function updateExpense(id: number, updates: Partial<Expense>): Promise<boolean> {
  const sets: string[] = [];
  const params: any[] = [];

  if (updates.title !== undefined) { sets.push("title = ?"); params.push(updates.title); }
  if (updates.amount !== undefined) { sets.push("amount = ?"); params.push(updates.amount); }
  if (updates.category !== undefined) { sets.push("category = ?"); params.push(updates.category); }
  if (updates.date !== undefined) { sets.push("date = ?"); params.push(updates.date); }

  if (sets.length === 0) return false;

  sets.push("updated_at = datetime('now')");
  params.push(id);

  const query = `UPDATE expenses SET ${sets.join(", ")} WHERE id = ?`;
  const result2: any = await executeQuery({ query, params });
  const changes = result2?.changes;
  return changes && changes > 0;
};

export async function deleteExpense(id: number): Promise<boolean> {
  const result: any = await executeQuery({
    query: "DELETE FROM expenses WHERE id = ?",
    params: [id],
  });
  const changes = result?.changes;
  return changes && changes > 0;
};

export async function getExpensesByCategory(category: string): Promise<Expense[]> {
  const result: any = await executeQuery({
    query: "SELECT id, title, amount, category, date, created_at, updated_at FROM expenses WHERE category = ? ORDER BY date DESC, created_at DESC",
    params: [category],
  });
  const r = result?.results;
  return r ? (r as Expense[]) : [];
};

export async function getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
  const result: any = await executeQuery({
    query: "SELECT id, title, amount, category, date, created_at, updated_at FROM expenses WHERE date BETWEEN ? AND ? ORDER BY date DESC, created_at DESC",
    params: [startDate, endDate],
  });
  const r = result?.results;
  return r ? (r as Expense[]) : [];
};

export async function getTotalExpensesByPeriod(period: string): Promise<number> {
  let dateFilter = "";
  const now = new Date();
  if (period === "This Week") {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    dateFilter = `AND date >= '${weekStart.toISOString().split('T')[0]}'`;
  } else if (period === "This Month") {
    dateFilter = `AND strftime('%Y-%m', date) = strftime('%Y-%m', 'now')`;
  }
  const result: any = await executeQuery({
    query: `SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE amount > 0 ${dateFilter}`,
    params: [],
  });
  const r = result?.results;
  return r && r.length > 0 ? parseInt(r[0].total, 10) || 0 : 0;
};
