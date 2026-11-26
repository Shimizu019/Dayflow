import { useNavigate } from 'react-router-dom';
import { BrandLogo } from '@/components/ui/BrandAssets';
import { useDayflowStore } from '@/store/useDayflowStore';
import { formatPeso } from '@/utils/format';

export default function DashboardScreen() {
  const navigate = useNavigate();
  const isOffline = useDayflowStore((state) => state.isOffline);
  const toggleOfflineStatus = useDayflowStore((state) => state.toggleOfflineStatus);
  const {
    todaySpent,
    todaySaved,
    tasks,
    transactions,
  } = useDayflowStore();

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const latestFood = transactions[0] || { title: 'Food & Drinks', amount: 150, homeTime: '9:20 AM' };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col px-5 pt-2 pb-8">
      <div className="absolute top-0 right-0 w-44 h-44 bg-linear-to-bl from-brand-200/45 via-brand-100/20 to-transparent rounded-bl-full pointer-events-none" />

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2">
          <BrandLogo />
          <span className="text-[20px] font-extrabold tracking-tight text-ink-900">Dayflow</span>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleOfflineStatus}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
              isOffline ? 'bg-[#E8F5EF] text-ink-900' : 'bg-brand-100 text-brand-700'
            } text-[11px] font-semibold transition-colors`}
          >
            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-emerald-500' : 'bg-brand-600'}`} />
            <span>{isOffline ? 'Offline' : 'Synced'}</span>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="p-1.5 rounded-full text-ink-900 hover:bg-brand-100/60 transition-colors"
            aria-label="Settings"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mb-5 relative z-10">
        <h1 className="text-[22px] font-extrabold text-ink-900 leading-tight">Good morning!</h1>
        <p className="text-[13px] text-ink-500 mt-0.5 font-medium">
          Let's make today productive ✨
        </p>
      </div>

      <div className="hero-purple-card rounded-[24px] p-5 text-white shadow-hero mb-6">
        <div className="text-[14px] font-semibold text-white/95 mb-4">Today's Overview</div>
        <div className="grid grid-cols-3 divide-x divide-white/20 text-center">
          <button
            onClick={() => navigate('/wallet')}
            className="flex flex-col items-center px-1 hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-pink-200" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3a3 3 0 00-2.6 1.5h5.2A3 3 0 0012 3zm-4.5 3A4.5 4.5 0 003 10.5v4A6.5 6.5 0 009.5 21h5a6.5 6.5 0 006.5-6.5v-4A4.5 4.5 0 0016.5 6h-9zm4.5 4.5a1 1 0 011 1v.5h.5a1 1 0 110 2H13v.5a1 1 0 11-2 0V14h-.5a1 1 0 110-2h.5v-.5a1 1 0 011-1z" />
              </svg>
            </div>
            <div className="text-[15px] font-extrabold tracking-tight">{formatPeso(todaySpent)}</div>
            <div className="text-[11px] text-white/80 font-medium mt-0.5">Spent</div>
          </button>
          <button
            onClick={() => navigate('/savings')}
            className="flex flex-col items-center px-1 hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-emerald-200" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4a1 1 0 011-1h8a1 1 0 011 1v1h1.5A1.5 1.5 0 0120 6.5v2A1.5 1.5 0 0118.5 10H18v8a3 3 0 01-3 3H9a3 3 0 01-3-3v-8h-.5A1.5 1.5 0 014 8.5v-2A1.5 1.5 0 015.5 5H7V4zm5 8.5a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>
            <div className="text-[15px] font-extrabold tracking-tight">{formatPeso(todaySaved)}</div>
            <div className="text-[11px] text-white/80 font-medium mt-0.5">Saved</div>
          </button>
          <button
            onClick={() => navigate('/tasks')}
            className="flex flex-col items-center px-1 hover:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M4.5 3A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3h-15zm11.28 6.72a.75.75 0 00-1.06-1.06L10.5 12.88l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.75-4.75z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-[15px] font-extrabold tracking-tight">{`${completedCount}/${totalTasks}`}</div>
            <div className="text-[11px] text-white/80 font-medium mt-0.5">Tasks</div>
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-ink-900">Recent Activity</h2>
          <button
            onClick={() => navigate('/wallet')}
            className="text-[12px] font-semibold text-brand-600 hover:underline flex items-center gap-0.5"
          >
            See all
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="bg-white rounded-[22px] shadow-card divide-y divide-gray-100/90 px-4 py-1">
          <div
            onClick={() => navigate('/wallet')}
            className="flex items-center gap-3.5 py-3.5 cursor-pointer hover:bg-gray-50/60 transition-colors"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FCE7EE] text-[#DB4377] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2a1 1 0 011 1v5a2 2 0 002 2V3a1 1 0 112 0v7a2 2 0 002-2V3a1 1 0 112 0v5a4 4 0 01-3 3.87V21a1 1 0 11-2 0v-9.13A4 4 0 016 8V3a1 1 0 011-1zm11 0a3 3 0 013 3v7a1 1 0 01-1 1h-1v8a1 1 0 11-2 0V3a1 1 0 011-1z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-bold text-ink-900 truncate">{latestFood.title}</div>
              <div className="text-[12px] text-ink-500 mt-0.5">{`${formatPeso(latestFood.amount)} • ${latestFood.homeTime || '9:20 AM'}`}</div>
            </div>
          </div>
          <div
            onClick={() => navigate('/savings')}
            className="flex items-center gap-3.5 py-3.5 cursor-pointer hover:bg-gray-50/60 transition-colors"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#E3F7ED] text-[#16A34A] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="6" width="18" height="13" rx="3" />
                <path d="M16 12.5h2.5" />
                <path d="M7 6V4.5A1.5 1.5 0 018.5 3h7A1.5 1.5 0 0117 4.5V6" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-bold text-ink-900 truncate">Savings Goal</div>
              <div className="text-[12px] text-ink-500 mt-0.5">{`${formatPeso(todaySaved)} • 8:15 AM`}</div>
            </div>
          </div>
          <div
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-3.5 py-3.5 cursor-pointer hover:bg-gray-50/60 transition-colors"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#ECE7FD] text-brand-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-bold text-ink-900 truncate">Task Completed</div>
              <div className="text-[12px] text-ink-500 mt-0.5">Study Web Dev</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
