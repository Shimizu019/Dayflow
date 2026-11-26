import { useNavigate } from 'react-router-dom';
import { PiggyBank3D, GoalThumbnail } from '@/components/ui/BrandAssets';
import { useDayflowStore } from '@/store/useDayflowStore';
import { formatPeso } from '@/utils/format';

export default function SavingsScreen() {
  const navigate = useNavigate();
  const {
    totalSavings,
    goals,
    topUpGoal,
    openModal,
  } = useDayflowStore();

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col px-5 pt-2 pb-8">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/')}
          className="p-1.5 -ml-1.5 rounded-xl text-ink-900 hover:bg-brand-100/60 transition-colors"
          aria-label="Back"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="text-[17px] font-bold text-ink-900">Savings</h1>
        <button
          onClick={() => navigate('/profile')}
          className="p-1.5 -mr-1.5 rounded-xl text-ink-900 hover:bg-brand-100/60 transition-colors"
          aria-label="Settings"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>

      <div className="savings-banner-card rounded-3xl pl-5 pr-3 py-4 mb-6 flex items-center justify-between shadow-card">
        <div>
          <div className="text-[13px] font-semibold text-ink-700">Total Savings</div>
          <div className="text-[26px] font-extrabold text-ink-900 tracking-tight mt-0.5">{formatPeso(totalSavings, true)}</div>
        </div>
        <div className="shrink-0 -my-1">
          <PiggyBank3D />
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-bold text-ink-900">My Goals</h2>
        <button
          onClick={() => {}}
          className="text-[12px] font-semibold text-brand-600 hover:underline flex items-center gap-0.5"
        >
          See all
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="space-y-3.5 mb-6">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
          return (
            <div key={goal.id} className="bg-white rounded-[22px] p-3.5 shadow-card flex items-center gap-3.5">
              <GoalThumbnail theme={goal.theme} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="text-[14px] font-bold text-ink-900 truncate">{goal.title}</div>
                  <button
                    onClick={() => topUpGoal(goal.id)}
                    title="Add ₱500 to goal"
                    className="p-1 -mr-1 text-ink-500 hover:text-brand-600 rounded-lg"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                    </svg>
                  </button>
                </div>
                <div className="text-[12px] mt-0.5">
                  <span className="font-bold text-ink-900">{formatPeso(goal.saved)}</span>
                  <span className="text-ink-500"> / {formatPeso(goal.target)}</span>
                </div>
                <div className="flex items-center gap-2.5 mt-2.5">
                  <div className="flex-1 h-2 bg-[#ECE8F8] rounded-full overflow-hidden">
                    <div className="h-full bg-brand-600 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] font-bold text-ink-900 w-8 text-right">{pct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => openModal('goal')}
        className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-bold text-[14px] shadow-hero flex items-center justify-center gap-2 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span>Create Goal</span>
      </button>
    </div>
  );
}
