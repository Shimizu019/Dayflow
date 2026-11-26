import { useNavigate } from 'react-router-dom';
import { BenjuAvatar } from '@/components/ui/BrandAssets';
import { useDayflowStore } from '@/store/useDayflowStore';

interface MenuItem {
  label: string;
  action: () => void;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    label: 'Backup Data',
    action: () => {},
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <rect x="3" y="6" width="18" height="13" rx="3" />
        <circle cx="12" cy="12.5" r="2.8" />
        <path d="M8.5 6l1.2-2h4.6l1.2 2" />
      </svg>
    ),
  },
  {
    label: 'Restore Data',
    action: () => {},
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <rect x="4" y="5" width="16" height="14" rx="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m-3-3h6" />
      </svg>
    ),
  },
  {
    label: 'App Settings',
    action: () => {},
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    label: 'About Dayflow',
    action: () => {},
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 11v5" />
        <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Help & Support',
    action: () => {},
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M9.5 9.5a2.5 2.5 0 014.8 1c0 1.5-2.3 2-2.3 3.5" />
        <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { resetDemoData } = useDayflowStore();

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col justify-between bg-[#F8F7FC] px-6 pt-4 pb-6">
      <div>
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 -ml-1.5 rounded-xl text-ink-700 hover:bg-brand-100/60 transition-colors"
            aria-label="Back to Home"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="w-5" />
        </div>

        <div className="flex flex-col items-center text-center mb-7">
          <div className="p-1 rounded-full bg-white shadow-card mb-3">
            <BenjuAvatar />
          </div>
          <h1 className="text-[18px] font-extrabold text-ink-900">Benju Guzman</h1>
          <p className="text-[12px] font-medium text-ink-500 mt-0.5">Dayflow User</p>
        </div>

        <div className="h-px bg-gray-200/70 mb-2" />

        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-4 py-3.5 px-2 rounded-2xl text-ink-900 hover:bg-brand-50/80 transition-colors text-left"
            >
              <span className="text-ink-900">{item.icon}</span>
              <span className="text-[14px] font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={() => {
            resetDemoData();
            navigate('/');
          }}
          className="w-full py-3.5 rounded-2xl bg-[#FADEE3] hover:bg-[#F7CED6] text-[#E11D48] font-bold text-[14px] flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 8l4 4-4 4M8 12h7" />
          </svg>
          <span>Logout</span>
        </button>

        <div className="text-center text-[11px] font-medium text-ink-400 mt-4">
          Dayflow v1.0.0
        </div>
      </div>
    </div>
  );
}
