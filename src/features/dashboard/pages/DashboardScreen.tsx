import { useNavigate } from 'react-router-dom';
import appLogo from '../../../assets/logo/appLogo.jpg';
import { useDayflowStore, type ActivityType } from '@/store/useDayflowStore';
import { formatPesoFromCentavos } from '@/utils/format';

const currentHour = new Date().getHours();
const DEFAULT_GREETING = currentHour < 12 ? 'Good morning!' : currentHour < 18 ? 'Good afternoon!' : 'Good evening!';

const activityRoutes: Record<ActivityType, string> = {
  expense: '/wallet',
  savings: '/savings',
  task: '/tasks',
  schedule: '/schedule',
};

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { expenses, tasks, savingsGoals, activityLog, totalSavings, completedTasks } = useDayflowStore();
  const today = new Date().toISOString().split('T')[0];
  const todaySpent = expenses
    .filter((expense) => expense.date === today)
    .reduce((sum, expense) => sum + expense.amountCentavos, 0);
  const pendingTasks = Math.max(0, tasks.length - completedTasks);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar relative flex flex-col px-4 pt-2 pb-[calc(112px+env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <img src={appLogo} alt="" className="w-[52px] h-[52px] rounded-[14px] object-cover" />
          <div>
            <div className="text-[16px] leading-tight font-extrabold tracking-tight text-ink-900">Dayflow</div>
            <div className="text-[9px] leading-tight text-ink-500 font-medium">Plan · Track · Achieve</div>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E7F8EE] px-2.5 py-1 text-[10px] font-bold text-[#16864B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#18A058]" /> Offline
        </div>
      </header>

      <section className="mb-3">
        <h1 className="text-[22px] font-extrabold leading-tight text-ink-900">{DEFAULT_GREETING}</h1>
        <p className="text-[12px] text-ink-500 mt-1 font-medium">Here is your daily snapshot across finances and tasks.</p>
      </section>

      <section className="hero-purple-card rounded-[22px] px-4 py-4 text-white shadow-hero mb-4 relative min-h-[174px]">
        <div className="absolute -right-3 -top-7 w-28 h-28 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -right-1 -top-1 w-20 h-20 rounded-full border border-white/10 pointer-events-none" />
        <div className="relative z-[1] flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide font-bold text-white/75 mb-2">Today's Overview</div>
            <button onClick={() => navigate('/wallet')} className="text-left hover:opacity-90" aria-label="Open wallet spending">
              <div className="text-[27px] leading-none font-extrabold tracking-tight tabular-nums">{formatPesoFromCentavos(todaySpent)}</div>
              <div className="text-[11px] text-white/80 font-medium mt-1">Total expenses tracked</div>
            </button>
          </div>
          <button onClick={() => navigate('/wallet')} className="rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-semibold hover:bg-white/30">Wallet →</button>
        </div>
        <div className="relative z-[1] grid grid-cols-3 border-t border-white/20 mt-3.5 pt-3 text-center">
          <button onClick={() => navigate('/savings')} className="text-left pl-1 hover:opacity-90">
            <div className="text-[10px] font-medium text-white/75">Total Saved</div>
            <div className="text-[14px] font-extrabold tabular-nums mt-0.5">{formatPesoFromCentavos(totalSavings)}</div>
          </button>
          <button onClick={() => navigate('/tasks')} className="hover:opacity-90">
            <div className="text-[10px] font-medium text-white/75">Tasks Done</div>
            <div className="text-[14px] font-extrabold tabular-nums mt-0.5">{completedTasks} of {tasks.length}</div>
          </button>
          <button onClick={() => navigate('/tasks')} className="text-right pr-1 hover:opacity-90">
            <div className="text-[10px] font-medium text-white/75">Pending</div>
            <div className="text-[14px] font-extrabold tabular-nums mt-0.5">{pendingTasks}</div>
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2.5 mb-4">
        <button onClick={() => navigate('/savings')} className="bg-white rounded-[17px] border border-[#ECE8FA] p-2.5 flex items-center gap-2.5 text-left shadow-card hover:border-brand-200 transition-colors">
          <span className="w-9 h-9 rounded-xl bg-[#F4F1FE] text-brand-600 flex items-center justify-center shrink-0">
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/></svg>
          </span>
          <span className="min-w-0"><span className="block text-[11px] font-bold text-ink-900">Savings</span><span className="block text-[9px] text-ink-500 mt-0.5">{savingsGoals.filter((goal) => goal.currentCentavos > 0).length} active goals</span></span>
        </button>
        <button onClick={() => navigate('/tasks')} className="bg-white rounded-[17px] border border-[#ECE8FA] p-2.5 flex items-center gap-2.5 text-left shadow-card hover:border-brand-200 transition-colors">
          <span className="w-9 h-9 rounded-xl bg-[#F4F1FE] text-brand-600 flex items-center justify-center shrink-0">
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H5v14h14v-4"/><path d="m9 12 3 3L21 6"/></svg>
          </span>
          <span className="min-w-0"><span className="block text-[11px] font-bold text-ink-900">Tasks</span><span className="block text-[9px] text-ink-500 mt-0.5">{pendingTasks} pending</span></span>
        </button>
      </section>

      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[13px] font-bold text-ink-900">Recent Activity</h2>
          {activityLog.length > 0 && <button onClick={() => navigate('/wallet')} className="text-[10px] font-semibold text-brand-600 hover:underline">See all</button>}
        </div>
        <div className="bg-white rounded-[18px] border border-[#ECE8FA] px-3.5 py-1 shadow-card">
          {activityLog.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-7 text-center">
              <div className="w-10 h-10 rounded-full bg-[#EAE4FC] flex items-center justify-center mb-2.5 text-brand-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 className="text-[14px] font-bold text-ink-900 mb-1">No recent activity</h3>
              <p className="text-[11px] text-ink-500">Add an expense, task, or goal to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F1EEF8]">
              {activityLog.slice(0, 4).map((activity) => (
                <button key={activity.id} onClick={() => navigate(activityRoutes[activity.type])} className="w-full flex items-center gap-2.5 py-2.5 text-left hover:bg-gray-50/60 transition-colors rounded-lg">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${activity.type === 'expense' ? 'bg-[#FCE7EE] text-[#DB4377]' : activity.type === 'savings' ? 'bg-[#E3F7ED] text-[#16A34A]' : 'bg-[#F4F1FE] text-brand-600'}`}>
                    {activity.type === 'expense' ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 3h10v18H7zM9 7h6M9 11h6M9 15h4"/></svg> : activity.type === 'savings' ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg> : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4 4L19 6"/></svg>}
                  </span>
                  <span className="flex-1 min-w-0"><span className="block text-[11px] font-bold text-ink-900 truncate">{activity.title}</span><span className="block text-[9px] text-ink-500 mt-0.5 truncate">{activity.subtitle}</span></span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
