import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDayflowStore } from '@/store/useDayflowStore';
import { formatPesoFromCentavos } from '@/utils/format';

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Drinks': '#FFFFFF',
  Transport: '#D7C4FF',
  Others: '#A98AF8',
};

const CATEGORY_ICONS: Record<string, { bg: string; text: string }> = {
  'Food & Drinks': { bg: '#FCE7EE', text: '#DB4377' },
  Transport: { bg: '#E3F7ED', text: '#16A34A' },
  Others: { bg: '#ECE8FA', text: '#6D42EF' },
};

export default function WalletScreen() {
  const navigate = useNavigate();
  const { expenses, walletPeriod, setWalletPeriod, deleteExpense, openModal } = useDayflowStore();
  const [now] = useState(() => new Date());
  const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  const [selectedRange, setSelectedRange] = useState(() => walletPeriod === 'This Month' ? monthKey(now) : walletPeriod);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const monthOptions = useMemo(() => Array.from({ length: 13 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return { value: monthKey(date), label: i === 0 ? 'This Month' : date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) };
  }), [now]);
  const filteredExpenses = expenses.filter((expense) => {
    const date = new Date(`${expense.date}T00:00:00`);
    if (selectedRange.startsWith('month:')) return monthKey(date) === selectedRange.slice(6);
    if (/^\d{4}-\d{2}$/.test(selectedRange)) return monthKey(date) === selectedRange;
    if (selectedRange === 'This Week') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7);
      return date >= start && date < end;
    }
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  const total = filteredExpenses.reduce((sum, expense) => sum + expense.amountCentavos, 0);
  const labels = ['Food & Drinks', 'Transport', 'Others'];
  const rawCategories = labels.map((label) => {
    const amount = filteredExpenses.filter((expense) => expense.category === label).reduce((sum, expense) => sum + expense.amountCentavos, 0);
    const exactPct = total ? amount / total * 100 : 0;
    return { label, amount, pct: Math.floor(exactPct), remainder: exactPct % 1, color: CATEGORY_COLORS[label] };
  });
  const remainingPct = total ? 100 - rawCategories.reduce((sum, category) => sum + category.pct, 0) : 0;
  const categories = rawCategories.map((category) => ({ ...category, pct: category.pct + (rawCategories.slice().sort((a, b) => b.remainder - a.remainder).slice(0, remainingPct).some((item) => item.label === category.label) ? 1 : 0) }));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this expense? This action cannot be undone.')) await deleteExpense(id);
  };
  const changeRange = (value: string) => {
    setSelectedRange(value);
    setSelectedCategory(null);
    if (value === 'This Week' || value === 'All Time') setWalletPeriod(value);
    else setWalletPeriod('This Month');
  };
  const formatExpenseDate = (date: string, createdAt: string) => {
    const parsed = new Date(`${date}T00:00:00`);
    const dateLabel = parsed.toDateString() === now.toDateString()
      ? 'Today'
      : parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const time = new Date(createdAt);
    const timeLabel = Number.isNaN(time.getTime()) ? '' : time.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    return timeLabel ? `${dateLabel} · ${timeLabel}` : dateLabel;
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar relative flex flex-col px-3 pt-2 pb-[calc(112px+env(safe-area-inset-bottom))]">
      <header className="mb-4 min-h-[32px] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
        <button onClick={() => navigate('/')} className="p-1.5 -ml-1.5 rounded-xl text-ink-900 hover:bg-brand-100/60 shrink-0" aria-label="Back home">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <h1 className="text-[16px] font-bold text-ink-900 whitespace-nowrap">My Wallet</h1>
        </div>
        <label className="px-2.5 py-1.5 rounded-xl bg-brand-50 text-brand-600 text-[10px] font-semibold flex items-center gap-1 shrink-0">
          <span className="sr-only">Filter wallet period</span>
          <select value={selectedRange} onChange={(event) => changeRange(event.target.value)} className="max-w-[105px] appearance-none bg-transparent text-brand-600 outline-none" aria-label="Filter wallet period">
            {monthOptions.map((month) => <option key={month.value} value={month.value}>{month.label}</option>)}
            <option value="This Week">This Week</option><option value="All Time">All Time</option>
          </select>
          <svg className="w-3 h-3 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
        </label>
      </header>

      <section className="wallet-summary-card relative overflow-hidden rounded-[20px] border border-white/20 p-4 mb-4 text-white shadow-hero">
        <div className="relative z-[1] flex items-start justify-between border-b border-white/20 pb-3 mb-3">
          <div><div className="text-[11px] font-medium text-white/75">Total Expenses</div><div className="text-[23px] leading-tight font-extrabold tracking-tight text-white tabular-nums mt-1">{formatPesoFromCentavos(total, true)}</div></div>
          {total > 0 && <span className="px-2.5 py-1 rounded-lg bg-white/20 text-white/90 text-[9px] font-semibold">Tap category</span>}
        </div>
        <div className="relative z-[1] flex items-center justify-between px-1 py-0.5">
          <div className="relative w-[96px] h-[96px] sm:w-[116px] sm:h-[116px] shrink-0 flex items-center justify-center">
            <svg className="w-[96px] h-[96px] sm:w-[116px] sm:h-[116px] -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={radius} fill="transparent" stroke="rgba(255,255,255,0.24)" strokeWidth="22" />
              {categories.map((category) => {
                const length = category.pct / 100 * circumference;
                const dashOffset = offset;
                offset += length;
                return category.pct ? <circle key={category.label} role="button" tabIndex={0} aria-label={`${category.label}: ${category.pct}%`} onClick={() => setSelectedCategory(selectedCategory === category.label ? null : category.label)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelectedCategory(selectedCategory === category.label ? null : category.label); }} className="cursor-pointer" cx="60" cy="60" r={radius} fill="transparent" stroke={category.color} strokeWidth="22" strokeDasharray={`${length} ${circumference}`} strokeDashoffset={-dashOffset} /> : null;
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-[9px] text-white/75">{selectedCategory ?? 'Total'}</span><span className="text-[11px] font-bold text-white tabular-nums">{formatPesoFromCentavos(selectedCategory ? categories.find((item) => item.label === selectedCategory)?.amount ?? 0 : total, true)}</span>{selectedCategory && <span className="text-[9px] font-semibold text-white/75">{categories.find((item) => item.label === selectedCategory)?.pct ?? 0}%</span>}</div>
          </div>
          <div className="space-y-3 pr-1">
            {categories.map((category) => <button type="button" key={category.label} onClick={() => setSelectedCategory(selectedCategory === category.label ? null : category.label)} className={`flex items-center gap-2 text-left rounded-md ${selectedCategory === category.label ? 'bg-white/15' : ''}`}><span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: category.color }}/><span className="flex items-center justify-between gap-2 sm:gap-3 min-w-0 w-[128px]"><span className="text-[10px] sm:text-[11px] font-semibold text-white leading-tight truncate">{category.label}</span><span className="text-[10px] sm:text-[11px] font-bold text-white tabular-nums">{category.pct}%</span></span></button>)}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-2"><h2 className="text-[13px] font-bold text-ink-900">Transactions</h2><span className="text-[10px] font-medium text-ink-500">{filteredExpenses.length} {filteredExpenses.length === 1 ? 'record' : 'records'}</span></div>
        {filteredExpenses.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-[#ECE8FA] p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#ECE8FA] flex items-center justify-center mx-auto mb-3"><svg className="w-6 h-6 text-[#A78BFA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11h6m-3-6v6M12 3a9 9 0 100 18 9 9 0 000-18z" /></svg></div>
            <h3 className="text-[15px] font-bold text-ink-900">No expenses yet</h3><p className="text-[13px] text-ink-500 mt-1">Tap the center + button to record your first expense.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[18px] border border-[#ECE8FA] shadow-card divide-y divide-[#F0EDF8] px-3.5 py-1">
            {filteredExpenses.map((expense) => {
              const icon = CATEGORY_ICONS[expense.category] ?? CATEGORY_ICONS.Others;
              return <div key={expense.id} className="flex items-center justify-between gap-2 py-2.5">
                <div className="flex-1 min-w-0"><div className="text-[11px] font-semibold text-ink-900 truncate">{expense.title}</div><div className="flex items-center gap-1.5 mt-1 min-w-0"><span className="rounded-md px-1.5 py-0.5 text-[8px] font-semibold whitespace-nowrap" style={{ backgroundColor: icon.bg, color: icon.text }}>{expense.category}</span><span className="text-[9px] text-ink-500 truncate">{formatExpenseDate(expense.date, expense.createdAt)}</span></div></div>
                <div className="flex items-center gap-1 shrink-0"><span className="text-[10px] font-bold text-ink-900 tabular-nums mr-1">{formatPesoFromCentavos(expense.amountCentavos, true)}</span>
                  <button onClick={() => openModal('expense', expense.id, 'expense')} className="p-1.5 text-ink-400 hover:text-brand-600 rounded-lg" aria-label={`Edit ${expense.title}`}><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                  <button onClick={() => handleDelete(expense.id)} className="p-1.5 text-ink-400 hover:text-rose-600 rounded-lg" aria-label={`Delete ${expense.title}`}><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                </div>
              </div>;
            })}
          </div>
        )}
      </section>
    </div>
  );
}
