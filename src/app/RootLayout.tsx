import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation } from '@/components/ui/BottomNavigation';
import { Toast } from '@/components/ui/Toast';
import { useDayflowStore } from '@/store/useDayflowStore';

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const toastMessage = useDayflowStore((state) => state.toastMessage);
  const toastVisible = useDayflowStore((state) => state.toastVisible);
  const openModal = useDayflowStore((state) => state.openModal);
  const dismissToast = useDayflowStore((state) => state.dismissToast);

  return (
    <div className="h-[100dvh] min-h-0 bg-[#F8F7FC] flex flex-col w-full overflow-hidden">
        <main className="flex-1 min-h-0 relative flex flex-col w-full max-w-none">
        <Outlet />
      </main>
      <BottomNavigation
        onTabChange={(tab) => {
          const pathMap: Record<string, string> = {
            home: '/',
            wallet: '/wallet',
            schedule: '/schedule',
            profile: '/profile',
          };
          navigate(pathMap[tab]);
        }}
        onAddNew={() => {
          if (location.pathname === '/wallet') openModal('expense');
          else if (location.pathname === '/savings') openModal('savings');
          else if (location.pathname === '/tasks') openModal('task');
          else if (location.pathname === '/schedule') openModal('event');
          else openModal('menu');
        }}
      />
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onDismiss={dismissToast}
      />
    </div>
  );
}
