import { useNavigate } from 'react-router-dom';
import { PiggyBank, Target, Edit, Trash2, ChevronLeft, PlusCircle } from 'lucide-react';
import { useDayflowStore } from '@/store/useDayflowStore';
import { formatPesoFromCentavos } from '@/utils/format';

export default function SavingsScreen() {
  const navigate = useNavigate();
  const {
    totalSavings,
    savingsGoals,
    deleteSavingsGoal,
    openModal,
  } = useDayflowStore();

  const activeGoalCount = savingsGoals.filter((g) => g.currentCentavos > 0).length;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar relative flex flex-col px-5 pt-2 pb-[calc(112px+env(safe-area-inset-bottom))]">
      <header className="grid grid-cols-[44px_1fr_44px] items-center mb-4">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 -ml-1 rounded-xl text-ink-900 hover:bg-brand-100/60 transition-colors flex items-center justify-center"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[18px] font-extrabold text-ink-900 text-center">Savings</h1>
        <div aria-hidden="true" />
      </header>

      <section className="savings-total-card relative overflow-hidden bg-gradient-to-r from-[#EFEAFC] to-[#DDD2FA] rounded-[22px] px-5 py-4 mb-5 flex items-center justify-between gap-3 shadow-card min-h-[82px]">
        <div className="relative z-[1] min-w-0">
          <div className="text-[11px] font-semibold text-ink-700">Total Savings</div>
          <div className="text-[26px] leading-tight font-extrabold text-ink-900 tracking-tight tabular-nums mt-1">{formatPesoFromCentavos(totalSavings, true)}</div>
        </div>
        <div className="relative z-[1] flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-full bg-white/80 ring-1 ring-white/70 flex items-center justify-center text-brand-600 shadow-sm">
            <PiggyBank className="w-[18px] h-[18px]" />
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/90 text-ink-900 text-[11px] font-bold shadow-sm whitespace-nowrap">
            <span className="text-[12px] text-brand-700">{activeGoalCount}</span>
            <span className="text-ink-500">Active Goals</span>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-[14px] font-extrabold text-ink-900">My Goals</h2>
        {savingsGoals.length > 0 && <span className="text-[10px] font-semibold text-ink-500">{savingsGoals.length} {savingsGoals.length === 1 ? 'goal' : 'goals'}</span>}
      </div>

      {savingsGoals.length === 0 ? (
        <div className="bg-white rounded-[22px] border border-[#ECE8FA] p-5 sm:p-6 text-center mb-6 shadow-card">
          <div className="w-[52px] h-[52px] rounded-[17px] bg-[#F4F1FE] flex items-center justify-center mx-auto mb-3.5 ring-1 ring-[#EAE4FC]">
            <PiggyBank className="w-[23px] h-[23px] text-brand-600" />
          </div>
          <h3 className="text-[15px] font-extrabold text-ink-900 mb-1">No savings goals yet</h3>
          <p className="max-w-[270px] mx-auto text-[12px] leading-relaxed text-ink-500 mb-5">Set a target amount and track your savings progress locally.</p>
          <button
            onClick={() => openModal('savings')}
            className="w-full min-h-[50px] py-3 rounded-[16px] bg-brand-600 hover:bg-brand-700 text-white font-bold text-[14px] shadow-hero transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-[17px] h-[17px]" />
            Create Goal
          </button>
        </div>
      ) : (
        <div className="space-y-3.5 mb-6">
          {savingsGoals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentCentavos / goal.targetCentavos) * 100));
            return (
              <div key={goal.id} className="bg-white rounded-[20px] border border-[#ECE8FA] p-4 shadow-card">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F1FE] flex items-center justify-center shrink-0 text-brand-600">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 text-[15px] font-semibold text-ink-900 truncate">{goal.title}</div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('savings', goal.id, 'savings');
                      }}
                      className="p-1.5 text-ink-500 hover:text-brand-600 rounded-lg hover:bg-brand-50/60"
                      aria-label="Edit goal"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await deleteSavingsGoal(goal.id);
                    }}
                      className="p-1.5 text-[#E11D48] hover:bg-[#FCE7EE] rounded-lg"
                      aria-label="Delete goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-[13px] font-semibold text-ink-900 tabular-nums">{formatPesoFromCentavos(goal.currentCentavos)}</span>
                    <span className="text-[13px] text-ink-500 tabular-nums"> / {formatPesoFromCentavos(goal.targetCentavos)}</span>
                  </div>
                  <span className="text-[14px] font-bold text-brand-600">{pct}%</span>
                </div>
                <div className="h-2 bg-[#F4F1FE] rounded-full overflow-hidden">
                  <div className="h-full bg-[#6D42EF] rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {savingsGoals.length > 0 && (
        <button
          onClick={() => openModal('savings')}
          className="w-full py-3.5 rounded-[16px] bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-bold text-[15px] shadow-hero flex items-center justify-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Goal</span>
        </button>
      )}
    </div>
  );
}
