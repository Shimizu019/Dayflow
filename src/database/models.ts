export interface Expense {
  id: number;
  title: string;
  amount: number; // stored as centavos (integer)
  category: "Food & Drinks" | "Transport" | "Others";
  date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export interface SavingsGoal {
  id: number;
  name: string;
  target_amount: number; // stored as centavos (integer)
  current_amount: number; // stored as centavos (integer), DEFAULT 0
  target_date?: string; // YYYY-MM-DD format
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: string; // YYYY-MM-DD format
  due_time?: string; // HH:MM format
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScheduleActivity {
  id: number;
  title: string;
  start_time?: string;
  end_time?: string;
  date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export interface ApplicationPreference {
  key: "theme_color" | "font_family" | "notifications_enabled" | "app_version";
  value: string;
  updated_at: string;
}

export interface ActivityLog {
  id: number;
  type: "expense" | "savings" | "task";
  title: string;
  timestamp: string; // ISO format
  related_id?: number;
  activity_date?: string; // YYYY-MM-DD format
  created_at: string;
}