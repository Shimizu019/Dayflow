import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { BottomNavigation } from '@/components/ui/BottomNavigation';
import { Toast } from '@/components/ui/Toast';
import AddNewModal from '@/components/modals/AddNewModal';
import { useDayflowStore } from '@/store/useDayflowStore';

export default function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const showBottomNav = location.pathname !== '/profile';

  const { isModalOpen, toastMessage, toastVisible } = useDayflowStore();

  return (
    <PhoneFrame>
      <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
        <Outlet />
      </main>
      {showBottomNav && (
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
            const { openModal } = useDayflowStore.getState();
            openModal();
          }}
        />
      )}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onDismiss={() => {
          const { closeModal } = useDayflowStore.getState();
          closeModal();
        }}
      />
      {isModalOpen && <AddNewModal />}
    </PhoneFrame>
  );
}
