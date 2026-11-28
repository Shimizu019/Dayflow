import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { validateAmount } from '@/utils/format';
import { initializeSQLite } from '@/database/connection';
import { initializeDatabase } from '@/database/initializeDatabase';
import {
  getAllExpenses, createExpense, updateExpense, deleteExpense,
} from '@/database/repositories/expenseRepository';
import {
  getAllSavingsGoals, createSavingsGoal, updateSavingsGoal, deleteSavingsGoal,
} from '@/database/repositories/savingsGoalRepository';
import {
  getAllTasks, createTask, updateTask, deleteTask, updateTaskCompletion,
} from '@/database/repositories/taskRepository';
import {
  getAllScheduleActivities, createScheduleActivity, updateScheduleActivity, deleteScheduleActivity,
} from '@/database/repositories/scheduleRepository';
import { recordActivity } from '@/database/repositories/activityLogRepository';
import { savePreference } from '@/database/repositories/preferenceRepository';

export type Tab = 'home' | 'wallet' | 'savings' | 'tasks' | 'schedule' | 'profile';
export type TaskFilter = 'All' | 'Pending' | 'Completed';
export type WalletPeriod = 'This Month' | 'This Week' | 'All Time';
export type ModalState = 'closed' | 'menu' | 'expense' | 'savings' | 'task' | 'event';
export type ActivityType = 'expense' | 'savings' | 'task' | 'schedule';

export interface Expense {
  id: number;
  title: string;
  amountCentavos: number;
  category: 'Food & Drinks' | 'Transport' | 'Others';
  date: string;
  createdAt: string;
}

export interface SavingsGoal {
  id: number;
  title: string;
  currentCentavos: number;
  targetCentavos: number;
  createdAt: string;
}

export interface TaskItem {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  createdAt: string;
}

export interface ScheduleEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  createdAt: string;
}

export interface ActivityLogEntry {
  id: number;
  type: ActivityType;
  title: string;
  subtitle: string;
  createdAt: string;
}

export interface ThemePrefs {
  mode: 'light' | 'dark';
  primaryColor: string;
  fontFamily: string;
}

const nowISO = () => new Date().toISOString();

const makeLogEntry = (type: ActivityType, title: string, subtitle: string): ActivityLogEntry => ({
  id: Date.now(),
  type,
  title,
  subtitle,
  createdAt: nowISO(),
});

interface DayflowState {
  expenses: Expense[];
  savingsGoals: SavingsGoal[];
  tasks: TaskItem[];
  scheduleEvents: ScheduleEvent[];
  activityLog: ActivityLogEntry[];
  theme: ThemePrefs;

  currentScreen: Tab;
  taskFilter: TaskFilter;
  walletPeriod: WalletPeriod;
  selectedDay: number;
  modalState: ModalState;
  modalEditId: number | null;
  modalEditType: 'expense' | 'savings' | 'task' | 'schedule' | null;

  totalExpenses: number;
  totalSavings: number;
  completedTasks: number;

  navigateTo: (screen: Tab) => void;
  setTaskFilter: (filter: TaskFilter) => void;
  setWalletPeriod: (period: WalletPeriod) => void;
  selectScheduleDay: (date: number) => void;

  openModal: (state: ModalState, editId?: number, editType?: 'expense' | 'savings' | 'task' | 'schedule') => void;
  closeModal: () => void;

