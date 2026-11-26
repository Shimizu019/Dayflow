import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Tab = 'home' | 'wallet' | 'savings' | 'tasks' | 'schedule' | 'profile';
export type TaskFilter = 'All' | 'Pending' | 'Completed';
export type WalletPeriod = 'This Month' | 'This Week' | 'All Time';
export type GoalTheme = 'beach' | 'laptop';

export interface SpendingItem {
  label: string;
  pct: number;
  color: string;
}

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  timeLabel: string;
  homeTime?: string;
  type: 'food' | 'transport';
}

export interface SavingsGoal {
  id: number;
  title: string;
  saved: number;
  target: number;
  theme: GoalTheme;
}

export interface TaskItem {
  id: number;
  title: string;
  due: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  _prevDue?: string;
}

export interface TimelineEvent {
  id: number;
  time: string;
  title: string;
  location: string;
  icon: 'book' | 'users';
}

export interface UpcomingEvent {
  id: number;
  date: string;
  title: string;
  timeRange: string;
}

export interface WeekDay {
  day: string;
  date: number;
}

interface DayflowState {
  currentScreen: Tab;
  isOffline: boolean;
  selectedDay: number;
  taskFilter: TaskFilter;
  walletPeriod: WalletPeriod;
  todaySpent: number;
  todaySaved: number;
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  spending: SpendingItem[];
  transactions: Transaction[];
  goals: SavingsGoal[];
  tasks: TaskItem[];
  weekDays: WeekDay[];
  timelineEvents: TimelineEvent[];
  upcomingEvents: UpcomingEvent[];
  toastMessage: string;
  toastVisible: boolean;
  isModalOpen: boolean;
  modalDirectForm: string | null;

  navigateTo: (screen: Tab) => void;
  setTaskFilter: (filter: TaskFilter) => void;
  setWalletPeriod: (period: WalletPeriod) => void;
  toggleOfflineStatus: () => void;
  topUpGoal: (id: number) => void;
  toggleTask: (id: number) => void;
  selectScheduleDay: (date: number) => void;
  submitExpense: (title: string, amount: number) => void;
  submitGoal: (title: string, saved: number, target: number) => void;
  submitTask: (title: string, due: string, priority: 'High' | 'Medium' | 'Low') => void;
  submitEvent: (title: string, time: string, location: string) => void;
  resetDemoData: () => void;
  showToast: (message: string) => void;
  openModal: (directForm?: string) => void;
  closeModal: () => void;
}

