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
import { getRecentActivities, recordActivity } from '@/database/repositories/activityLogRepository';
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
  endTime?: string;
  description?: string;
  location?: string;
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

  addExpense: (title: string, amountPesos: number, category: 'Food & Drinks' | 'Transport' | 'Others', date: string) => Promise<boolean>;
  updateExpense: (id: number, updates: Partial<Expense>) => Promise<boolean>;
  deleteExpense: (id: number) => Promise<boolean>;

  addSavingsGoal: (title: string, currentPesos: number, targetPesos: number) => Promise<boolean>;
  updateSavingsAmount: (id: number, currentPesos: number) => Promise<boolean>;
  updateSavingsGoal: (id: number, updates: Partial<SavingsGoal>) => Promise<boolean>;
  deleteSavingsGoal: (id: number) => Promise<boolean>;

  addTask: (title: string, description: string, dueDate: string, dueTime: string, priority: 'High' | 'Medium' | 'Low') => Promise<boolean>;
  toggleTask: (id: number) => Promise<boolean>;
  updateTask: (id: number, updates: Partial<TaskItem>) => Promise<boolean>;
  deleteTask: (id: number) => Promise<boolean>;

  addEvent: (title: string, date: string, time: string, endTime: string, description: string, location: string) => Promise<boolean>;
  updateEvent: (id: number, updates: Partial<ScheduleEvent>) => Promise<boolean>;
  deleteEvent: (id: number) => Promise<boolean>;

  logActivity: (type: ActivityType, title: string, subtitle: string) => Promise<void>;

  applyTheme: (mode: 'light' | 'dark', primaryColor?: string, fontFamily?: string) => Promise<void>;
  resetTheme: () => Promise<void>;

  showToast: (message: string) => void;
  dismissToast: () => void;
  toastMessage: string;
  toastVisible: boolean;

  loadFromDatabase: (force?: boolean) => Promise<void>;
}

let isDbReady = false;
let dbLoadPromise: Promise<void> | null = null;