  addExpense: (title: string, amountPesos: number, category: 'Food & Drinks' | 'Transport' | 'Others', date: string) => Promise<void>;
  updateExpense: (id: number, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;

  addSavingsGoal: (title: string, currentPesos: number, targetPesos: number) => Promise<void>;
  updateSavingsAmount: (id: number, currentPesos: number) => Promise<void>;
  updateSavingsGoal: (id: number, updates: Partial<SavingsGoal>) => Promise<void>;
  deleteSavingsGoal: (id: number) => Promise<void>;

  addTask: (title: string, description: string, dueDate: string, dueTime: string, priority: 'High' | 'Medium' | 'Low') => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  updateTask: (id: number, updates: Partial<TaskItem>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;

  addEvent: (title: string, date: string, time: string, location: string) => Promise<void>;
  updateEvent: (id: number, updates: Partial<ScheduleEvent>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;

  logActivity: (type: ActivityType, title: string, subtitle: string) => Promise<void>;

  applyTheme: (mode: 'light' | 'dark', primaryColor?: string, fontFamily?: string) => Promise<void>;
  resetTheme: () => Promise<void>;

  showToast: (message: string) => void;
  toastMessage: string;
  toastVisible: boolean;

  loadFromDatabase: () => Promise<void>;
}

let isDbReady = false;
let dbLoadPromise: Promise<void> | null = null;

export const useDayflowStore = create<DayflowState>()(persist((set, get) => ({
  expenses: [],
  savingsGoals: [],
  tasks: [],
  scheduleEvents: [],
  activityLog: [],
  theme: { mode: 'light', primaryColor: '#6D42EF', fontFamily: 'Plus Jakarta Sans' },

  currentScreen: 'home',
  taskFilter: 'All',
  walletPeriod: 'This Month',
  selectedDay: new Date().getDate(),
  modalState: 'closed',
  modalEditId: null,
  modalEditType: null,

  totalExpenses: 0,
  totalSavings: 0,
  completedTasks: 0,

  toastMessage: '',
  toastVisible: false,

  navigateTo: (screen: Tab) => {
    set({ currentScreen: screen, modalState: 'closed' });
  },

  setTaskFilter: (filter: TaskFilter) => {
    set({ taskFilter: filter });
  },

  setWalletPeriod: (period: WalletPeriod) => {
    set({ walletPeriod: period });
  },

  selectScheduleDay: (date: number) => {
    set({ selectedDay: date });
  },

  openModal: (state: ModalState, editId?: number, editType?: 'expense' | 'savings' | 'task' | 'schedule') => {
    set({ modalState: state, modalEditId: editId ?? null, modalEditType: editType ?? null });
  },

  closeModal: () => {
    set({ modalState: 'closed', modalEditId: null, modalEditType: null });
  },

  loadFromDatabase: async () => {
    if (isDbReady) return;
    if (dbLoadPromise) return dbLoadPromise;

    dbLoadPromise = (async () => {
      try {
        await initializeSQLite();
        await initializeDatabase();

        const [expenses, savings, tasks, events] = await Promise.all([
          getAllExpenses(),
          getAllSavingsGoals(),
          getAllTasks(),
          getAllScheduleActivities(),
        ]);

        const expenseItems: Expense[] = expenses.map((e) => ({
          id: e.id,
          title: e.title,
          amountCentavos: e.amount,
          category: e.category as 'Food & Drinks' | 'Transport' | 'Others',
          date: e.date,
          createdAt: e.created_at,
        }));

        const goalItems: SavingsGoal[] = savings.map((g) => ({
          id: g.id,
          title: g.name,
          currentCentavos: g.current_amount,
          targetCentavos: g.target_amount,
          createdAt: g.created_at,
        }));

        const taskItems: TaskItem[] = tasks.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          dueDate: t.due_date ?? '',
          dueTime: t.due_time,
          priority: t.priority,
          completed: Boolean(t.completed),
          createdAt: t.created_at,
        }));

        const eventItems: ScheduleEvent[] = events.map((ev) => ({
          id: ev.id,
          title: ev.title,
          date: ev.date,
          time: ev.start_time ?? '',
          location: ev.end_time ?? '',
          createdAt: ev.created_at,
        }));

        const totalExpenses = expenseItems.reduce((sum, e) => sum + e.amountCentavos, 0);
        const totalSavings = goalItems.reduce((sum, g) => sum + g.currentCentavos, 0);
        const completedTasks = taskItems.filter((t) => t.completed).length;

        set({
          expenses: expenseItems,
          savingsGoals: goalItems,
          tasks: taskItems,
          scheduleEvents: eventItems,
          totalExpenses,
          totalSavings,
          completedTasks,
        });
        isDbReady = true;
      } catch (error) {
        console.error('Failed to load from database:', error);
        throw error;
      } finally {
        dbLoadPromise = null;
      }
    })();

    return dbLoadPromise;
  },

  // Expenses
  addExpense: async (title, amountPesos, category, date) => {
    if (!title.trim() || !validateAmount(amountPesos)) return;
    const amountCentavos = Math.round(amountPesos * 100);
    try {
      const created = await createExpense({
        title: title.trim(),
        amount: amountCentavos,
        category,
        date,
      } as any);
      const expense: Expense = {
        id: created.id,
        title: created.title,
        amountCentavos: created.amount,
        category: created.category as 'Food & Drinks' | 'Transport' | 'Others',
        date: created.date,
        createdAt: created.created_at,
      };
      set((state) => ({
        expenses: [expense, ...state.expenses],
        totalExpenses: state.totalExpenses + amountCentavos,
        activityLog: [
          makeLogEntry('expense', `Logged expense: ${title.trim()}`, `₱${(amountPesos / 100).toLocaleString('en-PH')}`),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      get().showToast(`Added ₱${(amountPesos / 100).toLocaleString('en-PH')} expense`);
    } catch (error) {
      console.error('Failed to add expense:', error);
      get().showToast('Failed to add expense');
    }
  },

  updateExpense: async (id, updates) => {
    const state = get();
    const existing = state.expenses.find((e) => e.id === id);
    if (!existing) return;
    if (updates.amountCentavos !== undefined && !validateAmount(updates.amountCentavos / 100)) return;
    try {
      await updateExpense(id, {
        title: updates.title,
        amount: updates.amountCentavos,
        category: updates.category,
        date: updates.date,
      } as any);
      const newAmount = updates.amountCentavos ?? existing.amountCentavos;
      set((state) => ({
        expenses: state.expenses.map((e) =>
          e.id === id ? { ...e, ...updates, amountCentavos: newAmount } : e
        ),
        totalExpenses: state.totalExpenses - existing.amountCentavos + newAmount,
        activityLog: [
          makeLogEntry('expense', `Updated expense: ${updates.title ?? existing.title}`, 'Expense modified'),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      get().showToast('Expense updated');
    } catch (error) {
      console.error('Failed to update expense:', error);
      get().showToast('Failed to update expense');
    }
  },

  deleteExpense: async (id) => {
    const state = get();
    const exp = state.expenses.find((e) => e.id === id);
    if (!exp) return;
    try {
      await deleteExpense(id);
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
        totalExpenses: state.totalExpenses - exp.amountCentavos,
        activityLog: [
          makeLogEntry('expense', `Deleted expense: ${exp.title}`, 'Expense removed'),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      get().showToast('Expense deleted');
    } catch (error) {
      console.error('Failed to delete expense:', error);
      get().showToast('Failed to delete expense');
    }
  },

  // Savings
  addSavingsGoal: async (title, currentPesos, targetPesos) => {
    if (!title.trim() || targetPesos <= 0) return;
    try {
      await get().loadFromDatabase();
      const created = await createSavingsGoal({
        name: title.trim(),
        target_amount: Math.round(targetPesos * 100),
        current_amount: Math.round(currentPesos * 100),
      } as any);
      const goal: SavingsGoal = {
        id: created.id,
        title: created.name,
        currentCentavos: created.current_amount,
        targetCentavos: created.target_amount,
        createdAt: created.created_at,
      };
      set((state) => ({
        savingsGoals: [goal, ...state.savingsGoals],
        totalSavings: state.totalSavings + goal.currentCentavos,
        activityLog: [
          makeLogEntry('savings', `Created goal: ${title.trim()}`, `₱${(targetPesos / 100).toLocaleString('en-PH')} target`),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      get().showToast(`Goal "${title.trim()}" created!`);
    } catch (error) {
      console.error('Failed to add savings goal:', error);
      get().showToast('Failed to create goal');
    }
  },

  updateSavingsAmount: async (id, currentPesos) => {
    const state = get();
    const goal = state.savingsGoals.find((g) => g.id === id);
    if (!goal) return;
    const newCentavos = Math.round(currentPesos * 100);
    const delta = newCentavos - goal.currentCentavos;
    try {
      await updateSavingsGoal(id, { current_amount: newCentavos } as any);
      set((state) => ({
        savingsGoals: state.savingsGoals.map((g) =>
          g.id === id ? { ...g, currentCentavos: newCentavos } : g
        ),
        totalSavings: state.totalSavings + delta,
        activityLog: [
          makeLogEntry('savings', `Updated goal: ${goal.title}`, `₱${(currentPesos / 100).toLocaleString('en-PH')} saved`),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      get().showToast('Goal updated');
    } catch (error) {
      console.error('Failed to update savings:', error);
      get().showToast('Failed to update goal');
    }
  },

  updateSavingsGoal: async (id, updates) => {
    const state = get();
    const existing = state.savingsGoals.find((g) => g.id === id);
    if (!existing) return;
    try {
      await updateSavingsGoal(id, {
        name: updates.title,
        target_amount: updates.targetCentavos,
        current_amount: updates.currentCentavos,
      } as any);
      const newCurrent = updates.currentCentavos ?? existing.currentCentavos;
      const newTarget = updates.targetCentavos ?? existing.targetCentavos;
      const delta = newCurrent - existing.currentCentavos;
      set((state) => ({
        savingsGoals: state.savingsGoals.map((g) =>
          g.id === id ? { ...g, ...updates, currentCentavos: newCurrent, targetCentavos: newTarget } : g
        ),
        totalSavings: state.totalSavings + delta,
        activityLog: [
          makeLogEntry('savings', `Updated goal: ${updates.title ?? existing.title}`, 'Goal modified'),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      get().showToast('Goal updated');
    } catch (error) {
      console.error('Failed to update goal:', error);
      get().showToast('Failed to update goal');
    }
  },

  deleteSavingsGoal: async (id) => {
    const state = get();
    const goal = state.savingsGoals.find((g) => g.id === id);
    if (!goal) return;
    try {
      await deleteSavingsGoal(id);
      set((state) => ({
        savingsGoals: state.savingsGoals.filter((g) => g.id !== id),
        totalSavings: state.totalSavings - goal.currentCentavos,
        activityLog: [
          makeLogEntry('savings', `Deleted goal: ${goal.title}`, 'Goal removed'),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      get().showToast('Goal deleted');
    } catch (error) {
      console.error('Failed to delete goal:', error);
      get().showToast('Failed to delete goal');
    }
  },

  // Tasks
  addTask: async (title, description, dueDate, dueTime, priority) => {
    if (!title.trim()) return;
    try {
      const created = await createTask({
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate,
        due_time: dueTime,
        priority,
        completed: false,
      } as any);
      const task: TaskItem = {
        id: created.id,
        title: created.title,
        description: created.description,
        dueDate: created.due_date ?? '',
        dueTime: created.due_time,
        priority: created.priority,
        completed: Boolean(created.completed),
        createdAt: created.created_at,
      };
      set((state) => ({
        tasks: [task, ...state.tasks],
        completedTasks: state.completedTasks,
        activityLog: [
          makeLogEntry('task', `Created task: ${title.trim()}`, `Due: ${dueDate}`),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      get().showToast(`Task "${title.trim()}" added!`);
    } catch (error) {
      console.error('Failed to add task:', error);
      get().showToast('Failed to add task');
    }
  },

  toggleTask: async (id) => {
    const state = get();
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;
    const completed = !task.completed;
    try {
      await updateTaskCompletion(id, completed);
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, completed } : t
        ),
        completedTasks: state.completedTasks + (completed ? 1 : -1),
        activityLog: [
          makeLogEntry('task', completed ? `Completed "${task.title}"` : `Reopened "${task.title}"`, 'Task status changed'),
          ...state.activityLog,
        ].slice(0, 50),
      }));
    } catch (error) {
      console.error('Failed to toggle task:', error);
      get().showToast('Failed to update task');
    }
  },

  updateTask: async (id, updates) => {
    const state = get();
    const existing = state.tasks.find((t) => t.id === id);
    if (!existing) return;
    try {
      await updateTask(id, {
        title: updates.title,
        description: updates.description,
        due_date: updates.dueDate,
        due_time: updates.dueTime,
        priority: updates.priority,
        completed: updates.completed,
      } as any);
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
        activityLog: [
          makeLogEntry('task', `Updated task: ${updates.title ?? existing.title}`, 'Task modified'),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      get().showToast('Task updated');
    } catch (error) {
      console.error('Failed to update task:', error);
      get().showToast('Failed to update task');
    }
  },

  deleteTask: async (id) => {
    const state = get();
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return;
    try {
      await deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        completedTasks: state.completedTasks - (task.completed ? 1 : 0),
        activityLog: [
          makeLogEntry('task', `Deleted task: ${task.title}`, 'Task removed'),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      get().showToast('Task deleted');
    } catch (error) {
      console.error('Failed to delete task:', error);
      get().showToast('Failed to delete task');
    }
  },

  // Schedule
  addEvent: async (title, date, time, location) => {
    if (!title.trim()) return;
    try {
      const created = await createScheduleActivity({
        title: title.trim(),
        start_time: time,
        end_time: location,
        date,
      } as any);
      const event: ScheduleEvent = {
        id: created.id,
        title: created.title,
        date: created.date,
        time: created.start_time ?? '',
        location: created.end_time ?? '',
        createdAt: created.created_at,
      };
      set((state) => ({
        scheduleEvents: [event, ...state.scheduleEvents],
        activityLog: [
          makeLogEntry('schedule', `Scheduled: ${title.trim()}`, `${date} ${time}`),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      get().showToast(`Scheduled "${title.trim()}"`);
    } catch (error) {
      console.error('Failed to add event:', error);
      get().showToast('Failed to add event');
    }
  },

  updateEvent: async (id, updates) => {
    const state = get();
    const existing = state.scheduleEvents.find((e) => e.id === id);
    if (!existing) return;
    try {
      await updateScheduleActivity(id, {
        title: updates.title,
        start_time: updates.time,
        end_time: updates.location,
        date: updates.date,
      } as any);
      set((state) => ({
        scheduleEvents: state.scheduleEvents.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        ),
        activityLog: [
          makeLogEntry('schedule', `Updated event: ${updates.title ?? existing.title}`, 'Event modified'),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      get().showToast('Event updated');
    } catch (error) {
      console.error('Failed to update event:', error);
      get().showToast('Failed to update event');
    }
  },

  deleteEvent: async (id) => {
    const state = get();
    const event = state.scheduleEvents.find((e) => e.id === id);
    if (!event) return;
    try {
      await deleteScheduleActivity(id);
      set((state) => ({
        scheduleEvents: state.scheduleEvents.filter((e) => e.id !== id),
        activityLog: [
          makeLogEntry('schedule', `Deleted event: ${event.title}`, 'Event removed'),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      get().showToast('Event deleted');
    } catch (error) {
      console.error('Failed to delete event:', error);
      get().showToast('Failed to delete event');
    }
  },

  // Activity log
  logActivity: async (type, title, subtitle) => {
    try {
      await recordActivity({
        type,
        title,
        related_id: undefined,
        activity_date: new Date().toISOString().split('T')[0],
      } as any);
      set((state) => ({
        activityLog: [
          makeLogEntry(type, title, subtitle),
          ...state.activityLog,
        ].slice(0, 50),
      }));
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  },

  // Theme
  applyTheme: async (mode, primaryColor, fontFamily) => {
    set((state) => ({
      theme: {
        mode,
        primaryColor: primaryColor ?? state.theme.primaryColor,
        fontFamily: fontFamily ?? state.theme.fontFamily,
      },
    }));
    const root = document.documentElement;
    if (mode === 'dark') {
      root.setAttribute('data-mode', 'dark');
    } else {
      root.removeAttribute('data-mode');
    }
    if (primaryColor) {
      root.style.setProperty('--color-brand-500', primaryColor);
    }
    if (fontFamily) {
      root.style.setProperty('--font-sans', `'${fontFamily}', 'Inter', sans-serif`);
    }
    try {
      await savePreference('theme_mode', mode);
      if (primaryColor) await savePreference('theme_color', primaryColor);
      if (fontFamily) await savePreference('font_family', fontFamily);
    } catch {
      // prefs are optional
    }
    get().showToast('Theme applied');
  },

  resetTheme: async () => {
    set({ theme: { mode: 'light', primaryColor: '#6D42EF', fontFamily: 'Plus Jakarta Sans' } });
    const root = document.documentElement;
    root.removeAttribute('data-mode');
    root.style.removeProperty('--color-brand-500');
    root.style.removeProperty('--font-sans');
    try {
      await savePreference('theme_mode', 'light');
      await savePreference('theme_color', '#6D42EF');
      await savePreference('font_family', 'Plus Jakarta Sans');
    } catch {
      // prefs are optional
    }
    get().showToast('Theme reset to default');
  },

  showToast: (message: string) => {
    set({ toastMessage: message, toastVisible: true });
    setTimeout(() => {
      set({ toastVisible: false });
    }, 2200);
  },
}), {
  name: 'dayflow-ui-preferences',
  partialize: (state) => ({
    theme: state.theme,
    taskFilter: state.taskFilter,
    walletPeriod: state.walletPeriod,
    selectedDay: state.selectedDay,
  }),
}));
