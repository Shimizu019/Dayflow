import { useLocation } from 'react-router-dom';

type Tab = 'home' | 'wallet' | 'schedule' | 'profile';

interface BottomNavigationProps {
  onTabChange: (tab: Tab) => void;
  onAddNew: () => void;
}

const tabIcons: Record<Tab, React.ReactNode> = {
  home: (
    <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.3 3.3a1.2 1.2 0 0 1 1.4 0l7.5 5.8c.5.4.8 1 .8 1.6V19a2 2 0 0 1-2 2h-4.2a.8.8 0 0 1-.8-.8v-4.4a2 2 0 0 0-4 0v4.4a.8.8 0 0 1-.8.8H5a2 2 0 0 1-2-2v-8.3c0-.6.3-1.2.8-1.6l7.5-5.8Z" />
    </svg>
  ),
  wallet: (
    <>
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.1 3.05a9 9 0 0 0 0 17.9V3.05Z" />
        <path d="M12.9 3.05v8.05h8.05a9.02 9.02 0 0 0-8.05-8.05Z" />
        <path d="M12.9 12.9v8.05a9.02 9.02 0 0 0 8.05-8.05H12.9Z" />
      </svg>
    </>
  ),
  schedule: (
    <>
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M7.5 2.5a1 1 0 0 1 1 1V5h7V3.5a1 1 0 1 1 2 0V5H19a2.5 2.5 0 0 1 2.5 2.5v11A2.5 2.5 0 0 1 19 21H5a2.5 2.5 0 0 1-2.5-2.5v-11A2.5 2.5 0 0 1 5 5h1.5V3.5a1 1 0 0 1 1-1ZM5 9.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9H5Z" />
        <rect x="7" y="12.2" width="1.8" height="1.8" rx="0.5" />
        <rect x="10" y="12.2" width="1.8" height="1.8" rx="0.5" />
        <rect x="13" y="12.2" width="1.8" height="1.8" rx="0.5" />
        <rect x="15.5" y="14.5" width="2.2" height="2.2" rx="0.6" />
      </svg>
    </>
  ),
  profile: (
    <>
      <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M10.4 2.7a1.7 1.7 0 0 1 3.2 0l.3 1.1c.4.1.8.3 1.2.5l1-.5a1.7 1.7 0 0 1 2.3 2.3l-.5 1c.2.4.4.8.5 1.2l1.1.3a1.7 1.7 0 0 1 0 3.2l-1.1.3c-.1.4-.3.8-.5 1.2l.5 1a1.7 1.7 0 0 1-2.3 2.3l-1-.5c-.4.2-.8.4-1.2.5l-.3 1.1a1.7 1.7 0 0 1-3.2 0l-.3-1.1a6.4 6.4 0 0 1-1.2-.5l-1 .5a1.7 1.7 0 0 1-2.3-2.3l.5-1a6.4 6.4 0 0 1-.5-1.2l-1.1-.3a1.7 1.7 0 0 1 0-3.2l1.1-.3c.1-.4.3-.8.5-1.2l-.5-1a1.7 1.7 0 0 1 2.3-2.3l1 .5c.4-.2.8-.4 1.2-.5l.3-1.1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
      </svg>
    </>
  ),
};

const tabLabels: Record<Tab, string> = {
  home: 'Home',
  wallet: 'My Wallet',
  schedule: 'Schedule',
  profile: 'Settings & Profile',
};

export function BottomNavigation({ onTabChange, onAddNew }: BottomNavigationProps) {
  const location = useLocation();

  // Determine which bottom-nav icon is active based on route.
  // Sub-modules (/savings, /tasks) do not highlight Home.
  const activeBottomTab: Tab | null =
    location.pathname === '/wallet'
      ? 'wallet'
      : location.pathname === '/schedule'
        ? 'schedule'
        : location.pathname === '/profile'
          ? 'profile'
          : location.pathname === '/'
            ? 'home'
            : null;

  return (
    <nav className="fixed z-[60] bottom-0 left-0 right-0 h-[calc(88px+env(safe-area-inset-bottom))] select-none w-full pointer-events-none">
      <svg
        className="notched-nav-svg absolute bottom-0 left-0 right-0 h-[88px] w-full pointer-events-none"
        viewBox="0 0 378 88"
        preserveAspectRatio="none"
        fill="none"
      >
        <path d="M0 44 Q0 18 26 18 L138 18 C148 18 153 22 155.5 30 A33.5 33.5 0 0 0 222.5 30 C225 22 230 18 240 18 L352 18 Q378 18 378 44 L378 88 L0 88 Z" fill="#FFFFFF" />
      </svg>

      <button
        type="button"
        onClick={onAddNew}
        className="fab-purple-orb pointer-events-auto absolute left-1/2 -translate-x-1/2 bottom-[calc(42px+env(safe-area-inset-bottom))] w-[60px] h-[60px] rounded-full hover:brightness-105 active:scale-95 text-white flex items-center justify-center transition-all z-[61] touch-manipulation cursor-pointer"
        aria-label="Add New"
        title="Add expense, savings goal, task, or event"
      >
        <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
        </svg>
      </button>

      <div className="pointer-events-auto absolute bottom-[env(safe-area-inset-bottom)] left-0 right-0 z-[60] h-[58px] flex items-center justify-between px-7 pt-2">
        <div className="flex items-center gap-8 min-w-[44px]">
          <button
            onClick={() => onTabChange('home')}
            className={`p-1.5 rounded-xl transition-colors ${
              activeBottomTab === 'home' ? 'text-brand-600' : 'text-[#827C99] hover:text-brand-600'
            }`}
            aria-label={tabLabels.home}
            aria-current={activeBottomTab === 'home' ? 'page' : undefined}
          >
            {tabIcons.home}
          </button>
          <button
            onClick={() => onTabChange('wallet')}
            className={`p-1.5 rounded-xl transition-colors ${
              activeBottomTab === 'wallet' ? 'text-brand-600' : 'text-[#827C99] hover:text-brand-600'
            }`}
            aria-label={tabLabels.wallet}
            aria-current={activeBottomTab === 'wallet' ? 'page' : undefined}
          >
            {tabIcons.wallet}
          </button>
        </div>
        <div className="flex items-center gap-8 min-w-[44px]">
          <button
            onClick={() => onTabChange('schedule')}
            className={`p-1.5 rounded-xl transition-colors ${
              activeBottomTab === 'schedule' ? 'text-brand-600' : 'text-[#827C99] hover:text-brand-600'
            }`}
            aria-label={tabLabels.schedule}
            aria-current={activeBottomTab === 'schedule' ? 'page' : undefined}
          >
            {tabIcons.schedule}
          </button>
          <button
            onClick={() => onTabChange('profile')}
            className={`p-1.5 rounded-xl transition-colors ${
              activeBottomTab === 'profile' ? 'text-brand-600' : 'text-[#827C99] hover:text-brand-600'
            }`}
            aria-label={tabLabels.profile}
            aria-current={activeBottomTab === 'profile' ? 'page' : undefined}
          >
            {tabIcons.profile}
          </button>
        </div>
      </div>
    </nav>
  );
}