async function refreshAfterMutation(reload: () => Promise<void>): Promise<void> {
  try {
    await reload();
  } catch (error) {
    console.error('A database write succeeded but refreshing the view failed:', error);
  }
}

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

  loadFromDatabase: async (force = false) => {
    if (isDbReady && !force) return;
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
        const activities = await getRecentActivities(50);

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
          endTime: ev.end_time ?? '',
          description: ev.description ?? '',
          location: ev.location ?? '',
          createdAt: ev.created_at,
        }));

        const totalExpenses = expenseItems.reduce((sum, e) => sum + e.amountCentavos, 0);
        const totalSavings = goalItems.reduce((sum, g) => sum + g.currentCentavos, 0);
        const completedTasks = taskItems.filter((t) => t.completed).length;
        const activityItems: ActivityLogEntry[] = activities.map((activity) => ({
          id: activity.id,
          type: activity.type as ActivityType,
          title: activity.title,
          subtitle: activity.activity_date ?? '',
          createdAt: activity.timestamp,
        }));

        set({
          expenses: expenseItems,
          savingsGoals: goalItems,
          tasks: taskItems,
          scheduleEvents: eventItems,
          activityLog: activityItems,
          totalExpenses,
          totalSavings,
          completedTasks,
        });
        isDbReady = true;
      } catch (error) {
        isDbReady = false;
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
    if (!title.trim() || !validateAmount(amountPesos) || !['Food & Drinks', 'Transport', 'Others'].includes(category) || !date) {
      get().showToast('Unable to save expense. Check your information and try again.');
      return false;
    }
    const amountCentavos = Math.round(amountPesos * 100);
    try {
      await get().loadFromDatabase();
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
      await get().logActivity('expense', `Logged expense: ${title.trim()}`, `₱${amountPesos.toLocaleString('en-PH')}`);
      get().showToast('Expense saved successfully');
      return true;
    } catch (error) {
      console.error('Failed to add expense:', error);
      get().showToast('Unable to save expense. Check your information and try again.');
      return false;
    }
  },

  updateExpense: async (id, updates) => {
    const state = get();
    const existing = state.expenses.find((e) => e.id === id);
    if (!existing) return false;
    if (updates.amountCentavos !== undefined && !validateAmount(updates.amountCentavos / 100)) {
      get().showToast('Unable to update expense. Check the amount and try again.');
      return false;
    }
    try {
      await get().loadFromDatabase();
      const updated = await updateExpense(id, {
        title: updates.title,
        amount: updates.amountCentavos,
        category: updates.category,
        date: updates.date,
      } as any);
      if (!updated) throw new Error('Expense update did not affect a record');
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
      await get().logActivity('expense', `Updated expense: ${updates.title ?? existing.title}`, 'Expense modified');
      get().showToast('Expense updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update expense:', error);
      get().showToast('Unable to update expense. Please try again.');
      return false;
    }
  },

  deleteExpense: async (id) => {
    const state = get();
    const exp = state.expenses.find((e) => e.id === id);
    if (!exp) return false;
    try {
      await get().loadFromDatabase();
      if (!await deleteExpense(id)) throw new Error('Expense delete did not affect a record');
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
        totalExpenses: state.totalExpenses - exp.amountCentavos,
        activityLog: [
          makeLogEntry('expense', `Deleted expense: ${exp.title}`, 'Expense removed'),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      await get().logActivity('expense', `Deleted expense: ${exp.title}`, 'Expense removed');
      get().showToast('Expense deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete expense:', error);
      get().showToast('Unable to delete expense. Please try again.');
      return false;
    }
  },

  // Savings
  addSavingsGoal: async (title, currentPesos, targetPesos) => {
    if (!title.trim() || !Number.isFinite(targetPesos) || targetPesos <= 0 || !Number.isFinite(currentPesos) || currentPesos < 0) {
      get().showToast('Unable to save savings goal. Check your information and try again.');
      return false;
    }
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
      await get().logActivity('savings', `Created goal: ${title.trim()}`, `₱${targetPesos.toLocaleString('en-PH')} target`);
      get().showToast('Savings goal created successfully');
      return true;
    } catch (error) {
      console.error('Failed to add savings goal:', error);
      get().showToast('Unable to save savings goal. Please try again.');
      return false;
    }
  },

  updateSavingsAmount: async (id, currentPesos) => {
    const state = get();
    const goal = state.savingsGoals.find((g) => g.id === id);
    if (!goal) return false;
    const newCentavos = Math.round(currentPesos * 100);
    const delta = newCentavos - goal.currentCentavos;
    try {
      await get().loadFromDatabase();
      if (!await updateSavingsGoal(id, { current_amount: newCentavos } as any)) throw new Error('Savings update did not affect a record');
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
      await get().logActivity('savings', `Updated goal: ${goal.title}`, `₱${currentPesos.toLocaleString('en-PH')} saved`);
      get().showToast('Savings goal updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update savings:', error);
      get().showToast('Unable to update savings goal. Please try again.');
      return false;
    }
  },

  updateSavingsGoal: async (id, updates) => {
    const state = get();
    const existing = state.savingsGoals.find((g) => g.id === id);
    if (!existing) return false;
    try {
      await get().loadFromDatabase();
      if (!await updateSavingsGoal(id, {
        name: updates.title,
        target_amount: updates.targetCentavos,
        current_amount: updates.currentCentavos,
      } as any)) throw new Error('Savings goal update did not affect a record');
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
      await get().logActivity('savings', `Updated goal: ${updates.title ?? existing.title}`, 'Goal modified');
      get().showToast('Savings goal updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update goal:', error);
      get().showToast('Unable to update savings goal. Please try again.');
      return false;
    }
  },

  deleteSavingsGoal: async (id) => {
    const state = get();
    const goal = state.savingsGoals.find((g) => g.id === id);
    if (!goal) return false;
    try {
      await get().loadFromDatabase();
      if (!await deleteSavingsGoal(id)) throw new Error('Savings goal delete did not affect a record');
      set((state) => ({
        savingsGoals: state.savingsGoals.filter((g) => g.id !== id),
        totalSavings: state.totalSavings - goal.currentCentavos,
        activityLog: [
          makeLogEntry('savings', `Deleted goal: ${goal.title}`, 'Goal removed'),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      await get().logActivity('savings', `Deleted goal: ${goal.title}`, 'Goal removed');
      get().showToast('Savings goal deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete goal:', error);
      get().showToast('Unable to delete savings goal. Please try again.');
      return false;
    }
  },

  // Tasks
  addTask: async (title, description, dueDate, dueTime, priority) => {
    if (!title.trim() || !dueDate || !dueTime || !['High', 'Medium', 'Low'].includes(priority)) {
      get().showToast('Unable to save task. Check your information and try again.');
      return false;
    }
    try {
      await get().loadFromDatabase();
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
      await get().logActivity('task', `Created task: ${title.trim()}`, `Due: ${dueDate}`);
      get().showToast('Task saved successfully');
      return true;
    } catch (error) {
      console.error('Failed to add task:', error);
      get().showToast('Unable to save task. Please try again.');
      return false;
    }
  },

  toggleTask: async (id) => {
    const state = get();
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return false;
    const completed = !task.completed;
    try {
      await get().loadFromDatabase();
      if (!await updateTaskCompletion(id, completed)) throw new Error('Task completion update did not affect a record');
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
      await get().logActivity('task', completed ? `Completed "${task.title}"` : `Reopened "${task.title}"`, 'Task status changed');
      get().showToast(completed ? 'Task marked as completed' : 'Task marked as pending');
      return true;
    } catch (error) {
      console.error('Failed to toggle task:', error);
      get().showToast('Unable to update task. Please try again.');
      return false;
    }
  },

  updateTask: async (id, updates) => {
    const state = get();
    const existing = state.tasks.find((t) => t.id === id);
    if (!existing) return false;
    try {
      await get().loadFromDatabase();
      if (!await updateTask(id, {
        title: updates.title,
        description: updates.description,
        due_date: updates.dueDate,
        due_time: updates.dueTime,
        priority: updates.priority,
        completed: updates.completed,
      } as any)) throw new Error('Task update did not affect a record');
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
        activityLog: [
          makeLogEntry('task', `Updated task: ${updates.title ?? existing.title}`, 'Task modified'),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      await get().logActivity('task', `Updated task: ${updates.title ?? existing.title}`, 'Task modified');
      get().showToast('Task updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update task:', error);
      get().showToast('Unable to update task. Please try again.');
      return false;
    }
  },

  deleteTask: async (id) => {
    const state = get();
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return false;
    try {
      await get().loadFromDatabase();
      if (!await deleteTask(id)) throw new Error('Task delete did not affect a record');
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        completedTasks: state.completedTasks - (task.completed ? 1 : 0),
        activityLog: [
          makeLogEntry('task', `Deleted task: ${task.title}`, 'Task removed'),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      await get().logActivity('task', `Deleted task: ${task.title}`, 'Task removed');
      get().showToast('Task deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete task:', error);
      get().showToast('Unable to delete task. Please try again.');
      return false;
    }
  },

  // Schedule
  addEvent: async (title, date, time, endTime, description, location) => {
    if (!title.trim() || !date || !time) {
      get().showToast('Unable to save event. Check your information and try again.');
      return false;
    }
    try {
      await get().loadFromDatabase();
      const created = await createScheduleActivity({
        title: title.trim(),
        start_time: time,
        end_time: endTime || undefined,
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        date,
      } as any);
      const event: ScheduleEvent = {
        id: created.id,
        title: created.title,
        date: created.date,
        time: created.start_time ?? '',
        endTime: created.end_time ?? '',
        description: created.description ?? '',
        location: created.location ?? '',
        createdAt: created.created_at,
      };
      set((state) => ({
        scheduleEvents: [event, ...state.scheduleEvents],
        activityLog: [
          makeLogEntry('schedule', `Scheduled: ${title.trim()}`, `${date} ${time}`),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      await get().logActivity('schedule', `Scheduled: ${title.trim()}`, `${date} ${time}`);
      get().showToast('Event saved successfully');
      return true;
    } catch (error) {
      console.error('Failed to add event:', error);
      get().showToast('Unable to save event. Please try again.');
      return false;
    }
  },

  updateEvent: async (id, updates) => {
    const state = get();
    const existing = state.scheduleEvents.find((e) => e.id === id);
    if (!existing) return false;
    try {
      await get().loadFromDatabase();
      if (!await updateScheduleActivity(id, {
        title: updates.title,
        start_time: updates.time,
        end_time: updates.endTime,
        description: updates.description,
        location: updates.location,
        date: updates.date,
      } as any)) throw new Error('Event update did not affect a record');
      set((state) => ({
        scheduleEvents: state.scheduleEvents.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        ),
        activityLog: [
          makeLogEntry('schedule', `Updated event: ${updates.title ?? existing.title}`, 'Event modified'),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      await get().logActivity('schedule', `Updated event: ${updates.title ?? existing.title}`, 'Event modified');
      get().showToast('Event updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update event:', error);
      get().showToast('Unable to update event. Please try again.');
      return false;
    }
  },

  deleteEvent: async (id) => {
    const state = get();
    const event = state.scheduleEvents.find((e) => e.id === id);
    if (!event) return false;
    try {
      await get().loadFromDatabase();
      if (!await deleteScheduleActivity(id)) throw new Error('Event delete did not affect a record');
      set((state) => ({
        scheduleEvents: state.scheduleEvents.filter((e) => e.id !== id),
        activityLog: [
          makeLogEntry('schedule', `Deleted event: ${event.title}`, 'Event removed'),
          ...state.activityLog,
        ].slice(0, 50),
      }));
      await get().logActivity('schedule', `Deleted event: ${event.title}`, 'Event removed');
      get().showToast('Event deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete event:', error);
      get().showToast('Unable to delete event. Please try again.');
      return false;
    }
  },

  // Activity log
  logActivity: async (type, title, subtitle) => {
    try {
      const saved = await recordActivity({
        type,
        title,
        related_id: undefined,
        activity_date: new Date().toISOString().split('T')[0],
      } as any);
      const activity: ActivityLogEntry = {
        id: saved.id,
        type,
        title,
        subtitle,
        createdAt: saved.timestamp,
      };
      set((state) => {
        const localIndex = state.activityLog.findIndex((entry) =>
          entry.type === type && entry.title === title && Math.abs(Date.now() - new Date(entry.createdAt).getTime()) < 5000
        );
        if (localIndex < 0) return { activityLog: [activity, ...state.activityLog].slice(0, 50) };
        const updated = [...state.activityLog];
        updated[localIndex] = activity;
        return { activityLog: updated };
      });
      await refreshAfterMutation(() => get().loadFromDatabase(true));
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
  },
  dismissToast: () => set({ toastVisible: false }),
}), {
  name: 'dayflow-ui-preferences',
  partialize: (state) => ({
    theme: state.theme,
    taskFilter: state.taskFilter,
    walletPeriod: state.walletPeriod,
    selectedDay: state.selectedDay,
  }),
}));
