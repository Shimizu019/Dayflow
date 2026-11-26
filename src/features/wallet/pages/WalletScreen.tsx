import { useNavigate } from 'react-router-dom';
import { useDayflowStore, type WalletPeriod } from '@/store/useDayflowStore';
import { formatPeso } from '@/utils/format';

export default function WalletScreen() {
  const navigate = useNavigate();
  const {
    currentBalance,
    totalIncome,
    totalExpenses,
    spending,
    transactions,
    walletPeriod,
    setWalletPeriod,
  } = useDayflowStore();

  const r = 46;
  const C = 2 * Math.PI * r;
  const seg1 = (spending[0].pct / 100) * C;
  const seg2 = (spending[1].pct / 100) * C;
  const seg3 = (spending[2].pct / 100) * C;

  const txRows = transactions.map((tx) => {
    const isFood = tx.type === 'food';
    return (
      <div key={tx.id} className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              isFood ? 'bg-[#FCE7EE] text-[#DB4377]' : 'bg-[#E3F7ED] text-[#16A34A]'
            }`}
          >
            {isFood ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2a1 1 0 011 1v5a2 2 0 002 2V3a1 1 0 112 0v7a2 2 0 002-2V3a1 1 0 112 0v5a4 4 0 01-3 3.87V21a1 1 0 11-2 0v-9.13A4 4 0 016 8V3a1 1 0 011-1zm11 0a3 3 0 013 3v7a1 1 0 01-1 1h-1v8a1 1 0 11-2 0V3a1 1 0 011-1z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11v6a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H8v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-6zm2.5 2a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zm9 0a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zM7.8 9.5h8.4l-.8-2.5H8.6l-.8 2.5z" />
              </svg>
            )}
          </div>
          <div>
            <div className="text-[14px] font-bold text-ink-900">{tx.title}</div>
            <div className="text-[12px] text-ink-500 mt-0.5">{`${formatPeso(tx.amount)} • ${tx.timeLabel}`}</div>
          </div>
        </div>
        <button
          onClick={() => {}}
          className="p-1.5 text-ink-500 hover:text-ink-900 rounded-lg"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
          </svg>
        </button>
      </div>
    );
  });

  const periods: WalletPeriod[] = ['This Month', 'This Week', 'All Time'];

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
        <h1 className="text-[17px] font-bold text-ink-900">My Wallet</h1>
        <button
          onClick={() => navigate('/schedule')}
          className="p-1.5 -mr-1.5 rounded-xl text-ink-900 hover:bg-brand-100/60 transition-colors"
          aria-label="Schedule"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="17" rx="3" />
            <path strokeLinecap="round" d="M8 2v4M16 2v4M3 9h18" />
          </svg>
        </button>
      </div>

      <div className="hero-purple-card rounded-[24px] px-5 py-5 text-white shadow-hero mb-3.5 flex items-center justify-between">
        <div>
          <div className="text-[13px] font-medium text-white/85">Current Balance</div>
          <div className="text-[28px] font-extrabold tracking-tight mt-0.5">{formatPeso(currentBalance, true)}</div>
        </div>
        <div className="w-11 h-11 rounded-2xl border border-white/30 bg-white/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="6" width="18" height="13" rx="3" />
            <path d="M16 12.5h3" />
            <path d="M6 6V5a2 2 0 012-2h8a2 2 0 012 2v1" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white rounded-[20px] p-3.5 shadow-card flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#E3F7ED] text-[#16A34A] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="text-[11px] font-medium text-ink-500">Total Income</div>
            <div className="text-[15px] font-extrabold text-ink-900 mt-0.5">{formatPeso(totalIncome)}</div>
          </div>
        </div>
        <div className="bg-[#FDF5F7] rounded-[20px] p-3.5 shadow-card flex items-center gap-3 border border-[#FCE7EE]/70">
          <div className="w-9 h-9 rounded-full bg-[#FCE4EC] text-[#E11D48] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="text-[11px] font-medium text-ink-500">Total Expenses</div>
            <div className="text-[15px] font-extrabold text-ink-900 mt-0.5">{formatPeso(totalExpenses)}</div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-ink-900">Spending Overview</h2>
          <button
            onClick={() => {
              const idx = periods.indexOf(walletPeriod);
              const next = periods[(idx + 1) % periods.length];
              setWalletPeriod(next);
            }}
            className="px-3 py-1 rounded-xl bg-brand-100/80 text-ink-900 text-[11px] font-semibold flex items-center gap-1 hover:bg-brand-100 transition-colors"
          >
            <span>{walletPeriod}</span>
            <svg className="w-3.5 h-3.5 text-ink-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-between px-2 py-1">
          <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={r}
                fill="transparent"
                stroke="#C7B6FB"
                strokeWidth="22"
                strokeDasharray={`${seg3} ${C}`}
                strokeDashoffset={`-${seg1 + seg2}`}
              />
              <circle
                cx="60"
                cy="60"
                r={r}
                fill="transparent"
                stroke="#9370F8"
                strokeWidth="22"
                strokeDasharray={`${seg2} ${C}`}
                strokeDashoffset={`-${seg1}`}
              />
              <circle
                cx="60"
                cy="60"
                r={r}
                fill="transparent"
                stroke="#5D32E6"
                strokeWidth="22"
                strokeDasharray={`${seg1} ${C}`}
                strokeDashoffset="0"
              />
            </svg>
          </div>
          <div className="space-y-2.5 pr-2">
            {spending.map((item) => (
              <div key={item.label} className="flex items-start gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <div className="text-[12px] font-semibold text-ink-900 leading-tight">{item.label}</div>
                  <div className="text-[12px] font-bold text-ink-900">{item.pct}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-[15px] font-bold text-ink-900">Transactions</h2>
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
        <div className="bg-white rounded-[22px] shadow-card divide-y divide-gray-100 px-4">
          {txRows}
        </div>
      </div>
    </div>
  );
}