export const useDayflowStore = create<DayflowState>()(persist((set, get) => ({
  currentScreen: 'home',
  isOffline: true,
  selectedDay: 18,
  taskFilter: 'All',
  walletPeriod: 'This Month',
  todaySpent: 250,
  todaySaved: 500,
  currentBalance: 2350.00,
  totalIncome: 3500,
  totalExpenses: 1150,
  totalSavings: 5000.00,
  spending: [
    { label: 'Food & Drinks', pct: 40, color: '#5D32E6' },
    { label: 'Transport', pct: 30, color: '#9370F8' },
    { label: 'Others', pct: 30, color: '#C7B6FB' },
  ],
  transactions: [
    { id: 1, title: 'Food & Drinks', amount: 150, timeLabel: 'Today', homeTime: '9:20 AM', type: 'food' },
    { id: 2, title: 'Transport', amount: 50, timeLabel: 'Yesterday', homeTime: '8:45 AM', type: 'transport' },
  ],
  goals: [
    { id: 1, title: 'Vacation Trip', saved: 2000, target: 10000, theme: 'beach' },
    { id: 2, title: 'New Laptop', saved: 5000, target: 30000, theme: 'laptop' },
  ],
  tasks: [
    { id: 1, title: 'Finish UI Design', due: 'Today', priority: 'High', completed: false },
    { id: 2, title: 'Study React', due: 'Today', priority: 'Medium', completed: false },
    { id: 3, title: 'Workout', due: 'Tomorrow', priority: 'Low', completed: false },
    { id: 4, title: 'Read a book', due: 'Completed', priority: 'Low', completed: true },
  ],
  weekDays: [
    { day: 'Sun', date: 16 },
    { day: 'Mon', date: 17 },
    { day: 'Tue', date: 18 },
    { day: 'Wed', date: 19 },
    { day: 'Thu', date: 20 },
    { day: 'Fri', date: 21 },
    { day: 'Sat', date: 22 },
  ],
  timelineEvents: [
    { id: 1, time: '9:00 AM', title: 'Class: Web Development', location: 'Room 301', icon: 'book' },
    { id: 2, time: '1:00 PM', title: 'Group Project Meeting', location: 'Online', icon: 'users' },
  ],
  upcomingEvents: [
    { id: 101, date: 'Nov 19', title: 'Midterm Exam', timeRange: '9:00 AM – 11:00 AM' },
  ],
  toastMessage: '',
  toastVisible: false,
  isModalOpen: false,
  modalDirectForm: null,

  navigateTo: (screen: Tab) => {
    set({ currentScreen: screen, isModalOpen: false, modalDirectForm: null });
  },

  setTaskFilter: (filter: TaskFilter) => {
    set({ taskFilter: filter });
  },

  setWalletPeriod: (period: WalletPeriod) => {
    set({ walletPeriod: period });
  },

  toggleOfflineStatus: () => {
    set((state) => {
      const isOffline = !state.isOffline;
      return { isOffline };
    });
    get().showToast(get().isOffline ? 'Switched to Offline mode' : 'All data synced');
  },

  topUpGoal: (id: number) => {
    set((state) => {
      const goal = state.goals.find((g) => g.id === id);
      if (!goal) return state;
      const newSaved = Math.min(goal.target, goal.saved + 500);
      return {
        goals: state.goals.map((g) => (g.id === id ? { ...g, saved: newSaved } : g)),
        totalSavings: state.totalSavings + 500,
      };
    });
    get().showToast(`Added ₱500 to goal!`);
  },

  toggleTask: (id: number) => {
    set((state) => {
      const task = state.tasks.find((t) => t.id === id);
      if (!task) return state;
      const completed = !task.completed;
      let due = task.due;
      let _prevDue = task._prevDue;
      if (completed && task.due !== 'Completed') {
        _prevDue = task.due;
        due = 'Completed';
      } else if (!completed && task._prevDue) {
        due = task._prevDue;
        _prevDue = undefined;
      }
      return {
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, completed, due, _prevDue } : t
        ),
      };
    });
  },

  selectScheduleDay: (date: number) => {
    set({ selectedDay: date });
  },

  submitExpense: (title: string, amount: number) => {
    if (!amount || amount <= 0) return;
    set((state) => {
      const newTransaction: Transaction = {
        id: Date.now(),
        title,
        amount,
        timeLabel: 'Today',
        homeTime: 'Just now',
        type: title === 'Transport' ? 'transport' : 'food',
      };
      return {
        todaySpent: state.todaySpent + amount,
        totalExpenses: state.totalExpenses + amount,
        currentBalance: Math.max(0, state.currentBalance - amount),
        transactions: [newTransaction, ...state.transactions],
      };
    });
    get().closeModal();
    get().navigateTo('wallet');
    get().showToast(`Added ₱${amount} expense`);
  },

  submitGoal: (title: string, saved: number, target: number) => {
    if (!title || target <= 0) return;
    set((state) => {
      const newGoal: SavingsGoal = {
        id: Date.now(),
        title,
        saved,
        target,
        theme: state.goals.length % 2 === 0 ? 'beach' : 'laptop',
      };
      return {
        goals: [...state.goals, newGoal],
        totalSavings: state.totalSavings + saved,
      };
    });
    get().closeModal();
    get().navigateTo('savings');
    get().showToast(`Goal "${title}" created!`);
  },

  submitTask: (title: string, due: string, priority: 'High' | 'Medium' | 'Low') => {
    if (!title) return;
    set((state) => {
      const newTask: TaskItem = {
        id: Date.now(),
        title,
        due,
        priority,
        completed: false,
      };
      return {
        tasks: [newTask, ...state.tasks],
      };
    });
    get().closeModal();
    get().navigateTo('tasks');
    get().showToast(`Task "${title}" added!`);
  },

  submitEvent: (title: string, time: string, location: string) => {
    if (!title) return;
    set((state) => {
      const newEvent: TimelineEvent = {
        id: Date.now(),
        time,
        title,
        location,
        icon: 'book',
      };
      return {
        timelineEvents: [...state.timelineEvents, newEvent],
      };
    });
    get().closeModal();
    get().navigateTo('schedule');
    get().showToast(`Scheduled "${title}"`);
  },

  resetDemoData: () => {
    set({
      todaySpent: 250,
      todaySaved: 500,
      currentBalance: 2350.00,
      totalIncome: 3500,
      totalExpenses: 1150,
      totalSavings: 5000.00,
      transactions: [
        { id: 1, title: 'Food & Drinks', amount: 150, timeLabel: 'Today', homeTime: '9:20 AM', type: 'food' },
        { id: 2, title: 'Transport', amount: 50, timeLabel: 'Yesterday', homeTime: '8:45 AM', type: 'transport' },
      ],
      goals: [
        { id: 1, title: 'Vacation Trip', saved: 2000, target: 10000, theme: 'beach' },
        { id: 2, title: 'New Laptop', saved: 5000, target: 30000, theme: 'laptop' },
      ],
      tasks: [
        { id: 1, title: 'Finish UI Design', due: 'Today', priority: 'High', completed: false },
        { id: 2, title: 'Study React', due: 'Today', priority: 'Medium', completed: false },
        { id: 3, title: 'Workout', due: 'Tomorrow', priority: 'Low', completed: false },
        { id: 4, title: 'Read a book', due: 'Completed', priority: 'Low', completed: true },
      ],
      currentScreen: 'home',
    });
    get().showToast('Restored original showcase data');
  },

  showToast: (message: string) => {
    set({ toastMessage: message, toastVisible: true });
    setTimeout(() => {
      set({ toastVisible: false });
    }, 2200);
  },

  openModal: (directForm?: string) => {
    set({ isModalOpen: true, modalDirectForm: directForm ?? null });
  },

  closeModal: () => {
    set({ isModalOpen: false, modalDirectForm: null });
  },
}), {
  name: 'dayflow-ui-preferences',
  partialize: (state) => ({
    selectedDay: state.selectedDay,
    taskFilter: state.taskFilter,
    walletPeriod: state.walletPeriod,
  }),
}));
