import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './RootLayout';
import DashboardScreen from '@/features/dashboard/pages/DashboardScreen';
import WalletScreen from '@/features/wallet/pages/WalletScreen';
import SavingsScreen from '@/features/savings/pages/SavingsScreen';
import TasksScreen from '@/features/tasks/pages/TasksScreen';
import ScheduleScreen from '@/features/schedule/pages/ScheduleScreen';
import ProfileScreen from '@/features/profile/pages/ProfileScreen';
import ThemeScreen from '@/features/theme/pages/ThemeScreen';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardScreen /> },
      { path: 'wallet', element: <WalletScreen /> },
      { path: 'savings', element: <SavingsScreen /> },
      { path: 'tasks', element: <TasksScreen /> },
      { path: 'schedule', element: <ScheduleScreen /> },
      { path: 'profile', element: <ProfileScreen /> },
      { path: 'theme', element: <ThemeScreen /> },
    ],
  },
]);

export default router;
